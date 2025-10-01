/**
 * @synapxlab/cookie-consent
 * Bannière de consentement + Logger + Intégration services
 * 
 * @version 2.2.0
 * @author SynapxLab <contact@synapxlab.com>
 * @license MIT
 */

import '../scss/cookie.scss';
import t from './translat';

const STORAGE_KEY = 'politecookiebanner';

// Configuration centralisée
const CONFIG = {
  logger: {
    enabled: false,
    endpoint: '/api/consent/log',
    apiKey: null,
    retries: 3,
    timeout: 5000,
    includeUserAgent: true,
    anonymousId: true,
    headers: {}
  },
  statistics: {
    google_manager_key: null,
  },
  marketing: {
    google_AdSense_key: null,
    facebook: {
      track: null,
      key: null,
    }
  }  
};

// ========== UTILITAIRES ==========
const loadPrefs = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || ''); } catch { return null; }
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

const simpleHash = str => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
};

// ========== RÉCUPÉRATION DES SERVICES CONFIGURÉS ==========
const getConfiguredServices = () => {
  const services = {
    statistics: [],
    marketing: []
  };
  
  if (CONFIG.statistics.google_manager_key) {
    services.statistics.push('Google Analytics');
  }
  
  if (CONFIG.marketing.google_AdSense_key) {
    services.marketing.push('Google AdSense');
  }
  
  if (CONFIG.marketing.facebook.key) {
    services.marketing.push('Facebook Pixel');
  }
  
  return services;
};

// ========== LOGGING ==========
const logConsentToServer = async (preferences, action = 'updated') => {
  if (!CONFIG.logger.enabled) return;

  const payload = {
    consent_id: generateUUID(),
    timestamp: new Date().toISOString(),
    device_id: getDeviceId(),
    site_host: location.host,
    site_path: location.pathname,
    preferences,
    action,
    locale: navigator.language || 'fr-FR',
    referrer: document.referrer || null,
    banner_version: '2.2.0',
    policy_hash: simpleHash(location.host + '/cookies'),
    ...(CONFIG.logger.includeUserAgent && { user_agent: navigator.userAgent })
  };

  const headers = {
    'Content-Type': 'application/json',
    ...CONFIG.logger.headers,
    ...(CONFIG.logger.apiKey && { Authorization: `Bearer ${CONFIG.logger.apiKey}` })
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
      if (response.ok) return;
    } catch (error) {
      console.warn('[CookieConsent] Logging error:', error.message);
    }
    
    if (attempt < CONFIG.logger.retries - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
};

// ========== INTÉGRATION SERVICES ==========
const loadGoogleAnalytics = () => {
  if (!CONFIG.statistics.google_manager_key) {
    console.warn('[CookieConsent] Google Analytics key non configurée');
    return;
  }
  
  console.log('📊 Chargement Google Analytics...');
  
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.statistics.google_manager_key}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }

  gtag('js', new Date());
  gtag('config', CONFIG.statistics.google_manager_key, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });

  console.log('✅ Google Analytics chargé');
};

const loadMarketingScripts = () => {
  console.log('📢 Chargement scripts marketing...');
  
  // Facebook Pixel
  if (CONFIG.marketing.facebook.key) {
    !function(f,b,e,v,n,t,s) {
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)
    }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    
    if (typeof window.fbq === 'function') {
      window.fbq('init', CONFIG.marketing.facebook.key);
      if (CONFIG.marketing.facebook.track) {
        window.fbq('track', CONFIG.marketing.facebook.track);
      } else {
        window.fbq('track', 'PageView');
      }
    }
    console.log('✅ Facebook Pixel chargé');
  }

  // Google Ads / AdSense
  if (CONFIG.marketing.google_AdSense_key) {
    const adsScript = document.createElement('script');
    adsScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CONFIG.marketing.google_AdSense_key}`;
    adsScript.async = true;
    adsScript.crossOrigin = 'anonymous';
    document.head.appendChild(adsScript);
    console.log('✅ Google AdSense chargé');
  }
  
  if (!CONFIG.marketing.facebook.key && !CONFIG.marketing.google_AdSense_key) {
    console.warn('[CookieConsent] Aucune clé marketing configurée');
  }
};

const enableFunctionalCookies = () => {
  console.log('🔧 Activation cookies fonctionnels...');
  console.log('✅ Cookies fonctionnels activés');
};

// ========== GESTION DES PRÉFÉRENCES ==========
const applyPreferences = (prefs) => {
  if (!prefs) return;
  
  console.log('🎯 Application des préférences:', prefs);
  
  if (prefs.statistics && CONFIG.statistics.google_manager_key) {
    loadGoogleAnalytics();
  }
  
  if (prefs.marketing && (CONFIG.marketing.google_AdSense_key || CONFIG.marketing.facebook.key)) {
    loadMarketingScripts();
  }
  
  if (prefs.cookies) {
    enableFunctionalCookies();
  }
};

const savePrefs = obj => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj || {}));
  
  document.dispatchEvent(new CustomEvent('cookieConsentChanged', {
    detail: { preferences: obj }
  }));

  CONFIG.logger.enabled && logConsentToServer(obj, 'updated');
  
  applyPreferences(obj);
};

// ========== INTERFACE ==========
function renderOnce() {
  if (document.getElementById('politecookiebanner')) return;

  // Récupérer les services configurés
  const services = getConfiguredServices();
  
  // Créer les textes des services
  const statsServicesText = services.statistics.length > 0 
    ? `<div class="pmcpli-services">${t('statsServices', { services: services.statistics.join(', ') })}</div>`
    : '';
    
  const marketingServicesText = services.marketing.length > 0
    ? `<div class="pmcpli-services">${t('marketingServices', { services: services.marketing.join(', ') })}</div>`
    : '';

  const tpl = `<div id="politecookiebanner" class="pmcpli-cookiebanner pmcpli-show"
    aria-label="cookiebanner" title="cookiebanner" aria-modal="true" data-nosnippet="true"
    role="dialog" aria-live="polite" style="display:none;" lang="${t.getLocale()}">
  <div class="pmcpli-header">
    <div class="pmcpli-title">${t('title')}</div>
    <div class="pmcpli-close" tabindex="0" role="button" title="cookiebanner" aria-label="${t('closeAria')}" role-js="close">
      <svg aria-hidden="true" focusable="false" viewBox="0 0 352 512" class="pmcpli-close-icon"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg>
    </div>
  </div>
  <div class="pmcpli-divider pmcpli-divider-header"></div>
  <div class="pmcpli-body">
    <div class="pmcpli-message">${t('message')}</div>
    <div class="pmcpli-categories" style="display:none;">
      <div class="pmcpli-category pmcpli-functional">
        <div class="pmcpli-category-header pmcpli-category-clickable" tabindex="0" role="button" aria-expanded="false">
          <span class="pmcpli-category-title">${t('functionalTitle')}</span>
          <span class="pmcpli-category-status">${t('alwaysActive')}</span>
          <span class="pmcpli-icon pmcpli-open">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="18"><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/></svg>
          </span>
        </div>
        <div class="pmcpli-description" style="display:none;">
          <span class="pmcpli-description-functional">${t('functionalDesc')}</span>
        </div>
      </div>

      <div class="pmcpli-category pmcpli-statistics">
        <div class="pmcpli-category-header pmcpli-category-clickable" tabindex="0" role="button" aria-expanded="false">
          <span class="pmcpli-category-title">${t('cookiesTitle')}</span>
          <div class="checkbox-wrapper">
            <input type="checkbox" id="politecookiecheckboxcookies" name="politecookie['cookies']">
            <label for="politecookiecheckboxcookies"></label>
          </div>
          <span class="pmcpli-icon pmcpli-open">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="18"><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/></svg>
          </span>
        </div>
        <div class="pmcpli-description" style="display:none;">
          <span class="pmcpli-description-statistics-anonymous">${t('cookiesDesc')}</span>
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

