# 🍪 Cookie Consent RGPD

Bannière de consentement cookies **100% conforme RGPD/CNIL** en JavaScript pur, sans aucune dépendance.

[![npm version](https://badge.fury.io/js/@synapxlab%2Fcookie-consent.svg)](https://www.npmjs.com/package/@synapxlab/cookie-consent)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dm/@synapxlab/cookie-consent.svg)](https://www.npmjs.com/package/@synapxlab/cookie-consent)
[![GitHub stars](https://img.shields.io/github/stars/synapxlab/cookie-consent.svg)](https://github.com/synapxlab/cookie-consent/stargazers)

## 🚀 Démo en direct

**[Voir la démo → https://synapx.fr/sdk/cookie/](https://synapx.fr/sdk/cookie/)**

## ⚡ Installation rapide

```bash
npm install @synapxlab/cookie-consent
```

```javascript
import '@synapxlab/cookie-consent';

// C'est tout presque ! La bannière s'affiche automatiquement
```
## ⚡ Dans le footer de votre HTML  le lien manuel
```html
<a href="#" id="openpolitecookie">[Politique en matière de cookies]</a>
```
## ⚡ Exemple : activer Google Analytics (stats)
Chargement uniquement si l’utilisateur accepte les statistiques :
```javascript
const startcall=(prefs)=>{
  console.log('Préférences reçues:', prefs);
  const w = window, d = document, GTAG_ID = 'G-VOTRE-ID';
  if (prefs.statistics && !w.__gtagLoaded) {
    // évite double-injection si déjà présent
    if (!d.querySelector(`script[src*="gtag/js?id=${GTAG_ID}"]`)) {
      const s = d.createElement('script');
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`;
      d.head.appendChild(s);
    }
    w.dataLayer = w.dataLayer || [];
    w.gtag = w.gtag || function(){ w.dataLayer.push(arguments); };
    w.gtag('js', new Date());
    w.gtag('config', GTAG_ID, { anonymize_ip: true, cookie_flags: 'SameSite=None;Secure' });
    w.__gtagLoaded = true;
  }
  // if (prefs?.marketing) 
}
document.addEventListener('DOMContentLoaded', () => {
  const cc = window.CookieConsent;
  const prefs = cc?.getPreferences?.();
  if (prefs) startcall(prefs);
  document.addEventListener('cookieConsentChanged', (e) => {
    // on relance avec les nouvelles préférences
    startcall(e.detail?.preferences || {});
  });
});
```

## 🎯 Pourquoi ce projet ?

- ✅ **100% gratuit et open-source** - Économisez 50-100€/mois
- ✅ **Conformité RGPD/CNIL** complète - Consentement préalable, granularité, révocabilité
- ✅ **Zéro dépendance** - Aucune librairie externe requise
- ✅ **Compatible tous frameworks** - React, Vue, Angular, Vanilla JS
- ✅ **Documentation française** 🇫🇷 - Support communautaire francophone
- ✅ **Ultra léger (< 25KB)** - Impact minimal sur les performances
- ✅ **Google Consent Mode v2** - Compatible avec les dernières exigences Google

## 🆚 Comparaison avec les alternatives

| Fonctionnalité | Notre solution | Cookiebot | OneTrust | js-cookie |
|---------------|----------------|-----------|----------|-----------|
| **Prix** | **Gratuit** | 50€/mois | 100€/mois | Gratuit |
| **Interface RGPD** | ✅ | ✅ | ✅ | ❌ |
| **Dépendances** | **0** | Multiples | Multiples | 0 |
| **Taille bundle** | 25KB | 45KB+ | 60KB+ | **1KB** |
| **Documentation FR** | ✅ | ❌ | ❌ | ❌ |
| **Open Source** | ✅ | ❌ | ❌ | ✅ |
| **Support communautaire** | ✅ | Premium | Premium | ✅ |

## 📖 Installation et utilisation

### Option 1 : Via CDN (le plus simple)

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Mon site</title>
</head>
<body>
    <!-- Votre contenu -->
    <a href="#" id="openpolitecookie">[Politique en matière de cookies]</a>
    <!-- Cookie Consent - Une seule ligne ! -->
    <script src="https://unpkg.com/@synapxlab/cookie-consent@latest/dist/bundle.js"></script>
</body>
</html>
```

### Option 2 : Via npm

```bash
npm install @synapxlab/cookie-consent
```

```javascript
// Importer directement le bundle complet
import '@synapxlab/cookie-consent/dist/bundle.js';

// La bannière s'affiche automatiquement si aucun consentement n'existe
// API disponible globalement sur window.CookieConsent
```

### Option 3 : Webpack/Vite

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  // Votre config...
};

// src/index.js
import '@synapxlab/cookie-consent/dist/bundle.js';

// Ou si vous voulez seulement le module cookie sans les styles
// import '@synapxlab/cookie-consent/dist/cookie.js';
```

## 🔧 API et méthodes

```javascript
// API complète disponible sur window.CookieConsent
const api = window.CookieConsent;

// 📱 Afficher la bannière avec préférences
api.show();

// 🙈 Masquer la bannière
api.hide();

// 🔄 Réinitialiser complètement (supprime localStorage et recharge la page)
api.reset();

// 📊 Récupérer les préférences actuelles
const prefs = api.getPreferences();
console.log(prefs);
// Retourne: { cookies: true, statistics: false, marketing: true } ou null

// ✅ Vérifier une catégorie spécifique
const hasAnalytics = api.hasConsent('statistics');
const hasMarketing = api.hasConsent('marketing');
const hasFunctional = api.hasConsent('cookies');

// 👂 Écouter les changements de consentement
api.on('change', (event) => {
    console.log('Nouvelles préférences:', event.detail.preferences);
});
```

## 🎬 Gestion des scripts tiers

### Chargement conditionnel de Google Analytics

```javascript
document.addEventListener('cookieConsentChanged', (event) => {
    const preferences = event.detail.preferences;
    
    if (preferences.statistics) {
        // ✅ Utilisateur a accepté les cookies statistiques
        loadGoogleAnalytics();
    }
    
    if (preferences.marketing) {
        // ✅ Utilisateur a accepté les cookies marketing
        loadFacebookPixel();
        loadGoogleAds();
    }
});

function loadGoogleAnalytics() {
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-VOTRE-ID';
    script.async = true;
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-VOTRE-ID', {
        anonymize_ip: true, // Conformité RGPD
        cookie_flags: 'SameSite=None;Secure'
    });
}

