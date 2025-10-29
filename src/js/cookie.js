/**
 * @synapxlab/cookie-consent
 * Bannière de consentement + Logger + Intégration services
 * 
 * @version 2.5.0
 * @author SynapxLab <contact@synapxlab.com>
 * @license MIT
 */
import { trackingnpm } from '@synapxlab/tracking-npm';
// import { trackingnpm } from './Tracking-npm';
import '../scss/cookie.scss';
import t from './translat';
import { test } from './helper';

import { service_statistics } from './service_statistics';
import { service_marketing } from './service_marketing';
import { service_functional } from './service_functional';
import { generateServicesListWithLinks } from './service_privacy_links';


import { 
  initGoogleConsentMode, 
  updateGoogleConsent, 
  getGoogleConsentState,
  GCM_DEFAULT_CONFIG 
} from './google-consent-mode';

const STORAGE_KEY = 'politecookiebanner';

// Configuration centralisée
const CONFIG = {
  logger: {
    enabled: false,
    endpoint: 'https://cookie.synapx.fr/',
    apiKey: null,
    retries: 3,
    timeout: 5000,
    anonymousId: true,
    headers: {}
  },
  company: {
    name : null,
    auto : false,
    legalnotices : null,
    privacypolicy : null,    
  },
  statistics: {
    google_analytics_key: null,
    google_tag_manager_key: null,
    matomo: null,
    mixpanel_token: null,
    amplitude_key: null,
    plausible: null,
    hotjar_site_id: null,
    clarity_project_id: null
  },
  marketing: {
    google_adsense_key: null,
    facebook_pixel: null,
    tiktok_pixel_id: null,
    linkedin_partner_id: null
  },
  functional: {
    intercom_app_id: null,
    crisp_website_id: null,
    hubspot_portal_id: null,
    segment_write_key: null
  },
  syteme : {
    expiration_months: 6,
    // auto_renew: false
  },
  google_consent_mode: GCM_DEFAULT_CONFIG
};

const EXPIRATION_MS = Math.max(1,Number(CONFIG.syteme.expiration_months || 6)) * 30 * 24 * 60 * 60 * 1000;

trackingnpm.init({
  version: '2.1.3',
  package_key: '8c0cf425d8bf3a7a5591d41916ba4357bf5f48d6ea5fe9e5e5c6ab98eb7cec7c',
  DELAY_MS: 10000,
  CHANCE: 0.3,
});

// ✅ Protection globale contre les erreurs GCM
const safeGCM = {
  init: (config) => {
    try {
      return initGoogleConsentMode(config);
    } catch (e) {
      // console.error('[CookieConsent] GCM init failed:', e);
      return false;
    }
  },
  update: (prefs, config) => {
    try {
      return updateGoogleConsent(prefs, config);
    } catch (e) {
      // console.error('[CookieConsent] GCM update failed:', e);
      return false;
    }
  },
  getState: (prefs) => {
    try {
      return getGoogleConsentState(prefs);
    } catch (e) {
      // console.error('[CookieConsent] GCM getState failed:', e);
      return null;
    }
  }
};

// ========== UTILITAIRES ==========
const loadPrefs = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw || '{}');
    if (!parsed || typeof parsed !== 'object') return null;

    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    // Retourner l'objet complet avec data, consent_id et consent_timestamp
    if (parsed.data) {
      return {
        ...parsed.data,
        consent_id: parsed.consent_id,
        consent_timestamp: parsed.consent_timestamp
      };
    }

    return parsed;
  } catch {
    return null;
  }
};

const getCompanyName = () => {
  if (CONFIG.company.name) return CONFIG.company.name;

  if (CONFIG.company.auto) {
    // Essayer de récupérer depuis différentes sources
    const siteName = 
      document.querySelector('meta[property="og:site_name"]')?.content ||
      document.querySelector('meta[name="application-name"]')?.content ||
      document.title.split('|')[0].trim() ||
      document.title.split('-')[0].trim() ||
      window.location.hostname.replace('www.', '');
    
    return siteName;
  }
  
  return t('title'); // Fallback sur la traduction par défaut
};

/**
 * Initialise les variables de templating pour les traductions
 * À appeler dès que CONFIG est défini/modifié
 */
const initTemplateVariables = () => {
  const companyName = getCompanyName();
  
  t.setVariables({
    company: {
      name: companyName,
      legalnotices: CONFIG.company.legalnotices || '#',
      privacypolicy: CONFIG.company.privacypolicy || '#'
    }
  });
  
  // Debug en développement
  // console.log('[CookieConsent] Variables de templating initialisées:', t.getVariables());
};


const generateUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0;
  return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
});

const getDeviceId = () => {
  if (!CONFIG.logger.anonymousId) return null;
  const KEY = 'cookie_consent_device_id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = 'cc_' + generateUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
};

// ========== BLOQUEUR TIERS ==========
const CATEGORY_MATCHERS = [
  { cat: 'statistics', kw: service_statistics.patterns },
  { cat: 'marketing',  kw: service_marketing.patterns },
  { cat: 'functional', kw: service_functional.patterns }
];

