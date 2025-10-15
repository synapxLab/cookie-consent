# GDPR & Privacy Compliance

## Overview

SynapxLab's Cookie Consent is designed to be **compliant by default** with GDPR requirements and privacy regulations.

## Applicable Legal Framework

### 🇪🇺 GDPR (General Data Protection Regulation)

#### Article 4(11) - Definition of consent
> Consent should be given by a clear affirmative act establishing a freely given, specific, informed and unambiguous indication of the data subject's agreement.

**Our implementation:**
- ✅ **Freely given**: Refusal as simple as acceptance
- ✅ **Specific**: Separate categories (statistics, marketing, functional)
- ✅ **Informed**: Clear description of each purpose
- ✅ **Unambiguous**: Positive action required (no pre-ticked boxes)

#### Article 6(1)(a) - Legal basis
> Processing is lawful only if the data subject has consented to the processing.

**Our implementation:**
- ✅ No third-party scripts load before consent
- ✅ Automatic blocking of detected trackers
- ✅ Freeze of iframes and external scripts

#### Article 7 - Conditions for consent
> The controller shall be able to demonstrate that the data subject has consented to processing.

**Our implementation:**
- ✅ Timestamped logging of each consent
- ✅ Recording of policy version
- ✅ Traceability of modifications (accept, reject, customize)
- ✅ Anonymous ID to link events without identifying the user

### 🇪🇺 ePrivacy Directive (2002/58/EC)

#### Article 5(3) - Confidentiality of communications
> The use of electronic communications networks to store information or gain access to information stored in the terminal equipment of a subscriber or user is only allowed on condition that the subscriber or user concerned has given their consent.

**Our implementation:**
- ✅ Prior consent required
- ✅ Exception for strictly necessary cookies (authentication, cart)
- ✅ Blocking of all other trackers by default

## Applied Recommendations

### 📋 Best Practices

#### 1. Clear and complete information
**Requirement:**
> Users must be informed of the identity of data controllers, the purpose of trackers and their rights.

**Our solution:**
- ✅ Explicit categories: Functional, Statistics, Marketing
- ✅ Detailed description of each purpose
- ✅ Automatic list of configured services
- ✅ Detection and display of present trackers

#### 2. Refusal as simple as acceptance
**Requirement:**
> Refusing must be as simple as accepting.

**Our solution:**
- ✅ "Reject all" button at the same level as "Accept all"
- ✅ Same number of clicks to accept or refuse
- ✅ No dark patterns (manipulation)

#### 3. No tracker before consent
**Requirement:**
> No tracker should be placed or read before the user's positive action.

**Our solution:**
- ✅ **Automatic third-party script blocker**
- ✅ MutationObserver to block dynamic injections
- ✅ Freeze/Release of scripts according to consent
- ✅ Intelligent detection by domain and keywords

#### 4. Limited retention period
**Requirement:**
> Consent validity should not exceed 13 months.

**Our solution:**
- ✅ Default expiration: 6 months (stricter than required)
- ✅ Configurable: `expiration_months`
- ✅ Automatic verification on each load
- ✅ Automatic re-request after expiration

#### 5. Proof of consent
**Requirement:**
> The controller must be able to demonstrate that the user has consented.

**Our solution:**
- ✅ Logging with precise timestamp
- ✅ Banner version recorded
- ✅ Tracked action (accept/reject/customize)
- ✅ Anonymous device ID (no IP, no fingerprint)
- ✅ Possible exports (CSV, JSON)

## Compliance Architecture

### Consent Flow

```
1. Page load
   ├─ Check localStorage
   │  ├─ Valid consent? → Apply preferences
   │  └─ No consent or expired? → Display banner
   │
2. Page scan
   ├─ Detection of third-party scripts (src matching)
   ├─ Freeze unauthorized scripts (type="text/plain")
   └─ MutationObserver activated (SPA)
   │
3. User action
   ├─ Accept all → Log + Release all scripts
   ├─ Reject all → Log + Keep blocking
   └─ Customize → Log + Conditional release
   │
4. After consent
   ├─ Save localStorage (with expiresAt)
   ├─ Dispatch 'cookieConsentChanged' event
   └─ Services activated according to consented categories
```

### Recorded Data (logging)

```json
{
  "consent_id": "550e8400-e29b-41d4-a716-446655440000",
  "device_id": "cc_anonymous_xyz",
  "site_path": "/",
  "consent_action": "accept",
  "consent_method": "banner",
  "pref_cookies": true,
  "pref_statistics": true,
  "pref_marketing": false,
  "banner_version": "2.4.0",
  "locale": "en-US",
  "timezone": "America/New_York",
  "timestamp": "2025-01-15T14:30:00Z"
}
```

