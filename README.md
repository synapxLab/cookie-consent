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
import CookieConsent from '@synapxlab/cookie-consent';

// Initialisation
const cookieConsent = new CookieConsent({
  // Configuration...
});
```

### Configuration de base

```javascript
const cookieConsent = new CookieConsent({
  // Textes personnalisables
  title: "Gestion des cookies",
  message: "Ce site utilise des cookies pour améliorer votre expérience.",
  acceptText: "Tout accepter",
  rejectText: "Tout refuser",
  settingsText: "Personnaliser",
  
  // Styles personnalisables
  theme: "light", // "light" ou "dark"
  position: "bottom", // "top" ou "bottom"
  
  // Catégories de cookies
  categories: {
    necessary: {
      name: "Cookies nécessaires",
      description: "Indispensables au fonctionnement du site",
      required: true
    },
    analytics: {
      name: "Cookies analytiques", 
      description: "Nous aident à comprendre l'utilisation du site",
      required: false
    },
    marketing: {
      name: "Cookies marketing",
      description: "Utilisés pour la publicité personnalisée",
      required: false
    }
  }
});
```

## 🛠️ Frameworks supportés

### React
```jsx
import { useEffect } from 'react';
import CookieConsent from '@synapxlab/cookie-consent';

function App() {
  useEffect(() => {
    new CookieConsent({
      // Configuration...
    });
  }, []);
  
  return <div>Mon app React</div>;
}
```

### Vue.js
```vue
<template>
  <div>Mon app Vue</div>
</template>

<script>
import CookieConsent from '@synapxlab/cookie-consent';

export default {
  mounted() {
    new CookieConsent({
      // Configuration...
    });
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
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'enqueue_cookie_consent');
```

## 🎨 Personnalisation

### Thèmes disponibles
- `light` - Thème clair (défaut)
- `dark` - Thème sombre
- `custom` - Entièrement personnalisable via CSS

### CSS personnalisé
```css
.cookie-consent-banner {
  /* Vos styles personnalisés */
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
}

.cookie-consent-button {
  /* Personnaliser les boutons */
  border-radius: 25px;
}
```

## 📋 API et méthodes

```javascript
const cookieConsent = new CookieConsent(options);

// Vérifier le consentement
if (cookieConsent.hasConsent('analytics')) {
  // Charger Google Analytics
}

// Écouter les changements
cookieConsent.on('consent-given', (categories) => {
  console.log('Consentement donné pour:', categories);
});

// Afficher à nouveau la bannière
cookieConsent.show();

// Révoquer le consentement
cookieConsent.revoke();
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
- **Email** : synapxLab@lockness-informatique.fr

## ⭐ Remerciements

Si ce projet vous aide, n'hésitez pas à lui donner une étoile sur GitHub ! ⭐

---

**Fait avec ❤️ en France 🇫🇷**
