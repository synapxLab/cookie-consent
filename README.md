# 🍪 Cookie Consent Banner v2.2.0

**[🇫🇷 Version française](./README.fr.md)**

A lightweight, GDPR-compliant cookie consent banner with automatic service detection and multi-language support.

## ✨ Features

- **GDPR Compliant** - Full consent management with audit logging
- **Automatic Service Detection** - Automatically displays configured services (Google Analytics, AdSense, Facebook Pixel)
- **7 Languages** - French, English, Spanish, German, Italian, Dutch, Portuguese
- **4 Themes** - Default, Brown, Dark, Blue
- **Encapsulated CSS** - No conflicts with your site styles
- **Lightweight** - ~5 KB gzipped
- **Zero Dependencies** - Pure vanilla JavaScript

## 📦 Installation

```javascript
import './cookie';
```

## ⚙️ Configuration

### Complete Setup

```javascript
window.CookieConsent.init({
  // Consent logging (optional)
  logger: {
    enabled: true,
    endpoint: '/api/consent/log',
    apiKey: 'your-api-key',
    anonymousId: true,
    includeUserAgent: true,
    headers: {
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
    }
  },
  
  // Google Analytics
  statistics: {
    google_manager_key: 'G-XXXXXXXXXX'
  },
  
  // Marketing services
  marketing: {
    google_AdSense_key: 'ca-pub-XXXXXXXXXXXXXXXX',
    facebook: {
      key: 'YOUR-PIXEL-ID',
      track: 'PageView'
    }
  }
});
```

### Minimal Setup

```javascript
window.CookieConsent.init({
  statistics: {
    google_manager_key: 'G-XXXXXXXXXX'
  }
});
```

## 🎯 Automatic Behavior

Services load automatically based on user consent:

| Consent | Service | Condition |
|---------|---------|-----------|
| `statistics: true` | Google Analytics | If `google_manager_key` is configured |
| `marketing: true` | Google AdSense | If `google_AdSense_key` is configured |
| `marketing: true` | Facebook Pixel | If `facebook.key` is configured |

### Service Display in Banner

**New in v2.2.0**: Configured services are automatically displayed in category descriptions.

**Example with all services:**

**📊 Statistics**
> Storage or access used exclusively for statistical purposes.  
> **Services: Google Analytics**

**📢 Marketing**
> Storage or access required to build user profiles for advertising.  
> **Services: Google AdSense, Facebook Pixel**

## 🔧 JavaScript API

```javascript
// Open banner
window.CookieConsent.open();

// Open with preferences visible
window.CookieConsent.open(true);

// Reset consent
window.CookieConsent.reset();

// Get current preferences
const prefs = window.CookieConsent.getPreferences();
// Returns: { statistics: true, marketing: false, cookies: true }

// Check specific consent
if (window.CookieConsent.hasConsent('statistics')) {
  console.log('Analytics enabled');
}

// Get configuration
const config = window.CookieConsent.getConfig();
```

### Listen to Changes

```javascript
document.addEventListener('cookieConsentChanged', (event) => {
  const prefs = event.detail.preferences;
  console.log('New preferences:', prefs);
});
```

## 🌍 Internationalization

**7 supported languages** with automatic detection via `navigator.language`:

| Code | Language | Example |
|------|----------|---------|
| `fr` | French (default) | Services : Google Analytics |
| `en` | English | Services: Google Analytics |
| `es` | Spanish | Servicios: Google Analytics |
| `de` | German | Dienste: Google Analytics |
| `it` | Italian | Servizi: Google Analytics |
| `nl` | Dutch | Diensten: Google Analytics |
| `pt` | Portuguese | Serviços: Google Analytics |

### Force a Language

```javascript
import t from './translat';
t.setLocale('en'); // Force English
```

### Add Custom Language

```javascript
import t from './translat';

t.add('ja', {
  title: 'Cookieの同意を管理する',
  message: '最高のエクスペリエンスを提供するために...',
  acceptAll: 'すべて受け入れる',
  denyAll: '拒否する',
  // ... all keys
});
```

## 🎨 Themes

4 built-in themes: `default`, `brown`, `dark`, `blue`

```html
<div class="theme-switch">
  <button data-theme="default">Default</button>
  <button data-theme="brown">Brown</button>
  <button data-theme="dark">Dark</button>
  <button data-theme="blue">Blue</button>
</div>
```

Apply theme on `<body>` with class `body.cookie-theme-{name}`.

## 🔒 GDPR Compliance

### Built-in Features

- Prior consent required before loading any tracking scripts
- Complete audit trail with consent logging
- IP anonymization for Google Analytics
- Anonymous device ID (no cross-site tracking)
- Secure cookies (SameSite=None;Secure)
- Full transparency with automatic service listing
- Multi-language support for EU compliance

