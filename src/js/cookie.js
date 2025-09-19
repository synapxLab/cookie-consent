/**
 * @synapxlab/cookie-consent
 * Bannière de consentement + Logger - Version corrigée pour accessibilité
 * 
 * @version 2.2.0
 * @author SynapxLab <contact@synapxlab.com>
 * @license MIT
 */

import '../scss/cookie.scss';

const STORAGE_KEY = 'politecookiebanner';

// Configuration du logging
const LOGGING_CONFIG = {
  enabled: false,
  endpoint: '/api/consent/log',
  apiKey: null,
  retries: 3,
  timeout: 5000,
  includeUserAgent: true,
  anonymousId: true,
  headers: {}
};

const loadPrefs = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || ''); } catch { return null; }
};

// Utilitaires pour le logging - UUID simple et efficace
const generateUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0;
  return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
});

const getDeviceId = () => {
  if (!LOGGING_CONFIG.anonymousId) return null;
  
  const KEY = 'cookie_consent_device_id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = 'cc_' + generateUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
};

// Hash simple pour policy fingerprint
const simpleHash = str => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
};

// Fonction de logging vers le serveur avec retry automatique
const logConsentToServer = async (preferences, action = 'updated') => {
  if (!LOGGING_CONFIG.enabled) return;

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
    ...(LOGGING_CONFIG.includeUserAgent && { user_agent: navigator.userAgent })
  };

  const headers = {
    'Content-Type': 'application/json',
    ...LOGGING_CONFIG.headers,
    ...(LOGGING_CONFIG.apiKey && { Authorization: `Bearer ${LOGGING_CONFIG.apiKey}` })
  };

  // Retry avec backoff exponentiel
  for (let attempt = 0; attempt < LOGGING_CONFIG.retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), LOGGING_CONFIG.timeout);
      
      const response = await fetch(LOGGING_CONFIG.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        // console.debug('[CookieConsent] Logging successful');
        return;
      }
      // console.warn('[CookieConsent] Logging failed:', response.status);
    } catch (error) {
      console.warn('[CookieConsent] Logging error:', error.message);
    }
    
    // Backoff exponentiel : 1s, 2s, 4s...
    if (attempt < LOGGING_CONFIG.retries - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
};

const savePrefs = obj => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj || {}));
  
  // Émettre l'événement personnalisé (ancien format pour compatibilité)
  document.dispatchEvent(new CustomEvent('cookieConsentChanged', {
    detail: { preferences: obj }
  }));

  // Logging automatique si activé
  LOGGING_CONFIG.enabled && logConsentToServer(obj, 'updated');
};

