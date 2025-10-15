# Logging System

## Overview

The logging system records every user consent to ensure GDPR compliance (Article 7.1: "The controller shall be able to demonstrate that the data subject has consented").

## Configuration

### Enable logging

```javascript
window.CookieConsent.init({
  logger: {
    enabled: true,
    endpoint: 'https://api.synapx.fr/',
    apiKey: 'sk-live-xxxxx',
    anonymousId: true,
    retries: 3,
    timeout: 5000,
    headers: {
      'Authorization': 'Bearer your-token'
    }
  }
});
```

### Logger options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | boolean | false | Enable logging |
| `endpoint` | string | '' | API logging URL |
| `apiKey` | string | null | API Key (sk-live-xxx) |
| `anonymousId` | boolean | true | Generate anonymous ID |
| `retries` | number | 3 | Retry attempts on failure |
| `timeout` | number | 5000 | Timeout in ms |
| `headers` | object | {} | Custom HTTP headers |

## Data Format

### Payload structure

```json
{
  "consent_id": "550e8400-e29b-41d4-a716-446655440000",
  "device_id": "cc_7f3a9b2c1d4e5f6a",
  "site_path": "/products/shoes",
  "consent_action": "accept",
  "consent_method": "banner",
  "pref_cookies": true,
  "pref_statistics": true,
  "pref_marketing": false,
  "banner_version": "2.4.0",
  "locale": "en-US",
  "timezone": "America/New_York",
  "timestamp": "2025-01-15T14:30:00.000Z",
  "apiKey": "sk-live-xxxxx"
}
```

### Detailed fields

#### Identifiers

- **consent_id**: Unique UUID for this consent event
- **device_id**: Anonymous device identifier (non-reversible)
- **apiKey**: Your API key (for routing to your account)

#### Context

- **site_path**: Page path where consent was given
- **locale**: Browser language (e.g., en-US, fr-FR)
- **timezone**: User timezone
- **banner_version**: Cookie Consent version used

#### Consent

- **consent_action**: Action type
  - `accept`: Accept all
  - `reject`: Reject all
  - `customize`: Customization
  - `revoke`: Revocation
  
- **consent_method**: Interaction method
  - `banner`: Via initial banner
  - `settings`: Via management link

- **pref_cookies**: Functional cookies accepted (boolean)
- **pref_statistics**: Statistics cookies accepted (boolean)
- **pref_marketing**: Marketing cookies accepted (boolean)

## Logging API

### Endpoint

```
POST https://api.synapx.fr/
```

### Required headers

```http
Content-Type: application/json
Authorization: Bearer sk-live-xxxxx
```

### Example request

```bash
curl -X POST https://api.synapx.fr/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-live-xxxxx" \
  -d '{
    "consent_id": "550e8400-e29b-41d4-a716-446655440000",
    "device_id": "cc_7f3a9b2c1d4e5f6a",
    "site_path": "/",
    "consent_action": "accept",
    "consent_method": "banner",
    "pref_cookies": true,
    "pref_statistics": true,
    "pref_marketing": false,
    "banner_version": "2.4.0",
    "locale": "en-US",
    "timezone": "America/New_York",
    "apiKey": "sk-live-xxxxx"
  }'
```

### Response

#### Success (200)
```json
{
  "success": true,
  "consent_id": "550e8400-e29b-41d4-a716-446655440000",
  "logged_at": "2025-01-15T14:30:00.123Z"
}
```

#### Error (400/401/500)
```json
{
  "success": false,
  "error": "Invalid API key",
  "code": "AUTH_ERROR"
}
```

## Error Handling

### Retry strategy

The logger automatically retries 3 times (configurable) on failure:

```javascript
// Attempt 1: immediate
// Attempt 2: after 1 second
// Attempt 3: after 2 seconds
// Give up after 3 failures
```

### Behavior on failure

```javascript
document.addEventListener('cookieConsentChanged', (event) => {
  console.log('Logging successful?', event.detail.logged);
  
  if (!event.detail.logged) {
    // Logging failed, but preferences are still saved locally
    console.warn('Consent saved locally only');
  }
});
```

**Important**: If logging fails, user preferences are **still saved** in localStorage. Only server recording is missing.

## Anonymization & GDPR

### Device ID

The `device_id` is generated **anonymously and randomly**:

```javascript
// Generation (once per browser)
const generateDeviceId = () => {
  return 'cc_' + crypto.randomUUID();
};
// Result: cc_7f3a9b2c-1d4e-5f6a-8b9c-0d1e2f3a4b5c
```

