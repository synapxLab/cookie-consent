# Getting Started

## Installation

### Via npm (recommended)

```bash
npm install @synapxlab/cookie-consent
```

### Via yarn

```bash
yarn add @synapxlab/cookie-consent
```

### Via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@synapxlab/cookie-consent@2.1.3/dist/cookie.min.js"></script>
```

## Basic Usage

### 1. Simple import

```javascript
// In your main JS file
import '@synapxlab/cookie-consent';
```

### 2. Minimal configuration

```javascript
// No configuration required!
// The banner displays automatically on page load
```

### 3. With configuration

```javascript
window.CookieConsent.init({
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

## Verification

Open your browser and you should see:
- ✅ Consent banner appears on first load
- ✅ Third-party scripts (Analytics, pixels) are blocked by default
- ✅ Preferences are saved after acceptance

## Next Steps

- 📖 [Full Configuration](./configuration.md)
- 🔧 [Integrations](./integrations/)
- ⚖️ [GDPR Compliance](./compliance-gdpr.md)
- ❓ [FAQ](./faq.md)

## Need Help?

- 📧 Email: contact@synapx.fr
- 🐛 Issues: [GitHub Issues](https://github.com/synapxLab/cookie-consent/issues)
