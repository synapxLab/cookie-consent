
# FAQ - Frequently Asked Questions

## General

### Is Cookie Consent free?

**Yes!** The banner is **100% free and open source** (MIT License).

Consent logging is:
- **Free** up to 300 consents/month
- **Paid** beyond that (starting at €10/month for 10K consents)

### What's the difference with Axeptio/Cookiebot?

| Feature | Cookie Consent | Axeptio | Cookiebot |
|---------|----------------|---------|-----------|
| **Price** | Free | €50/month | €9/month |
| **Open Source** | ✅ | ❌ | ❌ |
| **Auto script blocking** | ✅ | ✅ | ✅ |
| **Made in France** | ✅ | ✅ | ❌ (Denmark) |
| **Self-hosted possible** | ✅ | ❌ | ❌ |
| **CSS Customization** | ✅ Unlimited | ⚠️ Limited | ⚠️ Limited |

### Is it GDPR/CNIL compliant?

**Yes, 100%** if you use it correctly:
- ✅ Prior consent
- ✅ Rejection as easy as acceptance
- ✅ No cookies before consent
- ✅ Limited duration (6 months by default)
- ✅ Consent logging

See [GDPR Compliance Documentation](./compliance-cnil.md)

### Can I use it without logging?

**Yes**, but be aware:
- ✅ The banner works perfectly
- ✅ Script blocking is active
- ⚠️ **No proof of consent** (Article 7.1 GDPR)

**Recommendation**: Enable logging (free up to 300/month) to be compliant.

## Installation & Configuration

### How to install on a static HTML site?

Very simple:

```html
<script src="https://cdn.jsdelivr.net/npm/@synapxlab/cookie-consent/dist/cookie.min.js"></script>
```

See [Vanilla JS Guide](../fr/integrations/vanilla.md)

### How to install on WordPress?

1. Plugins > Add New
2. Search "SynapxLab Cookie Consent"
3. Install and activate

See [WordPress Guide](../fr/integrations/wordpress.md)

### How to install on React/Vue/Next.js?

Via npm:

```bash
npm install @synapxlab/cookie-consent
```

Then in your `main.js` or `app.js`:

```javascript
import '@synapxlab/cookie-consent';
```

### Do I need to configure anything?

**No!** The banner works without configuration.

To activate services (Google Analytics, etc.), use `init()`:

```javascript
window.CookieConsent.init({
  statistics: {
    google_analytics_key: 'G-XXXXXXXXX'
  }
});
```

See [Complete Configuration](./configuration.md)

### How to get an API key for logging?

