# Intégration Vanilla JavaScript

## Installation

### Via CDN (le plus simple)

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Mon Site</title>
</head>
<body>
  <!-- Votre contenu -->
  
  <!-- Cookie Consent - À placer avant la fermeture du body -->
  <script src="https://unpkg.com/@synapxlab/cookie-consent/dist/cookie.js"></script>
  
  <!-- Configuration (optionnelle) -->
  <script>
    window.CookieConsent.init({
      statistics: {
        google_analytics_key: 'G-XXXXXXXXX'
      }
    });
  </script>
</body>
</html>
```

### Téléchargement local

1. **Télécharger le fichier**
```bash
# Via npm
npm install @synapxlab/cookie-consent

# Ou téléchargement direct
wget https://unpkg.com/@synapxlab/cookie-consent/dist/cookie.js
```

2. **Inclure dans votre HTML**
```html
<script src="/assets/js/cookie.js"></script>
```

## Configuration basique

### Sans configuration (par défaut)

```html
<script src="https://unpkg.com/@synapxlab/cookie-consent/dist/cookie.js"></script>
<!-- La bannière s'affiche automatiquement -->
```

### Avec Google Analytics

```html
<script src="https://unpkg.com/@synapxlab/cookie-consent/dist/cookie.js"></script>
<script>
  window.CookieConsent.init({
    statistics: {
      google_analytics_key: 'G-WKEJV2N43X'
    }
  });
</script>
```

### Avec plusieurs services

```html
<script src="https://unpkg.com/@synapxlab/cookie-consent/dist/cookie.js"></script>
<script>
  window.CookieConsent.init({
    // Logging RGPD
    logger: {
      enabled: true,
      endpoint: 'https://api.synapx.fr/',
      apiKey: 'sk-live-xxxxx'
    },
    
    // Services statistiques
    statistics: {
      google_analytics_key: 'G-XXXXXXXXX',
      hotjar_site_id: '1234567'
    },
    
    // Services marketing
    marketing: {
      facebook_pixel: {
        key: 'YOUR-PIXEL-ID',
        track: 'PageView'
      },
      google_adsense_key: 'ca-pub-XXXXXXX'
    },
    
    // Services fonctionnels
    functional: {
      crisp_website_id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
    }
  });
</script>
```

## Lien de gestion des cookies

Ajoutez ce code dans votre footer :

```html
<footer>
  <nav>
    <ul>
      <li><a href="/mentions-legales">Mentions légales</a></li>
      <li><a href="/politique-confidentialite">Politique de confidentialité</a></li>
      <li><a href="#" id="openpolitecookie">Gérer mes cookies</a></li>
    </ul>
  </nav>
</footer>
```

Le clic sur `#openpolitecookie` ouvrira automatiquement le panneau de préférences.

## Interactions programmatiques

### Ouvrir la bannière manuellement

```javascript
// Bouton personnalisé
document.getElementById('mon-bouton').addEventListener('click', function() {
  window.CookieConsent.open(true); // true = affiche directement les préférences
});
```

### Écouter les changements de consentement

```javascript
document.addEventListener('cookieConsentChanged', function(event) {
  console.log('Nouvelles préférences:', event.detail.preferences);
  console.log('Loggé sur serveur:', event.detail.logged);
  
  // Charger vos scripts personnalisés
  if (event.detail.preferences.statistics) {
    loadMyCustomAnalytics();
  }
  
  if (event.detail.preferences.marketing) {
    loadMyCustomAds();
  }
});

function loadMyCustomAnalytics() {
  // Votre code analytics personnalisé
  console.log('Analytics activé');
}

function loadMyCustomAds() {
  // Votre code publicitaire personnalisé
  console.log('Publicité activée');
}
```

### Vérifier le consentement avant chargement

