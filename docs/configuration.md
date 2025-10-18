# Configuration complète

## API d'initialisation

```javascript
window.CookieConsent.init(options);
```

## Options disponibles

### Logger (journalisation des consentements)

```javascript
{
  logger: {
    enabled: true,                      // Activer le logging
    apiKey: 'sk-live-xxxxx',           // Clé API
    retries: 3,                        // Nombre de tentatives
    timeout: 5000,                     // Timeout en ms
    anonymousId: true,                 // ID anonyme
    headers: {                         // Headers personnalisés
      'Authorization': 'Bearer token'
    }
  }
}
```

### Statistics (services d'analyse)

```javascript
{
  statistics: {
    // Google Analytics 4
    google_analytics_key: 'G-XXXXXXXXX',
    
    // Google Tag Manager
    google_tag_manager_key: 'GTM-XXXXXXX',
    
    // Matomo
    matomo: {
      url: 'https://analytics.votresite.com/',
      siteId: '1'
    },
    
    // Mixpanel
    mixpanel_token: 'abc123def456',
    
    // Amplitude
    amplitude_key: 'abc123',
    
    // Plausible Analytics
    plausible: {
      domain: 'votresite.fr'
    },
    
    // Hotjar
    hotjar_site_id: '1234567',
    
    // Microsoft Clarity
    clarity_project_id: 'abc123'
  }
}
```

### Marketing (publicité et remarketing)

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

### Functional (chat et CRM)

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

### Storage (gestion de l'expiration)

```javascript
{
  storage: {
    expiration_months: 6,  // Durée de validité (CNIL recommande 6 mois max)
    auto_renew: false      // Ne pas renouveler automatiquement
  }
}
```

## Exemple complet

```javascript
window.CookieConsent.init({
  // Logging RGPD
  logger: {
    enabled: true,
    apiKey: 'sk-live-xxxxx',
    anonymousId: true
  },
  
  // Services statistiques
  statistics: {
    google_analytics_key: 'G-WKEJV2N43X',
    matomo: {
      url: 'https://analytics.monsite.fr/',
      siteId: '1'
    },
    hotjar_site_id: '1234567'
  },
  
  // Services marketing
  marketing: {
    google_adsense_key: 'ca-pub-XXXXXXX',
    facebook_pixel: {
      key: 'YOUR-PIXEL-ID',
      track: 'PageView'
    }
  },
  
  // Services fonctionnels
  functional: {
    crisp_website_id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
  },
  
  // Paramètres de stockage
  storage: {
    expiration_months: 6,
    auto_renew: false
  }
});
```

## Méthodes disponibles

### Ouvrir la bannière

```javascript
// Ouvrir avec vue simple
window.CookieConsent.open();

// Ouvrir avec panneau de préférences
window.CookieConsent.open(true);
```

### Réinitialiser les préférences

```javascript
// Efface les préférences et rouvre la bannière
window.CookieConsent.reset();
```

### Récupérer les préférences

```javascript
const preferences = window.CookieConsent.getPreferences();
// Retourne : { cookies: true, statistics: false, marketing: true }
```

### Vérifier un consentement

```javascript
const hasStats = window.CookieConsent.hasConsent('statistics');
// Retourne : true ou false
```

### Désactiver le logging

```javascript
window.CookieConsent.disableLogging();
```

### Récupérer la configuration

```javascript
const config = window.CookieConsent.getConfig();
```

## Événements personnalisés

### Écouter les changements de consentement

```javascript
document.addEventListener('cookieConsentChanged', (event) => {
  console.log('Préférences:', event.detail.preferences);
  console.log('Loggé:', event.detail.logged);
  
  // Charger vos scripts personnalisés
  if (event.detail.preferences.statistics) {
    // Charger votre analytics custom
  }
});
```

## Lien de gestion des cookies

Ajoutez ce code dans votre footer :

```html
<a href="#" id="openpolitecookie">Gérer mes cookies</a>
```

Le clic ouvrira automatiquement le panneau de préférences.

## Personnalisation CSS

### Variables CSS disponibles

```css
:root {
  --cc-bg: #fff;           /* Fond de la bannière */
  --cc-border: #e5e7eb;    /* Couleur des bordures */
  --cc-accent: #9b6b5a;    /* Couleur d'accent (boutons, switches) */
  --cc-text: #111827;      /* Couleur du texte principal */
  --cc-muted: #6b7280;     /* Couleur du texte secondaire */
  --cc-line: #e5e7eb;      /* Couleur des lignes de séparation */
  --cc-surface: #f3f4f6;   /* Couleur de surface */
}
```

### Exemple de thème personnalisé

```css
/* Thème sombre */
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

## Stockage

Les préférences sont stockées dans `localStorage` sous la clé `politecookiebanner`.

Structure :
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

## Notes importantes

- ⚠️ **Ne chargez jamais** de scripts tiers avant le consentement
- ⚠️ Le module bloque automatiquement les scripts détectés
- ⚠️ Le consentement expire après 6 mois par défaut (conforme CNIL)
- ✅ Les cookies fonctionnels (strictement nécessaires) sont toujours actifs