# 🍪 Cookie Consent

[![npm version](https://img.shields.io/npm/v/@synapxlab/cookie-consent.svg)](https://npmjs.com/package/@synapxlab/cookie-consent)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/@synapxlab/cookie-consent.svg)](https://npmjs.com/package/@synapxlab/cookie-consent)

Bannière de consentement aux cookies **conforme RGPD/CNIL**, open source et gratuite.

Alternative européenne à Cookiebot, Axeptio et autres solutions payantes.

**🎮 [Voir la démo en direct](https://synapx.fr/sdk/cookie_consent/)**


## ✨ Fonctionnalités

- ✅ **Conformité RGPD native** - Articles 6, 7, 13 respectés
- ✅ **Blocage automatique** - Détecte et bloque les scripts tiers
- ✅ **16 services pré-configurés** - GA, Facebook Pixel, Hotjar...
- ✅ **Logging des consentements** - Preuve juridique (Art. 7.1)
- ✅ **7 langues** - FR, EN, ES, DE, IT, NL, PT
- ✅ **0 dépendance** - Vanilla JS (~25KB gzippé)
- ✅ **Thèmes personnalisables** - CSS variables
- ✅ **Made in France** 🇫🇷

## 🚀 Installation rapide

### Via npm
```bash
npm install @synapxlab/cookie-consent
```
```javascript
import '@synapxlab/cookie-consent';

window.CookieConsent.init({
  statistics: {
    google_analytics_key: 'G-XXXXXXXXX'
  }
});
```

### Via CDN
```html
<script src="https://unpkg.com/@synapxlab/cookie-consent/dist/cookie.js"></script>
```

## 📖 Documentation

📚 **[Documentation complète](./docs/)**

**Guides rapides :**
- [🚀 Démarrage](./docs/getting-started.md)
- [⚙️ Configuration](./docs/configuration.md)
- [⚖️ Conformité RGPD](./docs/compliance-cnil.md)
- [❓ FAQ](./docs/faq.md)

**Intégrations :**
- [Vanilla JS](./docs/integrations/vanilla.md)
- [WordPress](./docs/integrations/wordpress.md)
- [PrestaShop](./docs/integrations/prestashop.md)
- [Google Tag Manager](./docs/integrations/tag-manager.md)

## 🎯 Exemple complet
```javascript
window.CookieConsent.init({
  logger: {
    enabled: true,
    apiKey: 'sk-live-xxxxx'
  },
  statistics: {
    google_analytics_key: 'G-XXXXXXXXX'
  },
  marketing: {
    facebook_pixel: {
      key: 'YOUR-PIXEL-ID',
      track: 'PageView'
    }
  }
});
```

## 🛡️ Conformité RGPD/CNIL

✅ Consentement préalable  
✅ Refus aussi simple que l'acceptation  
✅ Information claire par finalité  
✅ Preuve horodatée (logging)  
✅ Révocable à tout moment  
✅ Expiration 6 mois (recommandation CNIL)

[📋 Documentation conformité complète](./docs/compliance-cnil.md)

### 🔑 Espace membre & Multi-sites

**💼 Solution multi-clients** : Idéale pour les agences web et développeurs freelances.

Connectez-vous sur [https://synapx.fr/sdk/cookie_consent/](https://synapx.fr/sdk/cookie_consent/) pour :

- **Gérer plusieurs sites** depuis un seul compte
- **Générer des clés API** dédiées par client/domaine
- **Auto-configurer le code JavaScript** pour chaque projet
  - Services pré-configurés (Analytics, Pixels, Chat...)
  - Configuration complète exportable
  - Gestion centralisée des logs de consentement

Chaque site client dispose de sa propre configuration isolée et sécurisée.

## 💰 Tarification

| Volume/mois | 0 - 300        |  301 - 10K  |  10K - 100K  |  100K - 500K |  500K - 1.5M |     1.5M+        |
|-------------|----------------|-------------|--------------|--------------|--------------|------------------|
| Prix        | **GRATUIT** 🎁 |    10€      |      25€     |      54€     |     99€      | [Nous contacter](mailto:contact@synapx.fr) |





**La bannière est gratuite. Seul le logging est payant au-delà de 300/mois.**

## 🌍 Langues supportées

| Langue | Code | Statut |
|--------|------|--------|
| 🇫🇷 Français | `fr` | ✅ |
| 🇬🇧 English | `en` | ✅ |
| 🇪🇸 Español | `es` | ✅ |
| 🇩🇪 Deutsch | `de` | ✅ |
| 🇮🇹 Italiano | `it` | ✅ |
| 🇳🇱 Nederlands | `nl` | ✅ |
| 🇵🇹 Português | `pt` | ✅ |

[📖 Guide i18n](./docs/integrations/i18n.md)

## 🔧 API JavaScript
```javascript
// Ouvrir la bannière
window.CookieConsent.open();

// Réinitialiser
window.CookieConsent.reset();

// Récupérer les préférences
const prefs = window.CookieConsent.getPreferences();

// Vérifier un consentement
const hasStats = window.CookieConsent.hasConsent('statistics');

// Écouter les changements
document.addEventListener('cookieConsentChanged', (event) => {
  console.log(event.detail.preferences);
});
```

## 🤝 Contribuer

Les contributions sont les bienvenues !

- 🐛 [Signaler un bug](https://github.com/synapxLab/cookie-consent/issues)
- 💡 [Proposer une fonctionnalité](https://github.com/synapxLab/cookie-consent/issues)
- 🌍 [Ajouter une traduction](./docs/integrations/i18n.md)

## 📝 Licence

MIT © [SynapxLab](https://synapx.fr)

## 🔗 Liens

- 🌐 [Site officiel](https://synapx.fr/sdk/cookie_consent/)
- 📚 [Documentation](./docs/)
- 💻 [GitHub](https://github.com/synapxLab/cookie-consent)
- 📦 [npm](https://www.npmjs.com/package/@synapxlab/cookie-consent)
<!-- - 💬 [Discord](https://discord.gg/synapxlab) -->

## 📧 Support

- Email: contact@synapx.fr
<!-- - Discord: [Rejoindre la communauté](https://discord.gg/synapxlab) -->
<!-- - Issues: [GitHub Issues](https://github.com/synapxLab/cookie-consent/issues) -->

---

**🇪🇺 Solution européenne open source** | **🇫🇷 Développé en France**