**Characteristics**:
- ✅ Random (no fingerprint)
- ✅ Non-reversible
- ✅ Contains no personal data
- ✅ Allows linking multiple events from the same device
- ❌ Does NOT allow identifying an individual

### Data NOT collected

- ❌ IP address (neither raw nor hashed)
- ❌ Full User-Agent
- ❌ Browser fingerprint
- ❌ Canvas fingerprinting
- ❌ Name, email, or any personal data

### Data collected

- ✅ Consent choices (accepted/rejected categories)
- ✅ Timestamp
- ✅ Banner version
- ✅ Language and timezone (for context)
- ✅ Page path (no sensitive query params)

## Dashboard & Analytics

### Access logs

Login at [https://synapx.fr/sdk/Cookie/Home](https://synapx.fr/sdk/Cookie/Home)

### Available statistics

- 📊 Overall acceptance rate
- 📊 Acceptance rate by category
- 📊 Evolution over time
- 📊 Geographic distribution (country/timezone)
- 📊 User languages

### Exports

Available formats:
- **CSV**: For analysis in Excel/Google Sheets
- **JSON**: For programmatic processing
- **PDF**: For compliance audits and reports

```bash
# CSV export example
Date,Consent ID,Action,Cookies,Statistics,Marketing
2025-01-15 14:30,550e8400...,accept,true,true,false
2025-01-15 14:35,661f9511...,reject,false,false,false
```

## Legal Compliance

### Retention period

**GDPR recommendation**: 13 months maximum

Our implementation:
- ✅ Automatic expiration after 13 months
- ✅ Can be reduced (e.g., 6 months)
- ✅ Automatic purge of expired logs

### User rights

#### Right of access
```
User: "Show me my logs"
→ CSV/JSON export of all their consents
```

#### Right to erasure
```
User: "Delete my logs"
→ Deletion of all logs linked to their device_id
```

#### Right to data portability
```
User: "Export my data"
→ Structured JSON export
```

### Proof of consent

In case of GDPR audit or litigation:

```json
{
  "consent_id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2025-01-15T14:30:00.000Z",
  "action": "accept",
  "preferences": {
    "cookies": true,
    "statistics": true,
    "marketing": false
  },
  "banner_version": "2.4.0",
  "proof_hash": "a7f2b9c1d4e5f6a8b9c0d1e2f3a4b5c6"
}
```

## Self-hosted mode

### Hosting your own API

If you don't want to use our API:

```javascript
window.CookieConsent.init({
  logger: {
    enabled: true,
    endpoint: 'https://your-api.com/consent/log',
    apiKey: 'your-internal-key',
    headers: {
      'X-Custom-Header': 'value'
    }
  }
});
```

### Example Node.js server

```javascript
// server.js
const express = require('express');
const app = express();

app.post('/consent/log', express.json(), (req, res) => {
  const {
    consent_id,
    device_id,
    consent_action,
    pref_cookies,
    pref_statistics,
    pref_marketing
  } = req.body;
  
  // Save to your database
  db.saveConsent(req.body);
  
  res.json({
    success: true,
    consent_id,
    logged_at: new Date().toISOString()
  });
});

app.listen(3000);
```

## Pricing

| Monthly volume | Price |
|----------------|-------|
| 0 - 300 | **FREE** 🎁 |
| 301 - 10K | $12 |
| 10K - 100K | $29 |
| 100K - 500K | $64 |
| 500K - 1.5M | $119 |
| +1.5M | $239 |

**Automatic billing** based on actual monthly volume.

## Disable logging

If you want to use the banner **without logging**:

```javascript
// Option 1: Don't configure logger
window.CookieConsent.init({
  statistics: {
    google_analytics_key: 'G-XXX'
  }
  // No "logger" section
});

// Option 2: Explicitly disable
window.CookieConsent.disableLogging();
```

**Impact**:
- ✅ Banner works normally
- ✅ Third-party script blocking active
- ❌ No server proof of consent
- ❌ Not compliant with GDPR Article 7.1 (unless you log otherwise)

## Support

Questions about logging?
- 📧 contact@synapxlab.com
- 📚 [FAQ](./faq.md)
- 🐛 [GitHub Issues](https://github.com/synapxLab/cookie-consent/issues)

---

**Logging System by SynapxLab**
**GDPR Compliant**
**Made in France - OVH Servers**