function loadFacebookPixel() {
    !function(f,b,e,v,n,t,s) {
        if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)
    }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    
    fbq('init', 'VOTRE-PIXEL-ID');
    fbq('track', 'PageView');
}
```

### Vérification au chargement de page

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const prefs = window.CookieConsent?.getPreferences();
    
    if (prefs?.statistics) {
        loadGoogleAnalytics();
    }
    
    if (prefs?.marketing) {
        loadFacebookPixel();
    }
});
```

## 🛠️ Intégrations frameworks

### React

```jsx
import React, { useEffect } from 'react';

// Charger le bundle cookie consent
import '@synapxlab/cookie-consent/dist/bundle.js';

function App() {
    useEffect(() => {
        // Vérifier les préférences existantes au montage
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
            console.log('Chargement Analytics...');
        }
        if (prefs.marketing) {
            // Charger pixels marketing
            console.log('Chargement marketing...');
        }
    };
    
    return (
        <div>
            <h1>Mon App React</h1>
            <button onClick={() => window.CookieConsent?.show()}>
                Gérer les cookies
            </button>
        </div>
    );
}

export default App;
```

### Vue.js 3

```vue
<template>
    <div>
        <h1>Mon App Vue</h1>
        <button @click="openCookieSettings">
            Gérer les cookies
        </button>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

// Charger le bundle cookie consent
import '@synapxlab/cookie-consent/dist/bundle.js';

let consentChangeHandler;

onMounted(() => {
    // Vérifier les préférences existantes
    const prefs = window.CookieConsent?.getPreferences();
    if (prefs) {
        handleConsentChange({ detail: { preferences: prefs } });
    }
    
    // Écouter les changements
    consentChangeHandler = (event) => {
        handleConsentChange(event);
    };
    document.addEventListener('cookieConsentChanged', consentChangeHandler);
});

onUnmounted(() => {
    if (consentChangeHandler) {
        document.removeEventListener('cookieConsentChanged', consentChangeHandler);
    }
});

const openCookieSettings = () => {
    window.CookieConsent?.show();
};

const handleConsentChange = (event) => {
    const preferences = event.detail.preferences;
    console.log('Préférences mises à jour:', preferences);
};
</script>
```