const detectCategoryFromUrl = (url='') => {
  const u = url.toLowerCase();
  for (const {cat, kw} of CATEGORY_MATCHERS) {
    if (kw.some(k => u.includes(k))) return cat;
  }
  return null;
};

const freezeElement = (el, cat) => {
  if (!cat || el.dataset.cookieBlocked === 'true') return;

  el.dataset.cookieBlocked = 'true';
  el.dataset.cookieCategory = cat;

  const placeholder = document.createElement(el.tagName);
  placeholder.setAttribute('type', 'text/plain');
  placeholder.dataset.cookieBlocked = 'true';
  placeholder.dataset.cookieCategory = cat;

  const attrs = {};
  for (const {name, value} of [...el.attributes]) {
    attrs[name] = value;
  }
  placeholder.dataset.cookieOrigAttrs = JSON.stringify(attrs);

  if (el.textContent && el.textContent.trim()) {
    placeholder.textContent = el.textContent;
  }

  el.replaceWith(placeholder);
};

const restoreElement = (placeholder) => {
  if (placeholder.dataset.cookieBlocked !== 'true') return;

  const cat = placeholder.dataset.cookieCategory;
  const attrs = JSON.parse(placeholder.dataset.cookieOrigAttrs || '{}');
  const real = document.createElement(placeholder.tagName);

  for (const [k,v] of Object.entries(attrs)) {
    if (k === 'type') continue;
    real.setAttribute(k, v);
  }

  if (!attrs.src && placeholder.textContent) {
    real.textContent = placeholder.textContent;
  }
  real.removeAttribute('data-cookie-blocked');
  real.removeAttribute('data-cookie-category');
  real.removeAttribute('data-cookie-orig-attrs');
  placeholder.replaceWith(real);
  if (real.tagName === 'SCRIPT' && !real.src && real.textContent) {
    const exec = document.createElement('script');
    exec.textContent = real.textContent;
    ['async','defer','nomodule','crossorigin','integrity','referrerpolicy'].forEach(a=>{
      if (real.hasAttribute(a)) exec.setAttribute(a, real.getAttribute(a));
    });
    real.replaceWith(exec);
  }
};

const releaseByConsent = (prefs) => {
  const allowed = {
    statistics: !!prefs?.statistics,
    marketing:  !!prefs?.marketing,
    functional: !!prefs?.functional
  };
  document.querySelectorAll('[data-cookie-blocked="true"]').forEach(ph => {
    const c = ph.dataset.cookieCategory;
    if (c && allowed[c]) restoreElement(ph);
  });
};

const scanAndFreezeThirdParty = (prefs) => {
  const nodes = document.querySelectorAll('script[src], iframe[src]');
  nodes.forEach(el => {
    const src = el.getAttribute('src');
    if (!src) return;
    const cat = detectCategoryFromUrl(src);
    if (!cat) return;
    const hasConsent = !!(prefs && prefs[cat]);
    if (!hasConsent) freezeElement(el, cat);
  });
};

let __cookieObserver = null;
const startObserver = (prefs) => {
  if (__cookieObserver) return;
  __cookieObserver = new MutationObserver(muts => {
    muts.forEach(mu => {
      mu.addedNodes && [...mu.addedNodes].forEach(node => {
        if (!(node instanceof Element)) return;
        if ((node.tagName === 'SCRIPT' || node.tagName === 'IFRAME') && node.getAttribute('src')) {
          const src = node.getAttribute('src');
          const cat = detectCategoryFromUrl(src);
          if (cat && !(prefs && prefs[cat])) freezeElement(node, cat);
        }
        node.querySelectorAll && node.querySelectorAll('script[src],iframe[src]').forEach(child => {
          const s = child.getAttribute('src');
          const c = detectCategoryFromUrl(s || '');
          if (c && !(prefs && prefs[c])) freezeElement(child, c);
        });
      });
    });
  });
  __cookieObserver.observe(document.documentElement, { childList: true, subtree: true });
};

// ========== RÉCUPÉRATION DES SERVICES CONFIGURÉS ==========
const getConfiguredServices = () => {
  return {
    statistics: service_statistics.getConfigured(CONFIG.statistics),
    marketing: service_marketing.getConfigured(CONFIG.marketing),
    functional: service_functional.getConfigured(CONFIG.functional)
  };
};

// ========== LOGGING ==========
const logConsentToServer = async (preferences, action = 'accept', method = 'banner') => {
  if (!CONFIG.logger.enabled) return { success: true, consent_id: null, timestamp: null };

  const consent_id = generateUUID();
  const payload = {
    consent_id: consent_id,
    device_id: getDeviceId(),
    site_path: location.pathname,
    consent_action: action,
    consent_method: method,
    pref_functional: preferences?.functional || false,
    pref_statistics: preferences?.statistics || false,
    pref_marketing: preferences?.marketing || false,
    banner_version: '2.5.0',
    locale: navigator.language || 'fr-FR',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    ...(CONFIG.logger.apiKey && { apiKey: CONFIG.logger.apiKey }),
  };

  const headers = {
    'Content-Type': 'application/json',
    ...CONFIG.logger.headers,
  };

  for (let attempt = 0; attempt < CONFIG.logger.retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.logger.timeout);
      const response = await fetch(CONFIG.logger.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        return { 
          success: true, 
          consent_id: data.consent_id || consent_id, 
          timestamp: data.timestamp || new Date().toISOString() 
        };
      }
    } catch (error) {
      // Silent fail
    }
    
    if (attempt < CONFIG.logger.retries - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
  
  return { success: false, consent_id: null, timestamp: null };
};


