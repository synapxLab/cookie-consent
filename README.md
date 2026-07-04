
# 🍪 Cookie Consent

[![npm version](https://img.shields.io/npm/v/@synapxlab/cookie-consent.svg)](https://npmjs.com/package/@synapxlab/cookie-consent)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/@synapxlab/cookie-consent.svg)](https://npmjs.com/package/@synapxlab/cookie-consent)


**GDPR/CNIL compliant** cookie consent banner, open source and free.

European open-source alternative, with no dependency on Big Tech.

**🎮 [View Live Demo](https://synapx.fr/sdk/cookie_consent/)** • **📚 [Complete French Documentation](./docs/fr/)** • **💼 Multi-client Solution**: Ideal for web agencies and freelance developers.

## ✨ Features

### Core Features
- ✅ **Native GDPR Compliance** — Articles 6, 7, 13 respected
- ✅ **Automatic Script Blocking** — Detects and blocks third-party scripts before consent
- ✅ **16 Pre-configured Services** — GA, GTM, Matomo, Mixpanel, Amplitude, Plausible, Hotjar, Clarity, Facebook Pixel, TikTok Pixel, LinkedIn, AdSense, Intercom, Crisp, HubSpot, Segment
- ✅ **Google Consent Mode v2** — Native integration (required for Google Ads in EU since March 2024)
- ✅ **Consent Registry** — Legal proof (Art. 7.1)
- ✅ **7 Languages** — FR, EN, ES, DE, IT, NL, PT
- ✅ **Zero Dependencies** — Vanilla JS ≈ 108 KB minified (~30 KB gzipped)
- ✅ **Customizable Themes** — CSS variables
- ✅ **Made in France** 🇫🇷

### 🆕 What's new in v2.5.0

- ✅ **Google Consent Mode v2** — Native integration with Google Analytics & Ads
  - Default signals set to `denied` before user choice
  - Automatic update of signals on consent
  - 4-category mapping → 7 GCM signals
  - Zero configuration needed — works out of the box
- ✅ **Robust error handling** — Graceful degradation if GCM fails
- ✅ **SSR compatible** — Auto-detects server-side rendering
- ✅ **Tightened npm package** — Only `dist/cookie.js` is shipped (no demo bundle)

## 🚀 Quick Installation (without Logger)

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

## 🚀 Quick Installation (with self-hosted Logger)

```bash
npm install @synapxlab/cookie-consent
```

You manage your own consent logs:

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
  },
  functional: {
    intercom_app_id: 'xxx',
    crisp_website_id: 'xxx'
  }
});
```

> ⚠️ Never hardcode real production API keys/tokens in client-side code — they end up in the JS bundle delivered to every visitor. Use environment-injected variables at build time, or a server-side proxy.

## 🎯 Google Consent Mode v2

Native support for **Google Consent Mode v2** — required for Google Ads in Europe since March 2024.

### Features

- **Automatic integration** — works out of the box, no config needed
- **Default = denied** — signals are emitted as `denied` before any user choice (CNIL-compliant)
- **4 categories → 7 GCM signals** mapping:
  - `marketing` → `ad_storage`, `ad_user_data`, `ad_personalization`
  - `statistics` → `analytics_storage`
  - `functional` → `functionality_storage`, `personalization_storage`
  - `necessary` → `security_storage` (always `granted`)
- **Ping mode** — collects aggregated anonymous data even without consent
- **GDPR compliant** — respects user privacy while improving data quality

### Quick Start

```javascript
window.CookieConsent.init({
  statistics: {
    google_analytics_key: 'G-XXXXXXXXX'
  }
  // Google Consent Mode v2 is enabled by default
});
```

### Advanced configuration

```javascript
window.CookieConsent.init({
  google_consent_mode: {
    enabled: true,
    wait_for_update: 500,        // ms before timeout
    ads_data_redaction: true,    // redact ad data if consent denied
    url_passthrough: false,      // pass URL params between domains
    region: ['US-CA', 'EU']      // regional targeting
  },
  statistics: {
    google_analytics_key: 'G-XXXXXXXXX'
  }
});
```

### Disable GCM

```javascript
window.CookieConsent.init({
  google_consent_mode: { enabled: false }
});
```

### Listen to GCM events

```javascript
document.addEventListener('googleConsentUpdated', (event) => {
  console.log(event.detail.consent);     // 7 GCM signals
  console.log(event.detail.preferences); // user choice
});
```

### Block Third-party Scripts Directly in HTML

If you prefer to include your analytics/marketing scripts directly in your HTML rather than via the JavaScript API, you can automatically block them using `type="text/plain"` + `data-cookie-category`. Scripts are **truly blocked** until user consent (GDPR compliant).

```html
<!-- Blocked until "statistics" consent is given -->
<script type="text/plain" data-cookie-category="statistics"
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXX"></script>

<!-- Blocked until "marketing" consent is given -->
<script type="text/plain" data-cookie-category="marketing">
  // Facebook Pixel snippet here
