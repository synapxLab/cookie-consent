
# 🍪 Cookie Consent RGPD

Bannière de consentement cookies **100% conforme RGPD/CNIL avec Logger** en JavaScript pur, sans aucune dépendance.

[![npm version](https://badge.fury.io/js/%40synapxlab%2Fcookie-consent.svg)](https://www.npmjs.com/package/@synapxlab/cookie-consent)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/@synapxlab/cookie-consent.svg)](https://www.npmjs.com/package/@synapxlab/cookie-consent)

## 🚀 Démo en direct

**Voir la démo → https://cookie.synapx.fr/**

## ⚡ Installation rapide

```bash
npm install @synapxlab/cookie-consent
```

### Via CDN

```html
<script src="https://unpkg.com/@synapxlab/cookie-consent@latest/dist/cookie.js"></script>
```

### Via ES Modules

```js
import '@synapxlab/cookie-consent';
// API globale disponible via window.CookieConsent
```

## 🎯 Pourquoi ce projet ?

- ✅ 100% gratuit et open-source
- ✅ Conformité RGPD/CNIL
- ✅ Zéro dépendance (~15kb minifié)
- ✅ Compatible tous frameworks (React, Vue, Angular, Vanilla)
- ✅ Documentation française 🇫🇷

## 📖 Utilisation

### API rapide

```js
// Ouvrir la bannière (mode préférences)
window.CookieConsent.open(true);

// Réinitialiser (supprime et rouvre en préférences)
window.CookieConsent.reset();

// Préférences actuelles
const prefs = window.CookieConsent.getPreferences();
// -> { cookies, statistics, marketing } | null

// Vérifier une catégorie
if (window.CookieConsent.hasConsent('statistics')) { /* Charger GA */ }
```

### Écouter les changements

```js
document.addEventListener('cookieConsentChanged', (event) => {
  const { preferences, action } = event.detail; // 'deleted' possible
  if (preferences?.statistics) { /* GA */ }
  if (preferences?.marketing)  { /* Pixels */ }
});
```

## 🧾 Journalisation (facultatif)

```js
window.CookieConsent.enableLogging({
  endpoint: '/api/consent/log',
  apiKey: null,
  retries: 3,
  timeout: 5000,
  includeUserAgent: true,
  anonymousId: true,
  headers: { 'X-CSRF-TOKEN': 'votre-token' }
});

// Désactiver
window.CookieConsent.disableLogging();

// Lire la config effective
const cfg = window.CookieConsent.getLoggingConfig();
```

## 🎨 Thèmes

Ajoutez une classe au `<body>` :
```js
document.body.classList.add('cookie-theme-default'); // dark / blue / brown
```

## 🔧 Développement

```bash
git clone https://github.com/synapxLab/cookie-consent.git
cd cookie-consent
npm install
npm run dev
npm run build
```

## 📄 Licence

MIT © synapxLab
