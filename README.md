# 🍪 Cookie Consent RGPD

> **Alternative française gratuite à Cookiebot** • Économisez 600€/an

Bannière de consentement cookies **100% conforme RGPD/CNIL** en JavaScript pur, sans aucune dépendance.

[![npm version](https://badge.fury.io/js/%40synapxlab%2Fcookie-consent.svg)](https://www.npmjs.com/package/@synapxlab/cookie-consent)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/@synapxlab/cookie-consent.svg)](https://www.npmjs.com/package/@synapxlab/cookie-consent)

## 🚀 Démo en direct

**[Voir la démo → https://cookie.synapx.fr/](https://cookie.synapx.fr/)**

## ⚡ Installation rapide

```bash
npm install @synapxlab/cookie-consent
```

## 🎯 Pourquoi ce projet ?

- ✅ **100% gratuit et open-source**
- ✅ **Conformité RGPD/CNIL** complète
- ✅ **Zéro dépendance** - 15kb minifié
- ✅ **Compatible tous frameworks** (React, Vue, Angular, Vanilla JS)
- ✅ **Documentation française** 🇫🇷
- ✅ **Alternative économique** à Cookiebot (-600€/an)

## 📖 Documentation

### Installation via CDN

```html
<script src="https://unpkg.com/@synapxlab/cookie-consent@latest/dist/cookie.js"></script>
```

### Installation via npm

```bash
npm install @synapxlab/cookie-consent
```

```javascript
import '@synapxlab/cookie-consent';

// API disponible globalement
window.CookieConsent.open();
window.CookieConsent.reset();
```

### Utilisation simple

```javascript
// Ouvrir la bannière avec préférences
window.CookieConsent.open(true);

// Réinitialiser les préférences
window.CookieConsent.reset();

// Récupérer les préférences actuelles
const prefs = window.CookieConsent.getPreferences();
console.log(prefs); // { cookies: true, statistics: false, marketing: true }

// Vérifier une catégorie spécifique
if (window.CookieConsent.hasConsent('statistics')) {
  // Charger Google Analytics
  console.log('Statistiques autorisées');
}
```

### Écouter les changements de consentement

```javascript
document.addEventListener('cookieConsentChanged', (event) => {
  const preferences = event.detail.preferences;
  
  if (preferences.statistics) {
    // Charger Google Analytics
    loadGoogleAnalytics();
  }
  
  if (preferences.marketing) {
    // Charger pixels marketing
    loadMarketingScripts();
  }
  
  if (preferences.cookies) {
    // Activer cookies fonctionnels
    enableFunctionalCookies();
  }
});
```

## 🛠️ Frameworks supportés

### React
```jsx
import { useEffect } from 'react';
import '@synapxlab/cookie-consent';

function App() {
  useEffect(() => {
    // Vérifier les préférences au chargement
    const prefs = window.CookieConsent?.getPreferences();
    if (prefs) {
      handleConsentPreferences(prefs);
    }
    
    // Écouter les changements
    const handleConsentChange = (event) => {
      handleConsentPreferences(event.detail.preferences);
    };
    
    document.addEventListener('cookieConsentChanged', handleConsentChange);
    
    return () => {
      document.removeEventListener('cookieConsentChanged', handleConsentChange);
    };
  }, []);
  
  const handleConsentPreferences = (prefs) => {
    if (prefs.statistics) {
      // Charger Google Analytics
    }
  };
  
  return (
    <div>
      <button onClick={() => window.CookieConsent?.open(true)}>
        Gérer les cookies
      </button>
    </div>
  );
}
```

### Vue.js
```vue
<template>
  <div>
    <button @click="openCookieSettings">Gérer les cookies</button>
  </div>
</template>

<script>
import '@synapxlab/cookie-consent';

export default {
  mounted() {
    // Écouter les changements de consentement
    document.addEventListener('cookieConsentChanged', this.handleConsentChange);
  },
  
  beforeDestroy() {
    document.removeEventListener('cookieConsentChanged', this.handleConsentChange);
  },
  
  methods: {
    openCookieSettings() {
      window.CookieConsent?.open(true);
    },
    
    handleConsentChange(event) {
      const preferences = event.detail.preferences;
      // Gérer les préférences
    }
  }
}
</script>
```

### WordPress
```php
// functions.php
function enqueue_cookie_consent() {
    wp_enqueue_script(
        'cookie-consent',
        'https://unpkg.com/@synapxlab/cookie-consent@latest/dist/cookie.js',
        array(),
        '2.1.0',
        true
    );
    
    // Ajouter un lien pour ouvrir les préférences
    wp_add_inline_script('cookie-consent', '
        document.addEventListener("DOMContentLoaded", function() {
            // Bouton pour gérer les cookies
            const cookieLink = document.querySelector("#manage-cookies");
            if (cookieLink) {
                cookieLink.addEventListener("click", function(e) {
                    e.preventDefault();
                    window.CookieConsent.open(true);
                });
            }
        });
    ');
}
add_action('wp_enqueue_scripts', 'enqueue_cookie_consent');
```

## 🎨 Personnalisation

### Thèmes CSS disponibles
```javascript
// Dans votre CSS/SCSS, appliquer un thème au body
document.body.classList.add('cookie-theme-dark');    // Thème sombre
document.body.classList.add('cookie-theme-blue');    // Thème bleu
document.body.classList.add('cookie-theme-brown');   // Thème marron
document.body.classList.add('cookie-theme-default'); // Thème par défaut
```

### Personnalisation complète via CSS
```css
/* Personnaliser la bannière */
#politecookiebanner {
  font-family: 'Roboto', sans-serif;
  border-radius: 12px;
}

/* Personnaliser les boutons */
.pmcpli-btn {
  border-radius: 6px;
  font-weight: 600;
}

.pmcpli-accept {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
}
```

## 📋 API et méthodes

```javascript
// API globale disponible sur window.CookieConsent
const api = window.CookieConsent;

// Ouvrir la bannière (avec ou sans préférences)
api.open();           // Simple
api.open(true);       // Avec préférences ouvertes

// Réinitialiser (supprime le localStorage et rouvre)
api.reset();

// Récupérer les préférences actuelles
const prefs = api.getPreferences();
// Retourne: { cookies: boolean, statistics: boolean, marketing: boolean } ou null

// Vérifier une catégorie spécifique
const hasAnalytics = api.hasConsent('statistics');
const hasCookies = api.hasConsent('cookies');
const hasMarketing = api.hasConsent('marketing');
```

## 🔧 Développement

```bash
# Cloner le projet
git clone https://github.com/synapxLab/cookie-consent.git

# Installer les dépendances
npm install

# Serveur de développement
npm run dev

# Build de production
npm run build
```

## 📄 Licence

MIT © [synapxLab](https://github.com/synapxLab)

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez notre [guide de contribution](CONTRIBUTING.md).

## 📞 Support

- **Documentation complète** : [https://cookie.synapx.fr/](https://cookie.synapx.fr/)
- **Issues GitHub** : [https://github.com/synapxLab/cookie-consent/issues](https://github.com/synapxLab/cookie-consent/issues)
- **Email** : contact@synapxlab.com

## ⭐ Remerciements

Si ce projet vous aide, n'hésitez pas à lui donner une étoile sur GitHub ! ⭐

---

**Fait avec ❤️ en France 🇫🇷**