</script>
```

Valid categories: `statistics`, `marketing`, `functional`.

## 🛡️ GDPR/CNIL Compliance

✅ Prior consent (default = denied)
✅ Rejection as easy as acceptance (both buttons same level)
✅ Clear information by purpose (functional / statistics / marketing)
✅ Timestamped proof via consent log (UUID + timestamp)
✅ Revocable at any time (floating cookie button + `.reset()`)
✅ 6-month expiration (CNIL recommendation, configurable up to 13 months)

[📋 CNIL Compliance Documentation](https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience)

## 🛡️ Via Member Area

Log in to [https://synapx.fr/sdk/cookie_consent/](https://synapx.fr/sdk/cookie_consent/) to:

- **Manage multiple sites** from a single account
- **Generate dedicated API keys** per client/domain
- **Auto-configure JavaScript code** for each project
  - Pre-configured services (Analytics, Pixels, Chat...)
  - Exportable complete configuration
  - Centralized consent log management

## 📖 Documentation

**Quick Guides:**
- [🚀 Getting Started](./docs/en/getting-started.md)
- [⚙️ Configuration](./docs/en/configuration.md)
- [❓ FAQ](./docs/en/faq.md)
- [🛡️ GDPR Compliance](./docs/en/compliance-gdpr.md)
- [📝 Logger](./docs/en/logger.md)

**Integrations:**
- [Vanilla JS](./docs/en/integrations/vanilla.md)
- [Google Tag Manager](./docs/en/integrations/tag-manager.md)
- [WordPress](./docs/en/integrations/wordpress.md)
- [PrestaShop](./docs/en/integrations/prestashop.md)
- [i18n](./docs/en/integrations/i18n.md)

🇫🇷 [Documentation française complète](./docs/fr/)

## 💰 Pricing: Banner is Free — Only Logging is Paid

Pricing automatically adjusts based on your monthly volume.
Each consent corresponds to a recorded action (acceptance, rejection, or modification).

🎁 **€50 offered** upon registration + **€50 for each successful referral.**
📄 Invoice via ERP/CRM [Administralis](https://administralis.fr/)

| Volume/month        |  0 – 2K  | 2K – 20K | 20K – 200K | +200K       |
|---------------------|----------|----------|------------|-------------|
| Price (excl. tax)   |   15€    |   35€    |    75€     | Contact us  |

🎯 **Result:** Even with constant traffic of 3,000 unique visitors,
_most of your returning visitors have already made their choice and it remains valid for 6 months._

## 🎨 CSS Customization

The banner uses **CSS variables** (custom properties). This is the easiest way to adapt colors/contrasts to your brand _without touching JS_ and without recompiling the SCSS.

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

| Language    | Code | Status |
|-------------|------|--------|
| 🇫🇷 Français  | `fr` | ✅ |
| 🇬🇧 English   | `en` | ✅ |
| 🇪🇸 Español   | `es` | ✅ |
| 🇩🇪 Deutsch   | `de` | ✅ |
| 🇮🇹 Italiano  | `it` | ✅ |
| 🇳🇱 Nederlands| `nl` | ✅ |
| 🇵🇹 Português | `pt` | ✅ |

[📖 i18n Guide](./docs/en/integrations/i18n.md)

## 🔧 JavaScript API

```javascript
// Open the banner (with preferences panel)
window.CookieConsent.open(true);

// Reset all preferences and reopen
window.CookieConsent.reset();

// Retrieve current preferences
const prefs = window.CookieConsent.getPreferences();

// Check a single category
const hasStats = window.CookieConsent.hasConsent('statistics');
// → true / false

// Listen to consent changes
document.addEventListener('cookieConsentChanged', (event) => {
  console.log(event.detail.preferences);
  console.log(event.detail.consent_id);
  console.log(event.detail.logged);
});

// Listen to Google Consent Mode updates
document.addEventListener('googleConsentUpdated', (event) => {
  console.log(event.detail.consent); // GCM signals
});
```

## 🤝 Contributing

Contributions welcome!
- 🐛 [Report a bug](https://github.com/synapxLab/cookie-consent/issues)
- 💡 [Suggest a feature](https://github.com/synapxLab/cookie-consent/issues)
- 🌍 [Add a translation](./docs/en/integrations/i18n.md)


## 📝 License

MIT © [SynapxLab](https://synapx.fr)

`@synapxlab/cookie-consent` manages the collection, recording, and proof of consent for trackers (cookies, localStorage, etc.), via an optional logging system. The website operator integrating this module remains responsible for the processing of collected data, including consent logs. This component does not constitute legal advice and does not replace a complete GDPR compliance solution (processing register, DPIA, DPA, rights management, etc.). Always validate your configuration with your DPO or legal counsel.

**Note on exempted analytics:** Cookie Consent manages consent for trackers that require it. For audience measurement tools exempted according to CNIL criteria, refer to [CNIL documentation](https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience) for their compliant deployment.

## 🔗 Links

- 🌐 [Official Website](https://synapx.fr/sdk/cookie_consent/)
- 📚 [French Documentation](./docs/fr/)
- 💻 [GitHub](https://github.com/synapxLab/cookie-consent)
- 📦 [npm](https://www.npmjs.com/package/@synapxlab/cookie-consent)

### CDN Installation

```html
<script src="https://cdn.jsdelivr.net/npm/@synapxlab/cookie-consent/dist/cookie.js"></script>
```

## 📧 Support

- Email: contact@synapx.fr
<!-- - Discord: [Join the community](https://discord.gg/synapxlab) -->
<!-- - Issues: [GitHub Issues](https://github.com/synapxLab/cookie-consent/issues) -->

---

**Digital independence is no longer an option.**