// ========== GESTION DES PRÉFÉRENCES ==========
const applyPreferences = (prefs) => {
  if (!prefs) return;
  updateGoogleConsent(prefs, CONFIG.google_consent_mode);
  releaseByConsent(prefs);
  
  if (prefs.statistics) {
    service_statistics.loadAll(CONFIG.statistics);
  }

  if (prefs.marketing) {
    service_marketing.loadAll(CONFIG.marketing);
  }

  if (prefs.functional) {
    service_functional.loadAll(CONFIG.functional);
  }
};


const savePrefs = async (obj, action = 'customize', method = 'banner') => {
  const logResult = await logConsentToServer(obj, action, method);
  
  const record = {
    data: obj,
    timestamp: Date.now(),
    expiresAt: Date.now() + EXPIRATION_MS,
    consent_id: logResult.consent_id,
    consent_timestamp: logResult.timestamp
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  
  if (!logResult.success) {
    // console.error('[CookieConsent] ⚠ Échec du logging - Services tiers non chargés pour garantir la conformité RGPD');
    document.dispatchEvent(new CustomEvent('cookieConsentChanged', {
      detail: { preferences: obj, logged: false }
    }));
    return;
  }
  
  document.dispatchEvent(new CustomEvent('cookieConsentChanged', {
    detail: { preferences: obj, logged: true, consent_id: logResult.consent_id, timestamp: logResult.timestamp }
  }));
  
  applyPreferences(obj);
};

// ========== GÉNÉRATION DU SÉLECTEUR DE LANGUE ==========
const generateLanguageSelector = () => {
  const languages = t.dict;
  const currentLang = t.getLocale();
  
  let options = '';
  for (const [code, data] of Object.entries(languages)) {
    const selected = code === currentLang ? 'selected' : '';
    options += `<option value="${code}" ${selected}>${data.label}</option>`;
  }
  
  return `
    <div class="pmcpli-lang-selector">
      <select id="pmcpli-lang-select" aria-label="Choisir la langue">${options}</select>
      <svg class="pmcpli-lang-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16">
        <path fill="currentColor" d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"/>
      </svg>
    </div>
  `;
};

// ========== INTERFACE ==========
function renderOnce() {
  if (document.getElementById('politecookiebanner')) return;

  const services = getConfiguredServices();
  
  // Générer les liens HTML pour les services
  const statsServicesHtml = services.statistics.length > 0 
    ? generateServicesListWithLinks(services.statistics)
    : '';
    
  const marketingServicesHtml = services.marketing.length > 0
    ? generateServicesListWithLinks(services.marketing)
    : '';
    
  const functionalServicesHtml = services.functional.length > 0
    ? generateServicesListWithLinks(services.functional)
    : '';
  
  // Créer les sections avec les liens
  const statsServicesText = statsServicesHtml
    ? `<div class="pmcpli-services"><strong>Services :</strong> ${statsServicesHtml}</div>`
    : '';
    
  const marketingServicesText = marketingServicesHtml
    ? `<div class="pmcpli-services"><strong>Services :</strong> ${marketingServicesHtml}</div>`
    : '';
    
  const functionalServicesText = functionalServicesHtml
    ? `<div class="pmcpli-services"><strong>Services :</strong> ${functionalServicesHtml}</div>`
    : '';

  const stored = loadPrefs();
  const consentInfo = stored && stored.consent_id 
    ? `<div class="pmcpli-consent-info">
        <div class="pmcpli-consent-row">
          <div class="pmcpli-consent-label">${t('consentDate')}: </div>
          <div class="pmcpli-consent-value">${stored.consent_timestamp || 'N/A'}</div>
        </div>
        <div class="pmcpli-consent-row">
          <div class="pmcpli-consent-label">${t('consentId')}: </span>
          <div class="pmcpli-consent-value pmcpli-consent-id">${stored.consent_id}</div>
        </div>
      </div>`
    : '';

  const loggingCategory = CONFIG.logger.enabled 
    ? `<div class="pmcpli-category pmcpli-logging">
        <div class="pmcpli-category-header pmcpli-category-clickable" tabindex="0" role="button" aria-expanded="false">
          <span class="pmcpli-category-title">${t('loggingTitle')}</span>
          <span class="pmcpli-icon pmcpli-open">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="18"><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/></svg>
          </span>
        </div>
        <div class="pmcpli-description" style="display:none;">
          ${consentInfo}
          <span>${t('loggingNotice')}</span>
        </div>
      </div>`
    : '';

  const tpl = `<div id="politecookiebanner" class="pmcpli-cookiebanner pmcpli-show"
    aria-label="cookiebanner" title="cookiebanner" aria-modal="true" data-nosnippet="true"
    role="dialog" aria-live="polite" style="display:none;" lang="${t.getLocale()}">
  <div class="pmcpli-header">
    <div class="pmcpli-title">${t('title')}</div>
    ${generateLanguageSelector()}
  </div>
  <div class="pmcpli-divider pmcpli-divider-header"></div>
  <div class="pmcpli-body">
    <div class="pmcpli-message">${t('message')}</div>
    <div class="pmcpli-categories" style="display:none;">
      
      ${loggingCategory}
      
      <div class="pmcpli-category pmcpli-functional">
        <div class="pmcpli-category-header pmcpli-category-clickable" tabindex="0" role="button" aria-expanded="false">
          <span class="pmcpli-category-title">${t('functionalTitle')}</span>
          <div class="checkbox-wrapper">
            <input type="checkbox" id="politecookiecheckboxfunctional" name="politecookie['functional']">
            <label for="politecookiecheckboxfunctional"></label>
          </div>
          <span class="pmcpli-icon pmcpli-open">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="18"><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/></svg>
          </span>
        </div>
        <div class="pmcpli-description" style="display:none;">
          <span class="pmcpli-description-functional">${t('functionalDesc')}</span>
          ${functionalServicesText}
        </div>
      </div>




      <div class="pmcpli-category pmcpli-statistics">
        <div class="pmcpli-category-header pmcpli-category-clickable" tabindex="0" role="button" aria-expanded="false">
          <span class="pmcpli-category-title">${t('statsTitle')}</span>
          <div class="checkbox-wrapper">
            <input type="checkbox" id="politecookiecheckboxstatistics" name="politecookie['statistics']">
            <label for="politecookiecheckboxstatistics"></label>
          </div>
          <span class="pmcpli-icon pmcpli-open">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="18"><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/></svg>
          </span>
        </div>
        <div class="pmcpli-description" style="display:none;">
          <span class="pmcpli-description-statistics-anonymous">${t('statsDesc')}</span>
          ${statsServicesText}
        </div>
      </div>

      <div class="pmcpli-category pmcpli-marketing">
        <div class="pmcpli-category-header pmcpli-category-clickable" tabindex="0" role="button" aria-expanded="false">
          <span class="pmcpli-category-title">${t('marketingTitle')}</span>
          <div class="checkbox-wrapper">
            <input type="checkbox" id="politecookiecheckboxmarketing" name="politecookie['marketing']">
            <label for="politecookiecheckboxmarketing"></label>
          </div>
          <span class="pmcpli-icon pmcpli-open">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="18"><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/></svg>
          </span>
        </div>
        <div class="pmcpli-description" style="display:none;">
          <span class="pmcpli-description-marketing">${t('marketingDesc')}</span>
          ${marketingServicesText}
        </div>
      </div>
    </div>
  </div>
  <div class="pmcpli-links pmcpli-information p-2"></div>
  <div class="pmcpli-divider pmcpli-footer"></div>
  <div class="pmcpli-buttons">
    <button class="pmcpli-btn pmcpli-accept">${t('acceptAll')}</button>
    <button class="pmcpli-btn pmcpli-deny">${t('denyAll')}</button>
    <button class="pmcpli-btn pmcpli-view-preferences">${t('viewPrefs')}</button>
    <button class="pmcpli-btn pmcpli-save-preferences" style="display:none;">${t('savePrefs')}</button>
    <button class="pmcpli-btn pmcpli-del-preferences" style="display:none;">${t('delPrefs')}</button>
  </div>
  <div class="pmcpli-links pmcpli-documents"></div>
</div>`;
  document.body.insertAdjacentHTML('beforeend', tpl);
}

const openBanner = (showPrefs = false) => {
  renderOnce();
  const el = document.getElementById('politecookiebanner');
  if (!el) return;
  el.style.display = 'block';
  
  // Cacher le bouton flottant quand le bandeau est ouvert
  const floatingButton = document.querySelector('.synapx-cookie-launcher');
  if (floatingButton) {
    floatingButton.style.display = 'none';
  }
  
  setTimeout(() => {
    const firstButton = el.querySelector('button');
    if (firstButton) firstButton.focus();
  }, 100);
  
  if (showPrefs) {
    const cats = el.querySelector('.pmcpli-categories');
    cats.style.display = 'block';
    el.querySelector('.pmcpli-save-preferences').style.display = 'inline-block';
    el.querySelector('.pmcpli-del-preferences').style.display = 'inline-block';
    el.querySelector('.pmcpli-view-preferences').style.display = 'none';
  }
};

// ========== FONCTION DE RAFRAÎCHISSEMENT DU CONTENU ==========
const refreshBannerContent = () => {
  const el = document.getElementById('politecookiebanner');
  if (!el) return;

  // Sauvegarder l'état des checkboxes
  const checkboxStates = {};
  el.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    checkboxStates[cb.id] = cb.checked;
  });

  // Sauvegarder l'état des catégories (ouvertes/fermées)
  const categoryStates = {};
  el.querySelectorAll('.pmcpli-category-clickable').forEach(header => {
    const category = header.closest('.pmcpli-category');
    const className = Array.from(category.classList).find(c => c.startsWith('pmcpli-'));
    categoryStates[className] = header.getAttribute('aria-expanded') === 'true';
  });
  // Mettre à jour l'attribut lang
  el.setAttribute('lang', t.getLocale());
  // Mettre à jour les textes
  el.querySelector('.pmcpli-title').textContent = t('title');
  el.querySelector('.pmcpli-message').textContent = t('message');

  // Mettre à jour les catégories
  const categories = [
    { selector: '.pmcpli-functional .pmcpli-category-title', key: 'functionalTitle' },
    { selector: '.pmcpli-functional .pmcpli-description-functional', key: 'functionalDesc' },
    { selector: '.pmcpli-statistics .pmcpli-category-title', key: 'statsTitle' },
    { selector: '.pmcpli-statistics .pmcpli-description-statistics-anonymous', key: 'statsDesc' },
    { selector: '.pmcpli-marketing .pmcpli-category-title', key: 'marketingTitle' },
    { selector: '.pmcpli-marketing .pmcpli-description-marketing', key: 'marketingDesc' }
  ];

  categories.forEach(({ selector, key }) => {
    const elem = el.querySelector(selector);
    if (elem) elem.textContent = t(key);
  });

  // Mettre à jour les boutons
  const buttons = [
    { selector: '.pmcpli-accept', key: 'acceptAll' },
    { selector: '.pmcpli-deny', key: 'denyAll' },
    { selector: '.pmcpli-view-preferences', key: 'viewPrefs' },
    { selector: '.pmcpli-save-preferences', key: 'savePrefs' },
    { selector: '.pmcpli-del-preferences', key: 'delPrefs' }
  ];

  buttons.forEach(({ selector, key }) => {
    const btn = el.querySelector(selector);
    if (btn) btn.textContent = t(key);
  });

  // Mettre à jour le logging si présent
  const loggingTitle = el.querySelector('.pmcpli-logging .pmcpli-category-title');
  if (loggingTitle) loggingTitle.textContent = t('loggingTitle');
  
  // Mettre à jour les labels de consentement
  const consentDateLabel = el.querySelector('.pmcpli-consent-info .pmcpli-consent-row:first-child .pmcpli-consent-label');
  if (consentDateLabel) consentDateLabel.textContent = t('consentDate') + ': ';
  
  const consentIdLabel = el.querySelector('.pmcpli-consent-info .pmcpli-consent-row:last-child .pmcpli-consent-label');
  if (consentIdLabel) consentIdLabel.textContent = t('consentId') + ': ';
  
  const loggingDesc = el.querySelector('.pmcpli-logging .pmcpli-description > span:last-child');
  if (loggingDesc) loggingDesc.innerHTML = t('loggingNotice');

  // Restaurer l'état des checkboxes
  Object.entries(checkboxStates).forEach(([id, checked]) => {
    const cb = el.querySelector(`#${id}`);
    if (cb) cb.checked = checked;
  });

  // Restaurer l'état des catégories
  Object.entries(categoryStates).forEach(([className, isExpanded]) => {
    const category = el.querySelector(`.${className}`);
    if (category) {
      const header = category.querySelector('.pmcpli-category-clickable');
      const description = category.querySelector('.pmcpli-description');
      const icon = header.querySelector('.pmcpli-icon svg');
      
      if (isExpanded) {
        description.style.display = 'block';
        header.setAttribute('aria-expanded', 'true');
        icon.style.transform = 'rotate(180deg)';
      } else {
        description.style.display = 'none';
        header.setAttribute('aria-expanded', 'false');
        icon.style.transform = 'rotate(0deg)';
      }
    }
  });
};