```javascript
// Attendre que Cookie Consent soit prêt
document.addEventListener('DOMContentLoaded', function() {
  
  // Vérifier si les statistiques sont acceptées
  if (window.CookieConsent.hasConsent('statistics')) {
    loadGoogleAnalytics();
  }
  
  // Vérifier si le marketing est accepté
  if (window.CookieConsent.hasConsent('marketing')) {
    loadFacebookPixel();
  }
  
});

function loadGoogleAnalytics() {
  // Charger GA manuellement si besoin
  console.log('GA autorisé');
}

function loadFacebookPixel() {
  // Charger FB Pixel manuellement si besoin
  console.log('FB Pixel autorisé');
}
```

### Réinitialiser le consentement

```javascript
// Bouton "Réinitialiser mes préférences"
document.getElementById('reset-cookies').addEventListener('click', function() {
  window.CookieConsent.reset(); // Efface et rouvre la bannière
});
```

## Blocage automatique des scripts tiers

### Scripts externes bloqués automatiquement

Cookie Consent **bloque automatiquement** tous les scripts tiers détectés :

```html
<!-- Ces scripts seront automatiquement bloqués si pas de consentement -->
<script src="https://www.googletagmanager.com/gtag/js?id=G-XXX"></script>
<script src="https://connect.facebook.net/en_US/fbevents.js"></script>
<script src="https://static.hotjar.com/c/hotjar-123456.js"></script>

<!-- Pas besoin de les taguer manuellement ! -->
```

### Comment ça marche ?

1. **Scan au chargement** : Détecte tous les `<script src>` et `<iframe src>`
2. **Détection intelligente** : Compare avec une liste de domaines tiers connus
3. **Freeze** : Transforme en `<script type="text/plain">` (bloqué)
4. **Release** : Réactive uniquement après consentement

### Scripts inline

Pour les scripts inline (code directement dans le HTML), utilisez l'événement :

```html
<script>
  // ❌ FAUX : Ce code s'exécute immédiatement
  if (window.fbq) {
    fbq('track', 'PageView');
  }
</script>

<script>
  // ✅ CORRECT : Attend le consentement
  document.addEventListener('cookieConsentChanged', function(event) {
    if (event.detail.preferences.marketing && window.fbq) {
      fbq('track', 'PageView');
    }
  });
</script>
```

## Personnalisation CSS

### Variables CSS

```html
<style>
  :root {
    /* Couleurs principales */
    --cc-bg: #ffffff;           /* Fond de la bannière */
    --cc-text: #111827;         /* Texte principal */
    --cc-accent: #3b82f6;       /* Boutons et accents */
    --cc-border: #e5e7eb;       /* Bordures */
    
    /* Couleurs secondaires */
    --cc-muted: #6b7280;        /* Texte secondaire */
    --cc-line: #e5e7eb;         /* Lignes de séparation */
    --cc-surface: #f9fafb;      /* Surface secondaire */
  }
</style>

<script src="https://unpkg.com/@synapxlab/cookie-consent/dist/cookie.js"></script>
```

### Thème sombre

```html
<style>
  :root {
    --cc-bg: #1f2937;
    --cc-text: #f9fafb;
    --cc-accent: #3b82f6;
    --cc-border: #374151;
    --cc-muted: #9ca3af;
    --cc-line: #4b5563;
    --cc-surface: #111827;
  }
</style>
```

## Multilingue

### Détection automatique

La langue est détectée automatiquement via `navigator.language`.

Langues supportées : **FR, EN, ES, DE, IT, NL, PT**

### Forcer une langue

```html
<script src="https://unpkg.com/@synapxlab/cookie-consent/dist/cookie.js"></script>
<script>
  // Import du module de traduction (si build custom)
  import t from '@synapxlab/cookie-consent/translat';
  
  // Forcer l'anglais
  t.setLocale('en');
</script>
```

### Ajouter une langue personnalisée

```javascript
import t from '@synapxlab/cookie-consent/translat';

t.add('ja', {
  title: "クッキー同意",
  message: "最高のエクスペリエンスを提供するため...",
  acceptAll: "すべて受け入れる",
  denyAll: "すべて拒否",
  viewPrefs: "設定を管理",
  savePrefs: "設定を保存",
  // ... autres traductions
});

t.setLocale('ja');
```

## Débogage

### Mode debug

