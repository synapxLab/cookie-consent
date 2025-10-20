/**
 * Vérifie la version du SDK SynapxLab Cookie Consent.
 * - Attend 10s
 * - Exécute à l'idle (ou après 100ms) 
 * - 10% de chances d'exécution
 * - Annule si la page se ferme (et si l’onglet passe hidden)
 */
(function () {
  const V = '2.4.0';
  const VERSION_URL = 'https://version.synapx.fr/cookie.json';
  const DELAY_MS = 10_000;
  const CHANCE = 0.10; // 1=toujours, 0=jamais, 0.5≈1/2

  const ctrl = new AbortController();
  const signal = ctrl.signal;

  // Annuler si la page se ferme
  addEventListener('beforeunload', () => ctrl.abort(), { once: true });

  // Optionnel : annuler si l’onglet devient inactif
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') ctrl.abort();
  });

  // Comparateur semver x.y.z (tolérant)
  const cmp = (v1, v2) => {
    const toNum = (s) => {
      const m = String(s || '').match(/^\d+/);
      return m ? parseInt(m[0], 10) : 0;
    };
    const [a = 0, b = 0, c = 0] = String(v1).split('.').map(toNum);
    const [x = 0, y = 0, z = 0] = String(v2).split('.').map(toNum);
    return (a - x) || (b - y) || (c - z);
  };

  setTimeout(() => {
    (window.requestIdleCallback || function (cb) { setTimeout(cb, 100); })(() => {
      if (signal.aborted) return;
      if (Math.random() > CHANCE) return;

      fetch(VERSION_URL, {
        method: 'GET',
        cache: 'no-store',
        // mode: 'cors',          // inutile si même politique/serveur déjà OK
        // keepalive: false,      // par défaut false ; on préfère l’annulation explicite
        signal
      })
        .then(r => r.ok ? r.json() : Promise.reject(new Error('HTTP ' + r.status)))
        .then(d => {
          const l = d && d.latest;
          const m = d && d.min_supported;
          if (!l) return;

          const diff = cmp(V, l);     // <0 si V < l
          const ok = m ? (cmp(V, m) >= 0) : true;

          if (!ok) {
            console.warn(`⚠️ Synapx Cookie: v${V} non supportée → ${l}`);
          } else if (diff < 0) {
            console.info(`ℹ️ Synapx Cookie: v${V} → ${l} disponible`);
          }
        })
        .catch(() => { /* silencieux */ });
    });
  }, DELAY_MS);
})();