### Next.js

```javascript
// pages/_app.js
import { useEffect } from 'react';

// Charger le bundle complet
import '@synapxlab/cookie-consent/dist/bundle.js';

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        // Gestion des cookies côté client uniquement
        if (typeof window !== 'undefined') {
            const handleConsent = (event) => {
                const prefs = event.detail.preferences;
                
                // Router les events vers votre analytics
                if (prefs.statistics) {
                    // gtag ou autre
                }
            };
            
            document.addEventListener('cookieConsentChanged', handleConsent);
            
            return () => {
                document.removeEventListener('cookieConsentChanged', handleConsent);
            };
        }
    }, []);
    
    return <Component {...pageProps} />;
}

export default MyApp;
```

## 🎨 Personnalisation

### Thèmes disponibles

```javascript
// Appliquer un thème au body de la page
document.body.classList.add('cookie-theme-dark');    // Sombre
document.body.classList.add('cookie-theme-blue');    // Bleu
document.body.classList.add('cookie-theme-brown');   // Marron
document.body.classList.add('cookie-theme-default'); // Défaut (clair)
```

### CSS personnalisé

```css
/* Personnaliser entièrement l'apparence */
#politecookiebanner {
    font-family: 'Inter', -apple-system, sans-serif;
    border-radius: 16px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(16px);
    max-width: 480px;
}

/* Personnaliser les boutons */
.pmcpli-button-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 8px;
    font-weight: 600;
    transition: transform 0.2s ease;
}

.pmcpli-button-primary:hover {
    transform: translateY(-2px);
}

/* Personnaliser les toggles */
.pmcpli-toggle-slider {
    background: #e5e7eb;
    border-radius: 20px;
    transition: all 0.3s ease;
}

.pmcpli-toggle input:checked + .pmcpli-toggle-slider {
    background: linear-gradient(135deg, #10b981, #059669);
}
```

### Variables CSS

```css
:root {
    /* Couleurs principales */
    --cookie-primary-color: #3b82f6;
    --cookie-secondary-color: #6b7280;
    --cookie-success-color: #10b981;
    --cookie-background: #ffffff;
    --cookie-text: #111827;
    
    /* Espacements */
    --cookie-border-radius: 12px;
    --cookie-padding: 24px;
    
    /* Animations */
    --cookie-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mode sombre */
.cookie-theme-dark {
    --cookie-background: #1f2937;
    --cookie-text: #f9fafb;
    --cookie-secondary-color: #9ca3af;
}
```

## 📊 Logging et analytics (optionnel)

```javascript
// Activer le logging automatique des consentements
window.CookieConsent.enableLogging({
    endpoint: '/api/consent/log',           // Votre endpoint de logging
    includeUserAgent: true,                 // Inclure le User-Agent
    anonymousId: true,                      // Générer un ID anonyme
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
    }
});


//{
//    "consent_id": "094e6f3b-5a71-4b62-890e-c78032ab79ea",
//    "timestamp": "2025-09-19T12:45:49.150Z",
//    "device_id": "cc_6041de70-0fab-425c-bb38-a48d45da7545",
//    "site_host": "192.168.23.250:3000",
//    "site_path": "/",
//    "preferences": {
//        "cookies": true,
//        "statistics": true,
//        "marketing": true
//    },
//    "action": "updated",
//    "locale": "fr-FR",
//    "referrer": null,
//    "banner_version": "2.2.0",
//    "policy_hash": "581f06e8",
//    "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36"
//}

```

## ❓ FAQ

### **Est-ce vraiment conforme RGPD ?**
Oui ! La solution respecte tous les principes RGPD :
- ✅ **Consentement préalable** : Aucun script ne se charge avant acceptation
- ✅ **Granularité** : L'utilisateur peut choisir par catégorie
- ✅ **Révocabilité** : Possibilité de changer d'avis à tout moment
- ✅ **Transparence** : Informations claires sur chaque catégorie

### **Compatible avec Google Consent Mode v2 ?**
Oui, les événements émis sont parfaitement compatibles. Vous pouvez mapper nos catégories :
- `statistics` → `analytics_storage`
- `marketing` → `ad_storage`, `ad_user_data`, `ad_personalization`