function renderOnce() {
  if (document.getElementById('politecookiebanner')) return;

  // Template HTML - Structure originale mais accessible (sans éléments interactifs dans summary)
  const tpl = `<div id="politecookiebanner" class="pmcpli-cookiebanner pmcpli-show" aria-label="cookiebanner" title="cookiebanner" aria-modal="true" data-nosnippet="true" role="dialog" aria-live="polite" style="display:none;">
  <div class="pmcpli-header">
    <div class="pmcpli-title">Gérer le consentement aux cookies</div>
    <div class="pmcpli-close" tabindex="0" role="button" title="cookiebanner" aria-label="close-cookiebanner" role-js="close">
      <svg aria-hidden="true" focusable="false" viewBox="0 0 352 512" class="pmcpli-close-icon"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg>
    </div>
  </div>
  <div class="pmcpli-divider pmcpli-divider-header"></div>
  <div class="pmcpli-body">
    <div class="pmcpli-message">Pour vous offrir la meilleure expérience possible, on utilise des cookies (pas les gourmands, hélas) pour garder quelques infos sur votre appareil. En acceptant, vous nous aidez à mieux comprendre comment vous naviguez ici. Si vous refusez, certaines fonctionnalités pourraient ne pas marcher aussi bien.</div>
    <div class="pmcpli-categories" style="display:none;">
      <div class="pmcpli-category pmcpli-functional">
        <div class="pmcpli-category-header pmcpli-category-clickable" tabindex="0" role="button" aria-expanded="false">
          <span class="pmcpli-category-title">Stockage strictement nécessaire</span> 
          <span class="pmcpli-category-status">Toujours actif</span>
          <span class="pmcpli-icon pmcpli-open">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="18">
              <path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/>
            </svg>
          </span>
        </div>
        <div class="pmcpli-description" style="display:none;">
          <span class="pmcpli-description-functional">Le stockage ou l'accès aux informations est uniquement utilisé pour des finalités techniques indispensables.</span>
        </div>
      </div>
      <div class="pmcpli-category pmcpli-statistics">
        <div class="pmcpli-category-header pmcpli-category-clickable" tabindex="0" role="button" aria-expanded="false">
          <span class="pmcpli-category-title">Cookies</span>
          <div class="checkbox-wrapper">
            <input type="checkbox" id="politecookiecheckboxcookies" name="politecookie['cookies']">
            <label for="politecookiecheckboxcookies"></label>
          </div>
          <span class="pmcpli-icon pmcpli-open">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="18">
              <path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/>
            </svg>
          </span>
        </div>
        <div class="pmcpli-description" style="display:none;">
          <span class="pmcpli-description-statistics-anonymous">Ces cookies ne sont pas utilisés à des fins publicitaires, mais ils jouent un rôle essentiel dans l'amélioration de votre expérience utilisateur.</span>
        </div>
      </div>
      <div class="pmcpli-category pmcpli-statistics">
        <div class="pmcpli-category-header pmcpli-category-clickable" tabindex="0" role="button" aria-expanded="false">
          <span class="pmcpli-category-title">Statistiques</span>
          <div class="checkbox-wrapper">
            <input type="checkbox" id="politecookiecheckboxstatistics" name="politecookie['statistics']">
            <label for="politecookiecheckboxstatistics"></label>
          </div>
          <span class="pmcpli-icon pmcpli-open">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="18">
              <path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/>
            </svg>
          </span>
        </div>
        <div class="pmcpli-description" style="display:none;">
          <span class="pmcpli-description-statistics-anonymous">Le stockage ou l'accès technique est utilisé exclusivement à des fins statistiques.</span>
        </div>
      </div>
      <div class="pmcpli-category pmcpli-marketing">
        <div class="pmcpli-category-header pmcpli-category-clickable" tabindex="0" role="button" aria-expanded="false">
          <span class="pmcpli-category-title">Marketing</span>
          <div class="checkbox-wrapper">
            <input type="checkbox" id="politecookiecheckboxmarketing" name="politecookie['marketing']">
            <label for="politecookiecheckboxmarketing"></label>
          </div>
          <span class="pmcpli-icon pmcpli-open">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="18">
              <path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/>
            </svg>
          </span>
        </div>
        <div class="pmcpli-description" style="display:none;">
          <span class="pmcpli-description-marketing">Le stockage ou l'accès technique est nécessaire pour créer des profils d'utilisateurs afin d'envoyer de la publicité.</span>
        </div>
      </div>
    </div>
  </div>
  <div class="pmcpli-links pmcpli-information p-2"></div>
  <div class="pmcpli-divider pmcpli-footer"></div>
  <div class="pmcpli-buttons">
    <button class="pmcpli-btn pmcpli-accept">Tout Accepter</button>
    <button class="pmcpli-btn pmcpli-deny">Refuser</button>
    <button class="pmcpli-btn pmcpli-view-preferences">Les préférences</button>
    <button class="pmcpli-btn pmcpli-save-preferences" style="display:none;">Enregistrer</button>
    <button class="pmcpli-btn pmcpli-del-preferences" style="display:none;">Supprimer</button>
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
  
  // Focus management pour accessibilité
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
    // Restaurer les préférences existantes
    el.querySelectorAll('input[name^="politecookie["]').forEach(cb => {
      const m = cb.name.match(/^politecookie\['(.+)'\]$/);
      if (m) cb.checked = !!stored[m[1]];
    });
  } else {
    // Première visite - afficher la bannière
    el.style.display = 'block';
    el.querySelector('.pmcpli-categories').style.display = 'none';
  }

  // Fonctions utilitaires
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
    
    LOGGING_CONFIG.enabled && logConsentToServer(null, 'deleted');
    
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

  // Gestionnaire pour les catégories extensibles - Style original mais accessible
  const toggleCategoryContent = (categoryHeader) => {
    const category = categoryHeader.closest('.pmcpli-category');
    const description = category.querySelector('.pmcpli-description');
    const icon = categoryHeader.querySelector('.pmcpli-icon svg');
    
    const isExpanded = categoryHeader.getAttribute('aria-expanded') === 'true';
    
    // Toggle affichage
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

  // Event listeners optimisés
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

  // Gestion des toggles de catégories avec style original
  el.querySelectorAll('.pmcpli-category-clickable').forEach(header => {
    header.addEventListener('click', (e) => {
      // Empêcher le clic sur la checkbox de déclencher le toggle
      if (e.target.closest('.checkbox-wrapper')) return;
      toggleCategoryContent(header);
    });
    
    // Support du clavier
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCategoryContent(header);
      }
    });
  });

  // Support du clavier pour l'accessibilité
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      el.style.display = 'none';
    }
  });

  // Gestionnaire global pour le lien de gestion des cookies (compatibilité)
  document.addEventListener('click', e => {
    if (e.target.closest('#openpolitecookie, #openpolitecookie a')) {
      e.preventDefault();
      openBanner(true);
    }
  });
}

// API globale optimisée - MAINTIEN DE LA COMPATIBILITÉ TOTALE
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
  
  // Configuration du logging avec fusion d'options optimisée
  enableLogging: (options = {}) => {
    Object.assign(LOGGING_CONFIG, {
      enabled: true,
      ...options,
      headers: { ...LOGGING_CONFIG.headers, ...options.headers }
    });

    // console.log('[CookieConsent] Logging enabled:', {
    //   endpoint: LOGGING_CONFIG.endpoint,
    //   hasApiKey: !!LOGGING_CONFIG.apiKey
    // });
  },
  
  disableLogging: () => {
    LOGGING_CONFIG.enabled = false;
    // console.log('[CookieConsent] Logging disabled');
  },
  
  getLoggingConfig: () => ({ ...LOGGING_CONFIG })
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  renderOnce();
  attachHandlers();
});
