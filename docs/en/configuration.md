# Full Configuration

## Initialization API

```javascript
window.CookieConsent.init(options);
```

## Available Options

### Logger (consent logging)

```javascript
{
  logger: {
    enabled: true,                      // Enable logging
    endpoint: 'https://api.synapx.fr/', // API URL
    apiKey: 'sk-live-xxxxx',           // API Key
    retries: 3,                        // Retry attempts
    timeout: 5000,                     // Timeout in ms
    anonymousId: true,                 // Anonymous ID
    headers: {                         // Custom headers
      'Authorization': 'Bearer token'
    }
  }
}
```

### Statistics (analytics services)

```javascript
{
  statistics: {
    // Google Analytics 4
    google_analytics_key: 'G-XXXXXXXXX',
    
    // Google Tag Manager
    google_tag_manager_key: 'GTM-XXXXXXX',
    
    // Matomo
    matomo: {
      url: 'https://analytics.yoursite.com/',
      siteId: '1'
    },
    
    // Mixpanel
    mixpanel_token: 'abc123def456',
    
    // Amplitude
    amplitude_key: 'abc123',
    
    // Plausible Analytics
    plausible: {
      domain: 'yoursite.com'
    },
    
    // Hotjar
    hotjar_site_id: '1234567',
    
    // Microsoft Clarity
    clarity_project_id: 'abc123'
  }
}
```

### Marketing (advertising and remarketing)

```javascript
{
  marketing: {
    // Google AdSense
    google_adsense_key: 'ca-pub-XXXXXXX',
    
    // Facebook Pixel
    facebook_pixel: {
      key: 'YOUR-PIXEL-ID',
      track: 'PageView'
    },
    
    // TikTok Pixel
    tiktok_pixel_id: 'YOUR-TIKTOK-ID',
    
    // LinkedIn Insight Tag
    linkedin_partner_id: 'YOUR-LINKEDIN-ID'
  }
}
```

### Functional (chat and CRM)

```javascript
{
  functional: {
    // Intercom
    intercom_app_id: 'abc123',
    
    // Crisp Chat
    crisp_website_id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    
    // HubSpot
    hubspot_portal_id: '1234567',
    
    // Segment
    segment_write_key: 'abc123xyz'
  }
}
```

### Storage (expiration management)

```javascript
{
  storage: {
    expiration_months: 6,  // Validity duration (GDPR recommends 6 months max)
    auto_renew: false      // Don't renew automatically
  }
}
```

## Complete Example

```javascript
window.CookieConsent.init({
  // GDPR Logging
  logger: {
    enabled: true,
    endpoint: 'https://api.synapx.fr/',
    apiKey: 'sk-live-xxxxx',
    anonymousId: true
  },
  
  // Statistics services
  statistics: {
    google_analytics_key: 'G-WKEJV2N43X',
    matomo: {
      url: 'https://analytics.mysite.com/',
      siteId: '1'
    },
    hotjar_site_id: '1234567'
  },
  
  // Marketing services
  marketing: {
    google_adsense_key: 'ca-pub-XXXXXXX',
    facebook_pixel: {
      key: 'YOUR-PIXEL-ID',
      track: 'PageView'
    }
  },
  
  // Functional services
  functional: {
    crisp_website_id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
  },
  
  // Storage settings
  storage: {
    expiration_months: 6,
    auto_renew: false
  }
});
```

## Available Methods

### Open banner

```javascript
// Open with simple view
window.CookieConsent.open();

// Open with preferences panel
window.CookieConsent.open(true);
```

### Reset preferences

```javascript
// Clear preferences and reopen banner
window.CookieConsent.reset();
```

### Get preferences

```javascript
const preferences = window.CookieConsent.getPreferences();
// Returns: { cookies: true, statistics: false, marketing: true }
```

### Check consent

```javascript
const hasStats = window.CookieConsent.hasConsent('statistics');
// Returns: true or false
```

### Disable logging

```javascript
window.CookieConsent.disableLogging();
```

### Get configuration

```javascript
const config = window.CookieConsent.getConfig();
```

## Custom Events

### Listen to consent changes

```javascript
document.addEventListener('cookieConsentChanged', (event) => {
  console.log('Preferences:', event.detail.preferences);
  console.log('Logged:', event.detail.logged);
  
  // Load your custom scripts
  if (event.detail.preferences.statistics) {
    // Load your custom analytics
  }
});
```

## Cookie Management Link

Add this code in your footer:

```html
<a href="#" id="openpolitecookie">Manage my cookies</a>
```

Clicking will automatically open the preferences panel.

## CSS Customization

### Available CSS Variables

```css
:root {
  --cc-bg: #fff;           /* Banner background */
  --cc-border: #e5e7eb;    /* Border color */
  --cc-accent: #9b6b5a;    /* Accent color (buttons, switches) */
  --cc-text: #111827;      /* Main text color */
  --cc-muted: #6b7280;     /* Secondary text color */
  --cc-line: #e5e7eb;      /* Separator line color */
  --cc-surface: #f3f4f6;   /* Surface color */
}
```

### Custom Theme Example

```css
/* Dark theme */
:root {
  --cc-bg: #1f2937;
  --cc-border: #374151;
  --cc-accent: #3b82f6;
  --cc-text: #f9fafb;
  --cc-muted: #9ca3af;
  --cc-line: #374151;
  --cc-surface: #111827;
}
```

## Storage

Preferences are stored in `localStorage` under the key `politecookiebanner`.

Structure:
```json
{
  "data": {
    "cookies": true,
    "statistics": false,
    "marketing": true
  },
  "timestamp": 1704067200000,
  "expiresAt": 1719619200000
}
```

## Important Notes

- ⚠️ **Never load** third-party scripts before consent
- ⚠️ The module automatically blocks detected scripts
- ⚠️ Consent expires after 6 months by default (GDPR compliant)
- ✅ Functional cookies (strictly necessary) are always active