function attachHandlers() {
  const el = document.getElementById('politecookiebanner');
  if (!el) return;

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

  const save = () => {
    const prefs = {};
    el.querySelectorAll('input[name^="politecookie["]').forEach(cb => {
      const m = cb.name.match(/^politecookie\['(.+)'\]$/);
      if (m) prefs[m[1]] = cb.checked;
    });
    savePrefs(prefs);
    el.style.display = 'none';
  };

  const deletePrefs = () => {
    localStorage.removeItem(STORAGE_KEY);
    
    document.dispatchEvent(new CustomEvent('cookieConsentChanged', {
      detail: { preferences: null, action: 'deleted' }
    }));
    
    CONFIG.logger.enabled && logConsentToServer(null, 'deleted');
    
    el.querySelectorAll('input[name^="politecookie["]').forEach(cb => cb.checked = false);
    el.style.display = 'none';
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
    '.pmcpli-close': () => el.style.display = 'none',
    '.pmcpli-accept': () => {
      el.querySelectorAll('input[name^="politecookie["]').forEach(cb => cb.checked = true);
      save();
    },
    '.pmcpli-deny': () => {
      el.querySelectorAll('input[name^="politecookie["]').forEach(cb => cb.checked = false);
      save();
    },
    '.pmcpli-view-preferences': togglePreferencesView,
    '.pmcpli-save-preferences': save,
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
    }
  });

  document.addEventListener('click', e => {
    if (e.target.closest('#openpolitecookie, #openpolitecookie a')) {
      e.preventDefault();
      openBanner(true);
    }
  });
}

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
    
    if (options.endpoint || options.apiKey || options.anonymousId !== undefined || options.headers) {
      CONFIG.logger.enabled = true;
      if (options.endpoint) CONFIG.logger.endpoint = options.endpoint;
      if (options.apiKey) CONFIG.logger.apiKey = options.apiKey;
      if (options.anonymousId !== undefined) CONFIG.logger.anonymousId = options.anonymousId;
      if (options.headers) Object.assign(CONFIG.logger.headers, options.headers);
    }
    
    if (options.statistics) {
      Object.assign(CONFIG.statistics, options.statistics);
    }
    
    if (options.marketing) {
      if (options.marketing.google_AdSense_key) {
        CONFIG.marketing.google_AdSense_key = options.marketing.google_AdSense_key;
      }
      if (options.marketing.facebook) {
        Object.assign(CONFIG.marketing.facebook, options.marketing.facebook);
      }
    }
    
    console.log('[CookieConsent] Configuration appliquée:', {
      logger: CONFIG.logger.enabled,
      hasGoogleAnalytics: !!CONFIG.statistics.google_manager_key,
      hasGoogleAds: !!CONFIG.marketing.google_AdSense_key,
      hasFacebook: !!CONFIG.marketing.facebook.key
    });
  },
  
  disableLogging: () => {
    CONFIG.logger.enabled = false;
  },
  
  getConfig: () => ({ ...CONFIG })
};

document.addEventListener('DOMContentLoaded', () => {
  renderOnce();
  attachHandlers();
});