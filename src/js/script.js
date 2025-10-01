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
  statistics: {
    google_manager_key: 'G-ABC123XYZ'  // ✅ Affichera "Google Analytics"
  },
  marketing: {
    google_AdSense_key: 'ca-pub-1234567890123456',  // ✅ Affichera "Google AdSense"
    facebook: {
      key: '123456789012345',  // ✅ Affichera "Facebook Pixel"
      track: 'PageView'
    }
  }
});

// CONFIGURATION - À adapter selon vos besoins
// window.CookieConsent.init({
//   // ========== LOGGER ==========
//   logger: {
//     enabled: false,                     // Activer le logging serveur
//     endpoint: '/api/consent/log',       // URL de l'endpoint
//     apiKey: null,                       // Clé API (optionnel)
//     anonymousId: true,                  // Génère un ID anonyme
//     includeUserAgent: true,             // Inclure le User-Agent
//     headers: {
//       // 'X-CSRF-TOKEN': 'votre-token'  // Headers personnalisés
//     }
//   },
  
//   // ========== STATISTICS ==========
//   statistics: {
//     google_manager_key: null            // 'G-XXXXXXXXXX' pour activer Google Analytics
//   },
  
//   // ========== MARKETING ==========
//   marketing: {
//     google_AdSense_key: null,           // 'ca-pub-XXXXXXXXXXXXXXXX' pour Google Ads
//     facebook: {
//       key: null,                        // 'VOTRE-PIXEL-ID' pour Facebook Pixel
//       track: 'PageView'                 // Événement à tracker (PageView par défaut)
//     }
//   }
// });

document.addEventListener('DOMContentLoaded', () => {
  js();
});

// ========== EXEMPLES D'UTILISATION ==========

// Exemple 1 : Configuration complète
/*
window.CookieConsent.init({
  logger: {
    enabled: true,
    endpoint: '/api/consent/log',
    apiKey: 'votre-api-key',
    anonymousId: true,
    headers: {
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
    }
  },
  statistics: {
    google_manager_key: 'G-XXXXXXXXXX'
  },
  marketing: {
    google_AdSense_key: 'ca-pub-XXXXXXXXXXXXXXXX',
    facebook: {
      key: 'VOTRE-PIXEL-ID',
      track: 'PageView'
    }
  }
});
*/

// Exemple 2 : Ancienne syntaxe (rétrocompatibilité)
/*
window.CookieConsent.init({
  endpoint: '/api/consent/log',
  anonymousId: true,
  headers: {
    'X-CSRF-TOKEN': 'votre-token'
  },
  statistics: {
    google_manager_key: 'G-XXXXXXXXXX'
  },
  marketing: {
    google_AdSense_key: 'ca-pub-XXXXXXXXXXXXXXXX',
    facebook: {
      key: 'VOTRE-PIXEL-ID',
      track: 'PageView'
    }
  }
});
*/