1. Create an account on [synapx.fr](https://synapx.fr/OAuth/)
2. Go to **SDK > Cookie Consent**
3. Copy your API key (starts with `sk-live-`)

## How It Works

### How does automatic blocking work?

Cookie Consent uses 3 mechanisms:

1. **Initial scan**: Detects all `<script src>` and `<iframe src>` on page load
2. **Freeze**: Transforms detected scripts to `type="text/plain"` (blocked)
3. **MutationObserver**: Monitors dynamic injections (SPA, GTM)

See [Technical Documentation](./configuration.md#automatic-blocking)

### Which services are automatically detected?

**Supported services by default:**

**Statistics:**
- Google Analytics (GA4, Universal)
- Google Tag Manager
- Matomo
- Hotjar
- Microsoft Clarity
- Mixpanel
- Amplitude
- Plausible

**Marketing:**
- Google AdSense
- Facebook Pixel
- TikTok Pixel
- LinkedIn Insight
- DoubleClick

**Functional:**
- Intercom
- Crisp Chat
- HubSpot
- Segment
- Zendesk

### What if my service isn't in the list?

The system automatically detects third-party domains. If a service isn't listed, it will still be blocked if it matches the patterns (external domains).

You can also manually add it by modifying `CATEGORY_MATCHERS` in the source code.

### Why isn't my banner displaying?

**Possible causes:**

1. **Consent already given**
   ```javascript
   // Check
   console.log(localStorage.getItem('politecookiebanner'));
   
   // Clear
   localStorage.removeItem('politecookiebanner');
   location.reload();
   ```

2. **JavaScript error**
   - Open the console (F12)
   - Check for errors in red

3. **Script not loaded**
   ```javascript
   // Check
   console.log(window.CookieConsent);
   // Should display an object
   ```

4. **CSS conflict**
   - Your CSS might be hiding the banner
   - Inspect the `#politecookiebanner` element

### How to test the banner?

```javascript
// Method 1: Complete reset
localStorage.removeItem('politecookiebanner');
location.reload();

// Method 2: Open manually
window.CookieConsent.open();

// Method 3: Reset and open
window.CookieConsent.reset();
```

## Customization

### How to change colors?

Via CSS:

```css
:root {
  --cc-bg: #ffffff;        /* Background */
  --cc-text: #111827;      /* Text */
  --cc-accent: #e63946;    /* Primary color */
  --cc-border: #e5e7eb;    /* Borders */
}
```

See [CSS Customization](./configuration.md#css-customization)

### How to change texts?

Texts are automatically translated into 7 languages (FR, EN, ES, DE, IT, NL, PT).

To customize:

```javascript
import t from '@synapxlab/cookie-consent/translat';

t.add('en', {
  title: "My custom title",
  message: "My message...",
  acceptAll: "I accept"
});
```

### How to add a language?

```javascript
import t from '@synapxlab/cookie-consent/translat';

t.add('ja', {
  title: "クッキー同意",
  message: "...",
  acceptAll: "すべて受け入れる",
  denyAll: "すべて拒否",
  // ... see translat.js for all keys
});

t.setLocale('ja');
```

See [Internationalization](./integrations/i18n.md)

### Can I modify the banner's HTML?

Yes, but requires forking the project and modifying `cookie.js`.

**Recommended alternative**: Use CSS variables to adapt the style without touching the HTML.

## Logging & Compliance

### Where are logs stored?

**Without logging enabled:**
- Only locally (browser localStorage)
- No remote server

**With logging enabled:**
- OVH servers in France (native GDPR)
- Secure database
- Access via SynapxLab dashboard

### What data is logged?

```json
{
  "consent_id": "uuid",
  "device_id": "cc_anonymous",
  "consent_action": "accept",
  "pref_statistics": true,
  "banner_version": "2.4.0",
  "locale": "en-US",
  "timezone": "Europe/Paris"
}
```

**Data NOT collected:**
- ❌ IP address
- ❌ Name, email
- ❌ Browser fingerprint
- ❌ Personal data

See [Logging Documentation](./logger.md)

### How to export my logs?

SynapxLab Dashboard > Cookie Consent > Export

Available formats:
- CSV (Excel)
- JSON (API)
- PDF (Audit)

### How long are logs retained?

**Default: 13 months** (CNIL recommended maximum)

You can reduce to 6 or 12 months in settings.

### How to prove GDPR compliance?

1. **Enable logging** (proof of consent)
2. **Export logs** regularly
3. **Document** your configuration
4. **Maintain a register** of processing activities (GDPR obligation)

In case of CNIL audit, you can provide:
- ✅ Timestamped consent logs
- ✅ Banner version used
- ✅ Services configuration
- ✅ CSV/PDF exports

## Performance

### What is the impact on site speed?

**Very low:**
- Script size: ~25KB (gzipped)
- Asynchronous loading (non-blocking)
- No external dependencies

**Lighthouse impact:**
- Performance: 0 to -2 points
- Best Practices: +10 points (compliance)

### Does the script block rendering?

**No**, if loaded correctly:

```html
<!-- ✅ CORRECT: No blocking -->
<script src="cookie.js" defer></script>

<!-- ❌ AVOID: Blocks parsing -->
<script src="cookie.js"></script>
```

### Compatible with WP Rocket / Autoptimize?

**Yes**, but exclude cookie.js from aggregation:

**WP Rocket:**
Settings > JavaScript Files > Exclude:
```
/cookie.js
```

**Autoptimize:**
Settings > JavaScript > Exclude:
```
cookie.js
```

## Integrations

### Compatible with Google Tag Manager?

**Yes!** GTM is actually one of the best integrations.

The system blocks GTM tags until consent, then activates them conditionally.

See [Google Tag Manager Guide](../fr/integrations/tag-manager.md)

### Compatible with WordPress?

**Yes!** Official plugin available:

WordPress Admin > Plugins > Add New > "SynapxLab Cookie Consent"

See [WordPress Guide](../fr/integrations/wordpress.md)

### Compatible with PrestaShop?

**Yes!** Module in finalization (beta available).

### Compatible with Shopify?

Yes, via manual integration (no official app yet).

### Compatible with React/Vue/Angular/Svelte?

**Yes, all of them!**

```bash
npm install @synapxlab/cookie-consent
```

```javascript
// In your main.js
import '@synapxlab/cookie-consent';
```

### Compatible with Next.js?

**Yes!** Add in `_app.js`:

```javascript
import '@synapxlab/cookie-consent';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

## Development

### Can I contribute to the project?

**Yes!** The project is open source (MIT License).

- 🐛 Report bugs: [GitHub Issues](https://github.com/synapxLab/cookie-consent/issues)
- 💻 Propose code: [Pull Requests](https://github.com/synapxLab/cookie-consent/pulls)
- 💬 Join the community: [Discord](https://discord.gg/synapxlab)

### How to compile from sources?

```bash
git clone https://github.com/synapxLab/cookie-consent.git
cd cookie-consent
npm install
npm run build
```

The compiled file will be in `/dist/cookie.js`.

### Where to find the source code?

- **GitHub**: [github.com/synapxLab/cookie-consent](https://github.com/synapxLab/cookie-consent)
- **npm**: [npmjs.com/package/@synapxlab/cookie-consent](https://www.npmjs.com/package/@synapxlab/cookie-consent)

### How to report a bug?

1. Check if it doesn't already exist: [GitHub Issues](https://github.com/synapxLab/cookie-consent/issues)
2. Create a new issue with:
   - Problem description
   - Steps to reproduce
   - Browser and version
   - Console logs if possible

## Legal

### Who is responsible in case of non-compliance?

**You**, as the data controller.

SynapxLab provides the tool, but you are responsible for:
- Correctly configuring the banner
- Respecting consents
- Maintaining a processing register
- Responding to GDPR requests

See [Legal Responsibilities](./compliance-cnil.md#responsibilities)

### Should I still consult a lawyer?

**Yes, it's recommended**, especially if:
- You process sensitive data
- You have significant traffic (>100K visitors/month)
- You do profiling/targeting
- You're in a regulated sector (health, finance, etc.)

Cookie Consent helps you technically, but doesn't replace legal advice.

### Can I use it for a commercial site?

**Yes!** MIT License = commercial use authorized.

You can:
- ✅ Use it for free
- ✅ On commercial sites
- ✅ For clients
- ✅ Modify it

Obligation: Preserve the MIT license mention.

### Can I resell the plugin?

**Technically yes** (MIT license), but:
- ❌ Not ethical without contributing to the project
- ⚠️ You must maintain updates
- ⚠️ You must provide support

## Support

### Where to find help?

**Documentation:**
- 📚 [Complete Documentation](https://synapx.fr/sdk/cookie_consent/)
- 🎓 [Integration Guides](./integrations/)

**Community:**
- 🐛 [GitHub Issues](https://github.com/synapxLab/cookie-consent/issues)

**Direct support:**
- 📧 contact@synapx.fr

### Is support free?

**Yes!** For:
- General questions
- Bugs
- Improvement suggestions

**Premium support available** for:
- Custom configuration
- Custom integration
- Compliance audit
- Guaranteed SLA

### Do you offer training?

Not yet, but it's planned!

Meanwhile:
- 📚 Complete documentation available
- 🎥 Video tutorials in preparation
- 💬 Join our Discord for advice


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
### Are there hidden fees?

SynapxLab Dashboard 

## Other Questions

### A question not listed here?

**Contact us:**
- 📧 contact@synapx.fr
- 🐛 [GitHub Issues](https://github.com/synapxLab/cookie-consent/issues)

**Contribute to this FAQ:**
Suggest your question via a Pull Request on GitHub!

---

**Last updated : 18 October 2025**