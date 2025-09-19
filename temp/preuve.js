<script>
/**
 * Génère un UUID v4 (assez bien pour tracer un consentement sans PII)
 */
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11)
    .replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
}

/**
 * ID anonyme persistant côté client (pas d'email/IP, juste un identifiant technique)
 */
function getOrCreateDeviceId() {
  const KEY = 'cookieconsent_device_id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = 'cc_' + uuidv4();
    localStorage.setItem(KEY, id);
  }
  return id;
}

/**
 * Utilitaire : calcule un hash de la politique (facultatif mais propre)
 * Tu peux passer la chaîne de la politique ou son URL canonique.
 */
async function sha256Hex(str) {
  const buf = new TextEncoder().encode(str);
  const digest = await crypto.subtle.digest('SHA-256', buf);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Envoi la preuve au serveur
 * @param {Object} consent - ex: { cookies:true, statistics:true, marketing:false }
 * @param {Object} meta    - ex: { policyVersion:'1.0.3', policyUrl:'/legal/cookies' }
 */
async function sendConsentProof(consent, meta = {}) {
  const nowIso = new Date().toISOString();
  const deviceId = getOrCreateDeviceId();
  const policyHash = meta.policyText
    ? await sha256Hex(meta.policyText)
    : (meta.policyUrl ? await sha256Hex(String(meta.policyUrl)) : null);

  const payload = {
    consent_id: uuidv4(),                 // ID unique de l’événement de consentement
    ts: nowIso,                           // horodatage ISO
    site_host: location.host,
    locale: navigator.language || 'fr-FR',
    banner_version: meta.bannerVersion || '1.0.0',
    policy_version: meta.policyVersion || '1.0.0',
    policy_url: meta.policyUrl || null,
    policy_hash: policyHash,              // pour prouver sur QUELLE version l’utilisateur a consenti
    device_id: deviceId,                  // identifiant anonyme (localStorage)
    categories: consent,                  // l’état des catégories
    user_agent: navigator.userAgent,      // le serveur peut aussi le capter, c’est redondant mais pratique
    referrer: document.referrer || null
  };

  // NB: pas d’IP ici — elle est côté serveur, inutile de l’envoyer depuis le client.
  const res = await fetch('/api/consent/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' /*, 'X-CSRF-Token': '... si besoin ...' */ },
    body: JSON.stringify(payload),
    keepalive: true // utile si l’utilisateur part juste après avoir cliqué
  });

  if (!res.ok) {
    console.warn('[Consent] Échec log serveur', res.status);
  } else {
    console.debug('[Consent] Preuve loggée ✅');
  }
}

/**
 * Exemple d’intégration avec ta bannière :
 * - ici on écoute un event "consent-given" (à adapter à ton API réelle)
 * - sinon, appelle sendConsentProof() juste après le clic "Tout accepter" / "Tout refuser"
 */
(function bindConsentEvent() {
  if (window.CookieConsent && typeof window.CookieConsent.on === 'function') {
    window.CookieConsent.on('consent-given', async (consent) => {
      await sendConsentProof(consent, {
        policyVersion: '1.2.0',
        policyUrl: '/politique-cookies', // URL publique de ta politique cookies
        bannerVersion: '2.0.1'
      });
    });
  }
})();
</script>
