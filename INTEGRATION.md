# Guide d'intégration rapide - Cookie Consent

## Installation

```bash
npm install @synapxlab/cookie-consent
```

## Configuration JavaScript

```javascript
import '@synapxlab/cookie-consent';

window.CookieConsent.init({
  logger: {
    enabled: true,
    endpoint: '/api/consent/log',
    apiKey: 'your-secret-key',  // Optionnel
    headers: {
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
    }
  },
  statistics: {
    google_manager_key: 'G-XXXXXXXXXX'
  },
  marketing: {
    google_AdSense_key: 'ca-pub-XXXXXXXXXXXXXXXX',
    facebook: { key: 'PIXEL_ID', track: 'PageView' }
  }
});
```

## Payload POST envoyé

```json
{
  "consent_id": "uuid-v4",
  "device_id": "cc_xxx",
  "site_host": "example.com",
  "site_path": "/page",
  "action": "created|updated|revoked",
  "pref_cookies": true,
  "pref_statistics": false,
  "pref_marketing": true,
  "banner_version": "2.3.0",
  "policy_hash": "abc123",
  "locale": "fr-FR",
  "referrer": "https://...",
  "user_agent": "Mozilla/5.0..."
}
```

## Schéma SQL (conforme CNIL)

```sql
CREATE TABLE consent_logs (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  consent_id       CHAR(36)         NOT NULL,
  device_id        VARCHAR(64)      NULL,
  site_host        VARCHAR(255)     NOT NULL,
  site_path        VARCHAR(255)     NOT NULL,
  action           ENUM('created','updated','revoked') NOT NULL DEFAULT 'created',
  pref_cookies     TINYINT(1)       NOT NULL DEFAULT 0,
  pref_statistics  TINYINT(1)       NOT NULL DEFAULT 0,
  pref_marketing   TINYINT(1)       NOT NULL DEFAULT 0,
  banner_version   VARCHAR(32)      NOT NULL,
  policy_hash      VARCHAR(64)      NOT NULL,
  locale           VARCHAR(16)      NULL,
  referrer         VARCHAR(512)     NULL,
  ip_hash          VARBINARY(32)    NULL,
  ua_hash          VARBINARY(32)    NULL,
  created_at       DATETIME(6)      NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  INDEX idx_created_at (created_at),
  INDEX idx_consent_id (consent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Backend : Pseudonymisation requise

**Côté serveur uniquement**, hashez IP et User-Agent :

```javascript
// Node.js
const crypto = require('crypto');

function hashData(data) {
  return crypto
    .createHmac('sha256', process.env.HASH_SECRET)
    .update(data)
    .digest(); // Buffer pour VARBINARY
}

const ipHash = hashData(req.ip);
const uaHash = hashData(req.headers['user-agent']);
```

```php
// PHP
$ipHash = hash_hmac('sha256', $ip, $_ENV['HASH_SECRET'], true);
$uaHash = hash_hmac('sha256', $userAgent, $_ENV['HASH_SECRET'], true);
```

## Purge automatique (≤ 13 mois)

```sql
-- CRON quotidien
DELETE FROM consent_logs WHERE created_at < NOW() - INTERVAL 13 MONTH;
```

## API JavaScript

```javascript
// Ouvrir la bannière
window.CookieConsent.open();

// Ouvrir avec préférences
window.CookieConsent.open(true);

// Réinitialiser
window.CookieConsent.reset();

// Lire préférences
const prefs = window.CookieConsent.getPreferences();
// => { cookies: true, statistics: false, marketing: true }

// Vérifier consentement
if (window.CookieConsent.hasConsent('statistics')) {
  // Charger Google Analytics
}

// Écouter changements
document.addEventListener('cookieConsentChanged', (e) => {
  console.log(e.detail.preferences);
});
```

## Lien "Gérer mes cookies"

```html
<a href="#" id="openpolitecookie">Gérer mes cookies</a>
```

## Thèmes CSS

```html
<body class="cookie-theme-dark">
  <!-- default | brown | dark | blue -->
</body>
```

## Variables CSS personnalisables

```css
:root {
  --cc-bg: #ffffff;
  --cc-text: #111827;
  --cc-accent: #18a60b;
  --cc-surface: #f3f4f6;
}
```

## Langues supportées

Détection automatique : FR, EN, ES, DE, IT, NL, PT

```javascript
import t from '@synapxlab/cookie-consent/translat';
t.setLocale('en'); // Forcer une langue
```

## Points RGPD/CNIL critiques

- ✅ **Pseudonymisation** : Hasher IP et UA côté serveur
- ✅ **Minimisation** : Seulement les champs nécessaires
- ✅ **Rétention** : Purge automatique ≤ 13 mois
- ✅ **Preuve** : policy_hash + banner_version + timestamp
- ✅ **Révocabilité** : Action `revoked` tracée

## Support

- Documentation : https://synapxlab.com/sdk/
- GitHub : https://github.com/synapxlab/cookie-consent
- Email : contact@synapxlab.com