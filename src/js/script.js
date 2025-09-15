import '../scss/style.scss';
if (window.CookieConsent) {
  window.CookieConsent.init({
    message: "On respecte votre vie privée (promis).",
    policyUrl: "/politique-confidentialite"
  });
}
document.addEventListener('DOMContentLoaded', () => {



  const resetBtn = document.getElementById('btn-reset-consent');
  const openBtn  = document.getElementById('btn-open-consent');

  resetBtn?.addEventListener('click', () => {
    if (window.CookieConsent?.reset) {
      window.CookieConsent.reset(); // ouvre la bannière en mode préférences
    } else {
      // fallback si l'API globale n'est pas dispo
      try { localStorage.removeItem('politecookiebanner'); } catch {}
      alert('Consentement effacé. Rechargez la page avec F5 pour voir la bannière.');
    }
  });

  openBtn?.addEventListener('click', () => {
    if (window.CookieConsent?.open) {
      window.CookieConsent.open(true); // ouvre directement avec préférences visibles
    } else {
      // fallback minimal : déclenche le lien de footer si présent
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

	
  const links = [...document.querySelectorAll('#sommaire a')];
  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const id = e.target.id;
      const link = map.get(id);
      if (!link) return;
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  document.querySelectorAll('main section[id]').forEach(sec => io.observe(sec));
});
// console.log('Site JS prêt ✅');