### **Quelle différence avec js-cookie ?**
js-cookie (1KB) est une simple API pour manipuler les cookies du navigateur. Notre solution (25KB) est une bannière de consentement complète avec interface utilisateur conforme RGPD. Ce sont deux besoins différents !

### **Puis-je l'utiliser commercialement ?**
Oui, licence MIT = usage commercial libre sans restrictions.

### **Performance : impact sur PageSpeed ?**
Minimal ! Le script se charge de façon asynchrone et n'impacte pas le rendu initial. Testé sur des sites avec score PageSpeed > 95.

### **Support IE11 ?**
Non, navigateurs modernes uniquement (Chrome 60+, Firefox 55+, Safari 12+). IE11 représente < 1% du trafic en 2024.

## 🔧 Développement

```bash
# Cloner le projet
git clone https://github.com/synapxlab/cookie-consent.git
cd cookie-consent

# Installer les dépendances
npm install

# Serveur de développement avec hot reload
npm run dev

# Build de production (génère dist/bundle.js et dist/cookie.js)
npm run build

# Serveur de développement local (httpdocs/index.html)
npm run dev

# Linting du code (ESLint)
npm run lint

# Vérification complète (lint + tests)
npm run check

```




### Structure du projet

```
cookie-consent/
├── .gitignore
├── CHANGELOG.md
├── LICENSE
├── README.md
├── package.json
├── package-lock.json
├── composer.json              # Support PHP/Laravel
├── webpack.config.js          # Configuration build
├── src/
│   ├── js/
│   │   ├── cookie.js         # Module principal bannière
│   │   └── script.js         # Gestion événements et intégrations
│   └── scss/
│       ├── cookie.scss       # Styles bannière
│       └── style.scss        # Styles généraux
├── dist/                     # Build de production
│   ├── bundle.js            # Version complète (JS + CSS)
│   └── cookie.js            # Version module seul
├── httpdocs/                 # Demo et documentation
│   ├── assets/js/
│   │   ├── bundle.js
│   │   └── cookie.js
│   └── index.html           # Page de demo
└── Consentement Cookie - Open-Source FR.png
```

## 📄 Licence

MIT © [synapxLab](https://github.com/synapxlab)

Vous êtes libre de :
- ✅ Utiliser commercialement
- ✅ Modifier le code
- ✅ Distribuer
- ✅ Utiliser en privé

## 🤝 Contribution

Les contributions sont les bienvenues ! 

1. **Fork** le projet
2. **Créez** votre branche (`git checkout -b feature/amazing-feature`)
3. **Commitez** vos changements (`git commit -m 'Add amazing feature'`)
4. **Push** sur la branche (`git push origin feature/amazing-feature`)
5. **Ouvrez** une Pull Request

Consultez notre [guide de contribution](CONTRIBUTING.md) pour plus de détails.

## 📞 Support et liens

- 🌐 **Documentation complète** : [https://cookie.synapx.fr/](https://cookie.synapx.fr/)
- 🐛 **Issues GitHub** : [https://github.com/synapxlab/cookie-consent/issues](https://github.com/synapxlab/cookie-consent/issues)
- 📧 **Email** : contact@synapx.fr
- 💬 **Discord** : [Rejoindre la communauté](https://discord.gg/synapxlab)
- 📦 **npm** : [@synapxlab/cookie-consent](https://www.npmjs.com/package/@synapxlab/cookie-consent)

## 🌟 Remerciements

Un grand merci à :
- 👥 Tous les **contributeurs** qui améliorent le projet
- 🧪 Les **testeurs** qui remontent les bugs  
- 🌍 La **communauté** qui fait vivre le projet
- ☕ Le **café** qui rend tout ça possible

## 📈 Statistiques

- 📦 **Downloads npm** : ![npm downloads](https://img.shields.io/npm/dm/@synapxlab/cookie-consent.svg)
- ⭐ **GitHub Stars** : ![GitHub stars](https://img.shields.io/github/stars/synapxlab/cookie-consent.svg)
- 🍴 **Forks** : ![GitHub forks](https://img.shields.io/github/forks/synapxlab/cookie-consent.svg)
- 🐛 **Issues ouvertes** : ![GitHub issues](https://img.shields.io/github/issues/synapxlab/cookie-consent.svg)

---

**⭐ Si ce projet vous aide, donnez-lui une étoile sur GitHub !**

**Fait avec ❤️ en France 🇫🇷 par l'équipe synapxLab**