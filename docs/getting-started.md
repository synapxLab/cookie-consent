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

### 1. Simple Import
```javascript
// In your main JS file
import '@synapxlab/cookie-consent';
```

### 2. Minimal Configuration
```javascript
// No configuration required!
// The banner displays automatically on page load
```

### 3. Block Third-party Scripts Directly in HTML

If you prefer to include your analytics/marketing scripts directly in your HTML rather than via the JavaScript API, you can automatically block them using the `type="text/plain"` and `data-cookie-category` attributes. Scripts are **truly blocked** until user consent (GDPR compliant).

```html
<script type="text/plain" data-cookie-category="CATEGORY" src="SCRIPT_URL"></script>
```

### 4. With Configuration
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
- ✅ The consent banner displays on first page load
- ✅ Third-party scripts (Analytics, pixels) are blocked by default
- ✅ Preferences are saved after acceptance

## Next Steps

- 📖 [Complete Configuration](./configuration.md)
- 🔧 [Integrations](./integrations/)
- ⚖️ [GDPR Compliance](./compliance-cnil.md)
- ❓ [FAQ](./faq.md)

## Need Help?

- 📧 Email: contact@synapx.fr
- 🐛 Issues: [GitHub Issues](https://github.com/synapxLab/cookie-consent/issues)