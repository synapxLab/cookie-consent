import '../scss/style.scss';
import './cookie';

/*********************************************************************************************************/

const js = () => {
  const resetBtn = document.getElementById('btn-reset-consent');
  const openBtn = document.getElementById('btn-open-consent');
  
  resetBtn?.addEventListener('click', () => {
    if (window.CookieConsent?.reset) {
      window.CookieConsent.reset();
    } else {
      try {
        localStorage.removeItem('politecookiebanner');
      } catch {
        // ignore error
      }
      alert('Consentement effacé. Rechargez la page avec F5 pour voir la bannière.');
    }
  });

  openBtn?.addEventListener('click', () => {
    if (window.CookieConsent?.open) {
      window.CookieConsent.open(true);
    } else {
      const link = document.querySelector('#openpolitecookie a');
      if (link) { 
        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); 
      }
    }
  });
  
  // Gestion des thèmes
  const THEMES = ['default', 'brown', 'dark', 'blue'];
  const root = document.body;
  
  function applyTheme(name) {
    THEMES.forEach(t => root.classList.remove('cookie-theme-' + t));
    root.classList.add('cookie-theme-' + name);
  }
  
  if (!THEMES.some(t => root.classList.contains('cookie-theme-' + t))) {
    root.classList.add('cookie-theme-default');
  }
  
  document.querySelector('.theme-switch')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-theme]');
    if (!btn) return;
    applyTheme(btn.dataset.theme);
  });
};

// API pour les développeurs
window.addEventListener('load', () => {
  console.log('🚀 API Cookie Consent disponible:');
  console.log('- window.CookieConsent.init(options)');
  console.log('- window.CookieConsent.open()');
  console.log('- window.CookieConsent.reset()');
  console.log('- window.CookieConsent.getPreferences()');
  console.log('- window.CookieConsent.hasConsent("statistics")');
  console.log('- window.CookieConsent.getConfig()');
});



window.CookieConsent.init({
  logger: {
    enabled: true,
    apiKey: 'fd429de86f2e3cd71c4b18',
    anonymousId: true,
    includeUserAgent: true,
    headers: {
      'Authorization': 'Bearer apk_e62933f5cb8e1',
      // 'X-Request-Id': crypto.randomUUID()
    }
  },
  statistics: {
    google_analytics_key: 'G-ABC123XYZ',
    google_tag_manager_key: 'GTM-XXX',       // ✅
    matomo: { url: '...', siteId: 1 },       // ✅
    mixpanel_token: 'xxx',                   // ✅
    amplitude_key: 'xxx',                    // ✅
    plausible: { domain: 'example.com' },    // ✅
    hotjar_site_id: 123456,                  // ✅
    clarity_project_id: 'xxx'                // ✅    
  },
  marketing: {
    google_adsense_key: 'ca-pub-1234567890123456',
    facebook_pixel: {
      key: '123456789012345',
      track: 'PageView'
    },
    functional: {
      intercom_app_id: 'xxx',                  // ✅
      crisp_website_id: 'xxx',                 // ✅
      hubspot_portal_id: 'xxx',                // ✅
      segment_write_key: 'xxx'                 // ✅
    }    

}
});
document.addEventListener('DOMContentLoaded', () => {
  console.log(window.CookieConsent.getConfig());
  js();
});
