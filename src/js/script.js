import '../scss/style.scss';
import './cookie';



// Fonction pour charger Google Analytics
function loadGoogleAnalytics() {
  console.log('🔍 Chargement Google Analytics...');
  
  const script = document.createElement('script');
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-VOTRE-ID';
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }

  gtag('js', new Date());
  gtag('config', 'G-VOTRE-ID', {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });

  console.log('Google Analytics chargé');
}



// Fonction pour charger les scripts marketing
function loadMarketingScripts() {
  console.log('Chargement scripts marketing...');
  
  // Facebook Pixel
  !function(f,b,e,v,n,t,s) {
    if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)
  }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  
  if (typeof window.fbq === 'function') {
    window.fbq('init', 'VOTRE-PIXEL-ID');
    window.fbq('track', 'PageView');
  }

  // Google Ads / AdSense
  const adsScript = document.createElement('script');
  adsScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
  adsScript.async = true;
  document.head.appendChild(adsScript);
  
  console.log('Scripts marketing chargés');
}

function enableFunctionalCookies() {
  console.log('Activation cookies fonctionnels...');
  
  console.log('Cookies fonctionnels activés');
}


/*********************************************************************************************************/



const js=()=>{
  const resetBtn = document.getElementById('btn-reset-consent');
  const openBtn  = document.getElementById('btn-open-consent');
  resetBtn?.addEventListener('click', () => {
    if (window.CookieConsent?.reset) {
      window.CookieConsent.reset(); // ouvre la bannière en mode préférences
    } else {
      try {
        localStorage.removeItem('politecookiebanner');
      } catch {
  // ignore error (par ex. quota plein ou accès interdit)
      }
      alert('Consentement effacé. Rechargez la page avec F5 pour voir la bannière.');
    }
  });

  openBtn?.addEventListener('click', () => {
    if (window.CookieConsent?.open) {
      window.CookieConsent.open(true); // ouvre directement avec préférences visibles
    } else {
      const link = document.querySelector('#openpolitecookie a');
      if (link) { link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); }
    }
  });
  const THEMES = ['default','brown','dark','blue'];
  const root = document.body; // applique la classe sur <body>
  function applyTheme(name) {
    THEMES.forEach(t => root.classList.remove('cookie-theme-' + t));
    root.classList.add('cookie-theme-' + name);
  }
  // Thème par défaut au chargement si aucune classe présente
  if (!THEMES.some(t => root.classList.contains('cookie-theme-' + t))) {
    root.classList.add('cookie-theme-default');
  }
  document.querySelector('.theme-switch')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-theme]');
    if (!btn) return;
    applyTheme(btn.dataset.theme);
  });
}

// API pour les développeurs - exemples d'usage
window.addEventListener('load', () => {
  console.log('🚀 API Cookie Consent disponible:');
  console.log('- window.CookieConsent.show()');
  console.log('- window.CookieConsent.hide()');
  console.log('- window.CookieConsent.getPreferences()');
  console.log('- window.CookieConsent.hasConsent("statistics")');
  console.log('- window.CookieConsent.reset()');
  console.log('- window.CookieConsent.on("change", callback)');
  
});


const startcall=(prefs)=>{
  console.log('Préférences reçues:', prefs);
  
  if (prefs?.statistics) {
    loadGoogleAnalytics();
  }
  
  if (prefs?.marketing) {
   loadMarketingScripts();
 }
 
 if (prefs?.cookies) {
  enableFunctionalCookies();
}
}

window.CookieConsent.enableLogging({
  // endpoint: '/api/consent/log',       // 📡 URL de ton endpoint Laravel (routes/api.php)
  // includeUserAgent: true,             // 🧭 Ajoute le User-Agent au log (utile comme preuve)
  anonymousId: true,                  // 🕵️ Génère un ID anonyme si l'utilisateur n'est pas connecté
  headers: {
    // 🛡️ CSRF : utile surtout si tu passes par une route "web".
    // Pour une route "api", ce header n'est pas requis 😉  'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || 'your-token'
    'X-CSRF-TOKEN': 'document.querySelector('meta[name="csrf-token"]')?.content || 'your-token''
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (window.CookieConsent) {
    const prefs = window.CookieConsent.getPreferences();
    if (prefs) startcall(prefs);
  }
  document.addEventListener('cookieConsentChanged', (event) => {
    startcall(event.detail.preferences);
  });
  js();
});