### Laravel Endpoint Example

```php
// routes/api.php
Route::post('/consent/log', function (Request $request) {
    \App\Models\ConsentLog::create([
        'consent_id' => $request->consent_id,
        'device_id' => $request->device_id,
        'preferences' => $request->preferences,
        'action' => $request->action,
        'ip_address' => $request->ip(),
        'user_agent' => $request->user_agent,
        'created_at' => $request->timestamp,
    ]);
    
    return response()->json(['success' => true]);
});
```

### Database Schema

```php
Schema::create('consent_logs', function (Blueprint $table) {
    $table->uuid('consent_id')->primary();
    $table->string('device_id')->nullable();
    $table->json('preferences');
    $table->string('action'); // 'updated', 'deleted'
    $table->ipAddress('ip_address')->nullable();
    $table->text('user_agent')->nullable();
    $table->timestamp('created_at');
    
    $table->index('device_id');
    $table->index('created_at');
});
```

## 📊 Logging Format

```json
{
  "consent_id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2025-10-01T14:30:00.000Z",
  "device_id": "cc_123e4567-e89b-12d3-a456-426614174000",
  "site_host": "example.com",
  "site_path": "/",
  "preferences": {
    "statistics": true,
    "marketing": false,
    "cookies": true
  },
  "action": "updated",
  "locale": "fr-FR",
  "referrer": "https://google.com",
  "banner_version": "2.2.0",
  "policy_hash": "a1b2c3d4",
  "user_agent": "Mozilla/5.0..."
}
```

## 📝 Usage Examples

### E-commerce Site

```javascript
window.CookieConsent.init({
  logger: {
    enabled: true,
    endpoint: '/api/consent/log'
  },
  statistics: {
    google_manager_key: 'G-ABC123XYZ'
  },
  marketing: {
    google_AdSense_key: 'ca-pub-1234567890123456',
    facebook: {
      key: '123456789012345',
      track: 'Purchase'
    }
  }
});
```

### Simple Blog

```javascript
window.CookieConsent.init({
  statistics: {
    google_manager_key: 'G-ABC123XYZ'
  }
});
```

### Compliance Only (No Tracking)

```javascript
window.CookieConsent.init({
  logger: {
    enabled: true,
    endpoint: '/api/consent/log'
  }
});
```

## 🚀 Migration from v2.1

Fully backward compatible. Old syntax still works:

```javascript
// Old syntax (v2.1) - still valid
window.CookieConsent.init({
  endpoint: '/api/consent/log',
  anonymousId: true,
  headers: { 'X-CSRF-TOKEN': 'token' }
});

// New syntax (v2.2) - recommended
window.CookieConsent.init({
  logger: {
    enabled: true,
    endpoint: '/api/consent/log',
    anonymousId: true,
    headers: { 'X-CSRF-TOKEN': 'token' }
  }
});
```

## 🆕 What's New in v2.2.0

### Automatic Service Display

Services are now automatically detected and displayed in descriptions:

**Before:**
```
Statistics
Storage or access used exclusively for statistical purposes.
```

**Now:**
```
Statistics
Storage or access used exclusively for statistical purposes.
Services: Google Analytics
```

### 7 Languages Support

Added 3 new languages:
- Italian (it)
- Dutch (nl)
- Portuguese (pt)

### Encapsulated CSS

All styles are isolated in `#politecookiebanner` to prevent conflicts with parent site styles.

## 📦 Bundle Size

- **Unminified**: ~45 KB
- **Minified**: ~15 KB
- **Minified + Gzipped**: ~5 KB

The 7 languages add less than 2 KB to the minified bundle.

## 📚 File Structure

```
src/
├── js/
│   ├── script.js          # Main entry point
│   ├── cookie.js          # Banner logic (v2.2.0)
│   └── translat.js        # i18n translations (7 languages)
└── scss/
    ├── style.scss         # Global styles
    └── cookie.scss        # Banner styles (encapsulated)
```

## 🤝 Support

- **Version**: 2.2.0
- **License**: MIT
- **Author**: SynapxLab <contact@synapxlab.com>
- **Issues**: Contact SynapxLab for support

## 💡 Future Ideas (Not Implemented)

Features that could be added in a "Premium" version:
- Clickable links to service privacy policies
- Partner count display ("2 partners")
- Additional details (cookie lifespan, data types)
- Detailed vendor list with modal
- Granular sub-categories

---

**Last Updated**: October 2025  
**Browser Compatibility**: All modern browsers (Chrome, Firefox, Safari, Edge)  
**Dependencies**: None (vanilla JavaScript)