**Anonymization:**
- ❌ No IP address
- ❌ No browser fingerprint
- ❌ No personal data
- ✅ Randomly generated device ID
- ✅ Not reversible to an identity

## Penalties for Non-Compliance

### Possible GDPR Fines

- ⚠️ **Tier 1**: Up to **€10 million** or **2% of global revenue**
- 🔴 **Tier 2**: Up to **€20 million** or **4% of global revenue**

### Examples of Penalties

| Company | Year | Fine | Reason |
|---------|------|------|--------|
| Google/Amazon | 2020 | €100M | Cookies without consent |
| TikTok | 2024 | €5M | Lack of information |
| Meta | 2023 | €390M | Unlawful processing |

## User Rights

### Respected GDPR Rights

- ✅ **Right of access**: View their logged data
- ✅ **Right to rectification**: Modify their consent
- ✅ **Right to object**: Refuse all processing
- ✅ **Right to erasure**: "Delete my preferences" button
- ✅ **Right to data portability**: Export logs (CSV/JSON)

### Required Management Link

```html
<a href="#" id="openpolitecookie">Manage my cookies</a>
```

This link must be accessible from all pages (footer recommended).

## Compliance Checklist

### ✅ Before consent
- [ ] No third-party scripts loaded
- [ ] Banner displayed on first load
- [ ] Clear information about purposes
- [ ] No pre-ticked boxes
- [ ] "Reject all" button visible

### ✅ During consent
- [ ] Separate categories (functional, statistics, marketing)
- [ ] Description of each category
- [ ] Services listed automatically
- [ ] Explicit action required

### ✅ After consent
- [ ] Preferences saved (localStorage)
- [ ] Logging performed (if enabled)
- [ ] Authorized scripts loaded
- [ ] 'cookieConsentChanged' event dispatched
- [ ] Management link accessible
- [ ] Expiration scheduled (max 6 months)

### ✅ Ongoing management
- [ ] Ability to modify choice at any time
- [ ] Automatic re-request after expiration
- [ ] Logs viewable and exportable
- [ ] Accessible documentation

## Legal Responsibilities

### SynapxLab's Role

**As software publisher:**
- ✅ Provides a compliant-by-design tool
- ✅ Maintains compliance with legal changes
- ✅ Documents best practices
- ❌ Is NOT responsible for data processing

### User's Role (you)

**As data controller:**
- ✅ Configure the banner correctly
- ✅ Respect user consents
- ✅ Maintain a processing register
- ✅ Appoint a DPO if necessary
- ✅ Respond to rights exercise requests

## Best Practices

### ✅ TO DO

1. **Enable logging**
```javascript
window.CookieConsent.init({
  logger: {
    enabled: true,
    apiKey: 'your-key'
  }
});
```

2. **Don't load scripts before consent**
```html
<!-- ❌ WRONG -->
<script src="https://www.googletagmanager.com/gtag/js"></script>

<!-- ✅ CORRECT -->
<!-- Script will be automatically blocked by Cookie Consent -->
```

3. **Add visible management link**
```html
<footer>
  <a href="#" id="openpolitecookie">Manage my cookies</a>
</footer>
```

4. **Respect preferences in your custom code**
```javascript
document.addEventListener('cookieConsentChanged', (event) => {
  if (event.detail.preferences.statistics) {
    // Your custom analytics code
  }
});
```

### ❌ TO AVOID

1. **Cookie walls** (blocking site access)
2. **Pre-ticked boxes**
3. **More complex refusal than acceptance**
4. **Validity period > 13 months**
5. **Automatic consent renewal on each visit**

## Official Resources

### 📚 Legal texts
- [GDPR - Official text](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- [ePrivacy Directive](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32002L0058)

### 📋 Guidelines
- [ICO (UK) - Cookie guidance](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/guidance-on-the-use-of-cookies-and-similar-technologies/)
- [EDPB - Guidelines on consent](https://edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-052020-consent-under-regulation-2016679_en)

## Support & Advice

### Need help?

**Technical questions:**
- 📧 contact@synapxlab.com
- 🐛 [GitHub Issues](https://github.com/synapxLab/cookie-consent/issues)

**Legal questions:**
> ⚠️ SynapxLab is not a law firm. For personalized legal advice, consult:
> - Your DPO (Data Protection Officer)
> - A lawyer specialized in digital law
> - Your local data protection authority

## Conclusion

SynapxLab's Cookie Consent provides you with **all the technical tools** to be GDPR compliant. However, legal compliance is a **shared responsibility**:

- 🛠️ **SynapxLab**: Provides compliant technology
- ⚖️ **You**: Use the tool correctly and respect your legal obligations

**When in doubt, always consult a legal professional.**