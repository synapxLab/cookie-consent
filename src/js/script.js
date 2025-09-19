import '../scss/style.scss';
import './cookie';

const js=()=>{
  const resetBtn = document.getElementById('btn-reset-consent');
  const openBtn  = document.getElementById('btn-open-consent');
  resetBtn?.addEventListener('click', () => {
    if (window.CookieConsent?.reset) {
      window.CookieConsent.reset(); // ouvre la bannière en mode préférences
    } else {
      try { localStorage.removeItem('politecookiebanner'); } catch {}
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

const startcall=(prefs)=>{
  console.log('Préférences reçues:', prefs);
    if (prefs?.statistics) {
    // Charger Google Analytics
    // loadGoogleAnalytics();
  }
  
  if (prefs?.marketing) {
    // Charger pixels marketing
    // loadMarketingScripts();
  }
  
  if (prefs?.cookies) {
    // Activer cookies fonctionnels
    // enableFunctionalCookies();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.CookieConsent) {
    // ACTIVEZ LE LOGGING ICI si nécessaire
    window.CookieConsent.enableLogging({
      endpoint: '/api/consent/log',
      includeUserAgent: true,
      anonymousId: true,
      headers: {
          "X-CSRF-TOKEN":"AiLCJ2ZXIiOjEsImFsZyI6IkFFUy0yNTYtR0NNIiwia2lkIjoiSzIwMjVfMDkifQ.t3Jm86jRQxuuR5jbDLEzG8QJDQmwOKjqv5bp4-KdjCd"
        }
    });

    const prefs = window.CookieConsent.getPreferences();
    if (prefs) startcall(prefs);
  }
  
      document.addEventListener('cookieConsentChanged', (event) => {
        startcall(event.detail.preferences);
      });
  
  js();
});








	
//   const links = [...document.querySelectorAll('#sommaire a')];
//   const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));

//   const io = new IntersectionObserver((entries) => {
//     entries.forEach(e => {
//       const id = e.target.id;
//       const link = map.get(id);
//       if (!link) return;
//       if (e.isIntersecting) {
//         links.forEach(l => l.classList.remove('active'));
//         link.classList.add('active');
//       }
//     });
//   }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

//   document.querySelectorAll('main section[id]').forEach(sec => io.observe(sec));





// // Vérification au chargement
// document.addEventListener('DOMContentLoaded', () => {
//   console.log('CookieConsent disponible ?', !!window.CookieConsent);
  
//   if (window.CookieConsent) {
//     const prefs = window.CookieConsent.getPreferences();
//     console.log("Préférences chargées:", prefs);
//   } else {
//     console.error('CookieConsent non chargé !');
//   }
// });

// // Réaction aux changements
// document.addEventListener('cookieConsentChanged', (event) => {
//   const { preferences } = event.detail;
//     console.log("Event dans le  ",preferences)
// });

// console.log('Site JS prêt ✅');