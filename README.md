
# 🍪 Cookie Consent

[![npm version](https://img.shields.io/npm/v/@synapxlab/cookie-consent.svg)](https://npmjs.com/package/@synapxlab/cookie-consent)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/@synapxlab/cookie-consent.svg)](https://npmjs.com/package/@synapxlab/cookie-consent)


**GDPR/CNIL compliant** cookie consent banner, open source and free.

European open-source alternative, with no dependency on Big Tech.

**🎮 [View Live Demo](https://synapx.fr/sdk/cookie_consent/)** **📚 [Complete French Documentation](./docs/)** **💼 Multi-client Solution**: Ideal for web agencies and freelance developers.

## ✨ Features

-   ✅ **Native GDPR Compliance** - Articles 6, 7, 13 respected
-   ✅ **Automatic Blocking** - Detects and blocks third-party scripts
-   ✅ **16 Pre-configured Services** - GA, Facebook Pixel, Hotjar...
-   ✅ **Consent Logging** - Legal proof (Art. 7.1)
-   ✅ **7 Languages** - FR, EN, ES, DE, IT, NL, PT
-   ✅ **Zero Dependencies** - Vanilla JS ≈ 66 KB minified (~21 KB gzipped)
-   ✅ **Customizable Themes** - CSS variables
-   ✅ **Made in France** 🇫🇷

## 🚀 Quick Installation Without Logger

### Via npm

bash

```bash
npm install @synapxlab/cookie-consent
```

javascript

```javascript
import '@synapxlab/cookie-consent';

window.CookieConsent.init({
  statistics: {
    google_analytics_key: 'G-XXXXXXXXX'
  }
});
```

## 🚀 Quick Installation With Logger

### Via npm

bash

```bash
npm install @synapxlab/cookie-consent
```

**With Self-hosted Logger - You Manage Your Logs**

javascript

```javascript
import '@synapxlab/cookie-consent';

window.CookieConsent.init({
  logger: {
    enabled: true,
    endpoint: '/api/logger.php',
    anonymousId: true,
    headers: {
      'Authorization': 'csrf-token' // optional
    }
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

**With Automatic Consent Logging 🔑 Member Area & Multi-site**

> The code is automatically generated for each registered domain.

javascript

```javascript
// Code generated automatically in your member area
```

### Block Third-party Scripts Directly in HTML

If you prefer to include your analytics/marketing scripts directly in your HTML rather than via the JavaScript API, you can automatically block them using the `type="text/plain"` and `data-cookie-category` attributes. Scripts are **truly blocked** until user consent (GDPR compliant).

html

```html
<script type="text/plain" data-cookie-category="CATEGORY" src="SCRIPT_URL"></script>
```

## 🛡️ GDPR/CNIL Compliance

✅ Prior consent  
✅ Rejection as easy as acceptance  
✅ Clear information by purpose  
✅ Timestamped proof (logging)  
✅ Revocable at any time  
✅ 6-month expiration (CNIL recommendation)

[📋 Complete Compliance Documentation](https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience)

## 🛡️ Via Member Area

Log in to [https://synapx.fr/sdk/cookie_consent/](https://synapx.fr/sdk/cookie_consent/) to:

-   **Manage multiple sites** from a single account
-   **Generate dedicated API keys** per client/domain
-   **Auto-configure JavaScript code** for each project
    -   Pre-configured services (Analytics, Pixels, Chat...)
    -   Exportable complete configuration
    -   Centralized consent log management

## 📖 Documentation

**Quick Guides:**

-   [🚀 Getting Started](./docs/getting-started.md)
-   [⚙️ Configuration](./docs/configuration.md)
-   [⚖️ GDPR Compliance](./docs/compliance-cnil.md)
-   [❓ FAQ](./docs/faq.md)

**Integrations:**

-   [Vanilla JS](./docs/integrations/vanilla.md)
-   [Google Tag Manager](./docs/integrations/tag-manager.md)

Each client site has its own isolated and secure configuration.

## 💰 Pricing: The Banner is Free - Only Logging is Paid

Pricing automatically adjusts based on your monthly volume.  
Each consent corresponds to a recorded action (acceptance, rejection, or modification).

🎁 **€50 offered** upon registration + **€50 for each successful referral.**  
📄 Invoice via ERP/CRM [Administralis](https://administralis.fr/)
| Volume/month        |  0 - 20K  |  2K - 20K  |   20K - 200K |  +200K       
|-------------------  |-----------|------------|--------------|--------------
| Price (excl. tax)   |   15€     |    35€     |      75€     | [Nous contacter] 

🎯 **Result:** Even with constant traffic of 3,000 unique visitors,  
_Most of your returning visitors have already made their choice and it remains valid for 6 months!_

## 🎨 CSS Customization
The banner uses **CSS variables** (custom properties). This is the easiest way to adapt colors/contrasts to your brand _without touching JS_ and without recoding the SCSS.
```css
:root {
  --cc-bg: #fff;
  --cc-border: #e5e7eb;
  --cc-accent: #9b6b5a;   /* accent color (Accept button, ON switch) */
  --cc-text: #111827;
  --cc-muted: #6b7280;
  --cc-line: #e5e7eb;
  --cc-surface: #f3f4f6;
}
```

## 🌍 Supported Languages

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


## 📝 License

MIT © [SynapxLab](https://synapx.fr)

@synapxlab/cookie-consent manages the collection, recording, and proof of consent for trackers (cookies, localStorage, etc.), via an optional logging system. The website operator integrating this module remains responsible for the processing of collected data, including consent logs. This component does not constitute legal advice and does not replace a complete GDPR compliance solution (processing register, DPIA, DPA, rights management, etc.). Always validate your configuration with your DPO or legal counsel.

**Note on exempted analytics:** Cookie Consent manages consent for trackers that require it. For audience measurement tools exempted according to CNIL criteria, refer to [CNIL documentation](https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience) for their compliant deployment.

## 🔗 Links

-   🌐 [Official Website](https://synapx.fr/sdk/cookie_consent/)
-   📚 [Documentation](./docs/)
-   💻 [GitHub](https://github.com/synapxLab/cookie-consent)
-   📦 [npm](https://www.npmjs.com/package/@synapxlab/cookie-consent)

### CDN Installation

html

```html
<script src="https://cdn.jsdelivr.net/npm/@synapxlab/cookie-consent/dist/cookie.min.js"></script>
```

## 📧 Support
- Email: contact@synapx.fr
<!-- - Discord: [Rejoindre la communauté](https://discord.gg/synapxlab) -->
<!-- - Issues: [GitHub Issues](https://github.com/synapxLab/cookie-consent/issues) -->

---

**Digital independence is no longer an option.**