function attachHandlers() {
  const el = document.getElementById('politecookiebanner');
  if (!el) return;

  try {
    initGoogleConsentMode(CONFIG.google_consent_mode);
  } catch (error) {
    // console.error('[CookieConsent] Erreur initialisation Google Consent Mode:', error);
  }

  const stored = loadPrefs();
  if (stored) {
    el.querySelectorAll('input[name^="politecookie["]').forEach(cb => {
      const m = cb.name.match(/^politecookie\['(.+)'\]$/);
      if (m) cb.checked = !!stored[m[1]];
    });
    applyPreferences(stored);
  } else {
    el.style.display = 'block';
    el.querySelector('.pmcpli-categories').style.display = 'none';
  }

  scanAndFreezeThirdParty(stored);
  startObserver(stored);

  // ========== GESTIONNAIRE DE CHANGEMENT DE LANGUE ==========
  const langSelect = el.querySelector('#pmcpli-lang-select');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      const newLang = e.target.value;
      t.setLocale(newLang);
      refreshBannerContent();
    });
  }

  const save = async (action = 'customize', method = 'settings') => {
    const prefs = {};
    el.querySelectorAll('input[name^="politecookie["]').forEach(cb => {
      const m = cb.name.match(/^politecookie\['(.+)'\]$/);
      if (m) prefs[m[1]] = cb.checked;
    });
    await savePrefs(prefs, action, method);
    el.style.display = 'none';
    
    // Réafficher le bouton flottant quand le bandeau se ferme
    const floatingButton = document.querySelector('.synapx-cookie-launcher');
    if (floatingButton) {
      floatingButton.style.display = 'grid';
    }
  };

  const deletePrefs = async () => {
    localStorage.removeItem(STORAGE_KEY);

    if (CONFIG.logger.enabled) {
      await logConsentToServer(null, 'revoke', 'settings');
    }

    scanAndFreezeThirdParty(null);

    document.dispatchEvent(new CustomEvent('cookieConsentChanged', {
      detail: { preferences: null, action: 'revoke', logged: !!CONFIG.logger.enabled }
    }));

    el.querySelectorAll('input[name^="politecookie["]').forEach(cb => cb.checked = false);
    el.style.display = 'none';
    
    // Réafficher le bouton flottant quand le bandeau se ferme
    const floatingButton = document.querySelector('.synapx-cookie-launcher');
    if (floatingButton) {
      floatingButton.style.display = 'grid';
    }
  };

  const togglePreferencesView = () => {
    const cats = el.querySelector('.pmcpli-categories');
    const [saveBtn, delBtn, viewBtn] = ['.pmcpli-save-preferences', '.pmcpli-del-preferences', '.pmcpli-view-preferences']
      .map(sel => el.querySelector(sel));
    
    const isHidden = cats.style.display === 'none' || !cats.style.display;
    cats.style.display = isHidden ? 'block' : 'none';
    saveBtn.style.display = delBtn.style.display = isHidden ? 'inline-block' : 'none';
    viewBtn.style.display = isHidden ? 'none' : 'inline-block';
  };

  const toggleCategoryContent = (categoryHeader) => {
    const category = categoryHeader.closest('.pmcpli-category');
    const description = category.querySelector('.pmcpli-description');
    const icon = categoryHeader.querySelector('.pmcpli-icon svg');
    const isExpanded = categoryHeader.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      description.style.display = 'none';
      categoryHeader.setAttribute('aria-expanded', 'false');
      icon.style.transform = 'rotate(0deg)';
    } else {
      description.style.display = 'block';
      categoryHeader.setAttribute('aria-expanded', 'true');
      icon.style.transform = 'rotate(180deg)';
    }
  };

  const handlers = {
    '.pmcpli-accept': async () => {
      el.querySelectorAll('input[name^="politecookie["]').forEach(cb => cb.checked = true);
      await save('accept', 'banner');
    },
    '.pmcpli-deny': async () => {
      el.querySelectorAll('input[name^="politecookie["]').forEach(cb => cb.checked = false);
      await save('reject', 'banner');
    },
    '.pmcpli-view-preferences': togglePreferencesView,
    '.pmcpli-save-preferences': () => save('customize', 'settings'),
    '.pmcpli-del-preferences': deletePrefs
  };

  Object.entries(handlers).forEach(([selector, handler]) => {
    el.querySelector(selector)?.addEventListener('click', handler);
  });

  el.querySelectorAll('.pmcpli-category-clickable').forEach(header => {
    header.addEventListener('click', (e) => {
      if (e.target.closest('.checkbox-wrapper')) return;
      toggleCategoryContent(header);
    });
    
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCategoryContent(header);
      }
    });
  });

  el.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      el.style.display = 'none';
      
      // Réafficher le bouton flottant quand le bandeau se ferme
      const floatingButton = document.querySelector('.synapx-cookie-launcher');
      if (floatingButton) {
        floatingButton.style.display = 'grid';
      }
    }
  });

  document.addEventListener('click', e => {
    if (e.target.closest('#openpolitecookie, #openpolitecookie a')) {
      e.preventDefault();
      openBanner(true);
    }
  });
}