```javascript
// Activer les logs console
window.CookieConsent.init({
  debug: true, // Active les logs détaillés
  statistics: {
    google_analytics_key: 'G-XXX'
  }
});
```

### Vérifier le stockage

```javascript
// Dans la console du navigateur
console.log(localStorage.getItem('politecookiebanner'));

// Résultat :
// {
//   "data": {"cookies": true, "statistics": false, "marketing": true},
//   "timestamp": 1704067200000,
//   "expiresAt": 1719619200000
// }
```

### Forcer l'affichage de la bannière

```javascript
// Effacer les préférences
localStorage.removeItem('politecookiebanner');

// Recharger la page
location.reload();
```

## Exemples complets

### Site vitrine simple

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Mon Site Vitrine</title>
</head>
<body>
  <header>
    <h1>Bienvenue</h1>
  </header>
  
  <main>
    <p>Contenu de la page...</p>
  </main>
  
  <footer>
    <a href="#" id="openpolitecookie">Gérer mes cookies</a>
  </footer>
  
  <!-- Cookie Consent -->
  <script src="https://unpkg.com/@synapxlab/cookie-consent/dist/cookie.js"></script>
  <script>
    window.CookieConsent.init({
      statistics: {
        google_analytics_key: 'G-XXXXXXXXX'
      }
    });
  </script>
</body>
</html>
```

### Site e-commerce avec tracking avancé

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Ma Boutique</title>
</head>
<body>
  <header>
    <h1>Ma Boutique en ligne</h1>
  </header>
  
  <main>
    <div id="products">
      <!-- Produits -->
    </div>
  </main>
  
  <footer>
    <a href="#" id="openpolitecookie">Gérer mes cookies</a>
  </footer>
  
  <!-- Cookie Consent -->
  <script src="https://unpkg.com/@synapxlab/cookie-consent/dist/cookie.js"></script>
  <script>
    window.CookieConsent.init({
      logger: {
        enabled: true,
        endpoint: 'https://api.synapx.fr/',
        apiKey: 'sk-live-xxxxx'
      },
      statistics: {
        google_analytics_key: 'G-XXXXXXXXX',
        hotjar_site_id: '1234567'
      },
      marketing: {
        facebook_pixel: {
          key: 'YOUR-PIXEL-ID',
          track: 'PageView'
        },
        google_adsense_key: 'ca-pub-XXXXXXX'
      },
      functional: {
        crisp_website_id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
      }
    });
    
    // Écouter les changements
    document.addEventListener('cookieConsentChanged', function(event) {
      if (event.detail.preferences.marketing) {
        // Activer remarketing dynamique
        loadDynamicRemarketing();
      }
    });
  </script>
</body>
</html>
```

## Compatibilité

- ✅ Chrome/Edge (dernières versions)
- ✅ Firefox (dernières versions)
- ✅ Safari (dernières versions)
- ✅ Mobile (iOS/Android)
- ⚠️ IE11 (nécessite polyfills)

## Résolution de problèmes

### La bannière ne s'affiche pas

**Vérifications :**
1. Le script est bien chargé ?
```javascript
console.log(window.CookieConsent); // Doit afficher un objet
```

2. Pas d'erreur JS dans la console ?
3. Le localStorage n'a pas déjà un consentement ?
```javascript
localStorage.removeItem('politecookiebanner');
location.reload();
```

### Les scripts tiers ne se chargent pas

**Vérifications :**
1. Consentement donné ?
```javascript
console.log(window.CookieConsent.getPreferences());
```

2. Configuration correcte ?
```javascript
console.log(window.CookieConsent.getConfig());
```

3. Script bien détecté ?
- Ouvrir l'inspecteur réseau
- Recharger la page après consentement
- Vérifier que les scripts tiers se chargent

### Le logging échoue

**Vérifications :**
1. Clé API correcte ?
2. Endpoint accessible ?
3. CORS configuré ?
4. Voir les logs console

## Support

- 📧 contact@synapx.fr
- 🐛 [GitHub Issues](https://github.com/synapxLab/cookie-consent/issues)
- 📚 [Documentation complète](../configuration.md)