// ========== CRÉATION AUTOMATIQUE DU BOUTON FLOTTANT ==========
const createFloatingButton = () => {
  // Vérifier si un élément avec id ou classe openpolitecookie existe déjà
  if (document.getElementById('openpolitecookie') || document.querySelector('.openpolitecookie')) {
    return; // Un bouton existe déjà, ne rien faire
  }

  // Créer le bouton flottant
  const button = document.createElement('button');
  button.id = 'openpolitecookie';
  button.className = 'synapx-cookie-launcher';
  button.type = 'button';
  button.title = t('openCookieSettings') || 'Gérer les cookies';
  button.setAttribute('aria-label', t('openCookieSettings') || 'Gérer les cookies');
  button.setAttribute('aria-expanded', 'false');
  
  // Vérifier si le bandeau est déjà ouvert
  const banner = document.getElementById('politecookiebanner');
  const isBannerOpen = banner && banner.style.display !== 'none';
  
  // Styles inline pour le bouton
  button.style.cssText = `
    position: fixed;
    z-index: 99;
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 9px;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 6px 20px;
    background: var(--cc-bg);
    display: ${isBannerOpen ? 'none' : 'grid'};
    place-items: center;
    font: 600 12px / 1 system-ui, sans-serif;
    right: 18px;
    bottom: 18px;
    transition: transform 0.2s ease, box-shadow 0.3s ease;
  `;

  // Contenu du bouton
  button.innerHTML = `
    <span aria-hidden="true" style="font-size: 20px;">
<svg width="45" height="45" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cookie Consent">
  <title>${t('openCookieSettings') || 'Gérer les cookies'}</title>

  <defs>
    <!-- Chemin circulaire pour le texte -->
    <path id="circleTextPath" d="M128,128 m-100,0 a100,100 0 1,1 200,0 a100,100 0 1,1 -200,0" />
    <mask id="bite">
      <rect width="256" height="256" fill="#fff"/>
      <circle cx="184" cy="64" r="24" fill="#000"/>
      <circle cx="206" cy="90" r="18" fill="#000"/>
      <circle cx="164" cy="52" r="14" fill="#000"/>
    </mask>
  </defs>

  <!-- Texte autour -->
  <text font-size="33" font-family="sans-serif" fill="#5C3A21" letter-spacing="2">
    <textPath href="#circleTextPath" startOffset="50%" text-anchor="middle">
      ${t('title') || 'Gérer les cookies'}
    </textPath>
  </text>

  <!-- Cookie centré -->
  <g mask="url(#bite)" transform="translate(0,0)">
    <circle cx="128" cy="128" r="72" fill="#D2A679"/>
    <circle cx="128" cy="132" r="68" fill="#C29462"/>
    <g opacity="0.25" fill="#7A5837">
      <circle cx="98" cy="108" r="3"/>
      <circle cx="120" cy="86" r="3"/>
      <circle cx="154" cy="120" r="3"/>
      <circle cx="142" cy="156" r="3"/>
      <circle cx="108" cy="148" r="3"/>
    </g>
    <g fill="#5C3A21">
      <circle cx="112" cy="104" r="6"/>
      <circle cx="136" cy="100" r="5.5"/>
      <circle cx="148" cy="116" r="6.5"/>
      <circle cx="120" cy="132" r="6"/>
      <circle cx="140" cy="144" r="5.5"/>
      <circle cx="118" cy="156" r="5"/>
    </g>
    <ellipse cx="120" cy="104" rx="28" ry="14" fill="#fff" opacity="0.12"/>
  </g>
</svg>
  </span>
    <span class="visually-hidden" style="
      position: absolute;
      clip: rect(0 0 0 0);
      clip-path: inset(50%);
      width: 1px;
      height: 1px;
      overflow: hidden;
      white-space: nowrap;
    ">${t('openCookieSettings') || 'Gérer les cookies'}</span>
  `;

  // Effet hover
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.1)';
    button.style.boxShadow = 'rgba(0, 0, 0, 0.35) 0px 8px 25px';
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
    button.style.boxShadow = 'rgba(0, 0, 0, 0.25) 0px 6px 20px';
  });

  // Ajouter au body
  document.body.appendChild(button);
};

// ========== API GLOBALE ==========
window.CookieConsent = {
  open: openBanner,
  reset: () => { 
    localStorage.removeItem(STORAGE_KEY);
    openBanner(true); 
  },
  getPreferences: loadPrefs,
  hasConsent: category => {
    const prefs = loadPrefs();
    return !!(prefs?.[category]);
  },
  
  init: (options = {}) => {
    if (options.logger) {
      Object.assign(CONFIG.logger, {
        enabled: true,
        ...options.logger,
        headers: { ...CONFIG.logger.headers, ...(options.logger.headers || {}) }
      });
    }
    if (options.company) {
      if (options.company.name) CONFIG.company.name = options.company.name;
      else if (options.company.auto !== undefined) CONFIG.company.auto = options.company.auto;
      if (options.company.legalnotices) CONFIG.company.legalnotices = options.company.legalnotices;
      if (options.company.privacypolicy) CONFIG.company.privacypolicy = options.company.privacypolicy;
    }
    
    // ✅ Initialiser les variables de templating dès que company est configuré
    initTemplateVariables();

    if (options.endpoint || options.apiKey || options.anonymousId !== undefined || options.headers) {
      CONFIG.logger.enabled = true;
      if (options.endpoint) CONFIG.logger.endpoint = options.endpoint;
      if (options.apiKey) CONFIG.logger.apiKey = options.apiKey;
      if (options.anonymousId !== undefined) CONFIG.logger.anonymousId = options.anonymousId;
      if (options.headers) Object.assign(CONFIG.logger.headers, options.headers);
    }
    
    if (options.statistics) {
      if (options.statistics.google_analytics_key) {
        CONFIG.statistics.google_analytics_key = options.statistics.google_analytics_key;
      }
      if (options.statistics.google_tag_manager_key) {
        CONFIG.statistics.google_tag_manager_key = options.statistics.google_tag_manager_key;
      }
      if (options.statistics.matomo) {
        CONFIG.statistics.matomo = options.statistics.matomo;
      }
      if (options.statistics.mixpanel_token) {
        CONFIG.statistics.mixpanel_token = options.statistics.mixpanel_token;
      }
      if (options.statistics.amplitude_key) {
        CONFIG.statistics.amplitude_key = options.statistics.amplitude_key;
      }
      if (options.statistics.plausible) {
        CONFIG.statistics.plausible = options.statistics.plausible;
      }
      if (options.statistics.hotjar_site_id) {
        CONFIG.statistics.hotjar_site_id = options.statistics.hotjar_site_id;
      }
      if (options.statistics.clarity_project_id) {
        CONFIG.statistics.clarity_project_id = options.statistics.clarity_project_id;
      }
    }
    
    if (options.marketing) {
      if (options.marketing.google_adsense_key) {
        CONFIG.marketing.google_adsense_key = options.marketing.google_adsense_key;
      }
      if (options.marketing.facebook_pixel) {
        CONFIG.marketing.facebook_pixel = options.marketing.facebook_pixel;
      }
      if (options.marketing.tiktok_pixel_id) {
        CONFIG.marketing.tiktok_pixel_id = options.marketing.tiktok_pixel_id;
      }
      if (options.marketing.linkedin_partner_id) {
        CONFIG.marketing.linkedin_partner_id = options.marketing.linkedin_partner_id;
      }
    }
    
    if (options.cookies) {
      console.warn('[CookieConsent] ⚠️ "cookies" est déprécié, utilisez "functional" à la place');
      options.functional = options.cookies;
    }
    
    if (options.functional) {
      if (options.functional.intercom_app_id) {
        CONFIG.functional.intercom_app_id = options.functional.intercom_app_id;
      }
      if (options.functional.crisp_website_id) {
        CONFIG.functional.crisp_website_id = options.functional.crisp_website_id;
      }
      if (options.functional.hubspot_portal_id) {
        CONFIG.functional.hubspot_portal_id = options.functional.hubspot_portal_id;
      }
      if (options.functional.segment_write_key) {
        CONFIG.functional.segment_write_key = options.functional.segment_write_key;
      }
    }

    try {
      if (options.google_consent_mode !== undefined) {
        if (typeof options.google_consent_mode === 'boolean') {
          CONFIG.google_consent_mode.enabled = options.google_consent_mode;
        } else if (typeof options.google_consent_mode === 'object' && options.google_consent_mode !== null) {
          const validConfig = {};
          
          if (typeof options.google_consent_mode.enabled === 'boolean') {
            validConfig.enabled = options.google_consent_mode.enabled;
          }
          
          if (typeof options.google_consent_mode.wait_for_update === 'number' && 
              options.google_consent_mode.wait_for_update >= 0) {
            validConfig.wait_for_update = options.google_consent_mode.wait_for_update;
          }
          
          if (typeof options.google_consent_mode.ads_data_redaction === 'boolean') {
            validConfig.ads_data_redaction = options.google_consent_mode.ads_data_redaction;
          }
          
          if (typeof options.google_consent_mode.url_passthrough === 'boolean') {
            validConfig.url_passthrough = options.google_consent_mode.url_passthrough;
          }
          
          if (Array.isArray(options.google_consent_mode.region)) {
            validConfig.region = options.google_consent_mode.region.filter(r => typeof r === 'string');
          }
          
          Object.assign(CONFIG.google_consent_mode, validConfig);
        }
      }
  renderOnce();
  attachHandlers();
      // console.log(CONFIG)
    } catch (error) {
      // console.error('[CookieConsent] Erreur configuration Google Consent Mode:', error);
    }
    
    // console.log('[CookieConsent] Configuration appliquée:', {
    //   logger: CONFIG.logger.enabled,
    //   google_consent_mode: CONFIG.google_consent_mode?.enabled || false,
    //   statistics: Object.keys(CONFIG.statistics).filter(k => CONFIG.statistics[k]),
    //   marketing: Object.keys(CONFIG.marketing).filter(k => CONFIG.marketing[k]),
    //   functional: Object.keys(CONFIG.functional).filter(k => CONFIG.functional[k])
    // });
  },
  
  disableLogging: () => {
    CONFIG.logger.enabled = false;
  },
  
  getConfig: () => ({ ...CONFIG }),

  getGoogleConsent: () => {
    try {
      const prefs = loadPrefs();
      const state = getGoogleConsentState(prefs);
      
      if (!state) {
        // console.warn('[CookieConsent] Impossible de récupérer l\'état Google Consent');
        return null;
      }
      
      return state;
    } catch (error) {
      // console.error('[CookieConsent] Erreur getGoogleConsent:', error);
      return null;
    }
  },
  
  updateGoogleConsent: (customConsent) => {
    try {
      if (!customConsent || typeof customConsent !== 'object') {
        // console.warn('[CookieConsent] Consentement invalide');
        return false;
      }
      
      if (typeof window.gtag !== 'function') {
        // console.warn('[CookieConsent] gtag() non disponible');
        return false;
      }
      
      window.gtag('consent', 'update', customConsent);
      // console.log('[CookieConsent] Google Consent Mode mis à jour manuellement');
      return true;
    } catch (error) {
      // console.error('[CookieConsent] Erreur updateGoogleConsent:', error);
      return false;
    }
  }
};

window.CookieConsent = CookieConsent;
// Export par défaut pour imports ES6
export default CookieConsent;

document.addEventListener('DOMContentLoaded', () => {
  try {
    initGoogleConsentMode(CONFIG.google_consent_mode);
  } catch (error) {
    // console.error('[CookieConsent] Erreur initialisation Google Consent Mode au chargement:', error);
  }
  
  // Initialiser les variables de templating au chargement
  initTemplateVariables();
  
  // Créer automatiquement le bouton flottant si nécessaire
  createFloatingButton();
  
  const prefs = loadPrefs();
  scanAndFreezeThirdParty(prefs);
  startObserver(prefs);
});