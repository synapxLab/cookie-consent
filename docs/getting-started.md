# Démarrage rapide

## Installation

### Via npm (recommandé)

```bash
npm install @synapxlab/cookie-consent
```

### Via yarn

```bash
yarn add @synapxlab/cookie-consent
```

### Via CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@synapxlab/cookie-consent@2.1.3/dist/cookie.min.js"></script>
```

## Usage basique

### 1. Import simple

```javascript
// Dans votre fichier JS principal
import '@synapxlab/cookie-consent';
```

### 2. Configuration minimale

```javascript
// Aucune configuration requise !
// La bannière s'affiche automatiquement au chargement
```

### 3. Avec configuration

```javascript
window.CookieConsent.init({
  statistics: {
    google_analytics_key: 'G-XXXXXXXXX'
  },
  marketing: {
    facebook_pixel: {
      key: 'YOUR-PIXEL-ID',
      track: 'PageView'
    }
  }
});
```

## Vérification

Ouvrez votre navigateur et vous devriez voir :
- ✅ La bannière de consentement s'affiche au premier chargement
- ✅ Les scripts tiers (Analytics, pixels) sont bloqués par défaut
- ✅ Les préférences sont sauvegardées après acceptation

## Étapes suivantes

- 📖 [Configuration complète](./configuration.md)
- 🔧 [Intégrations](./integrations/)
- ⚖️ [Conformité RGPD](./compliance-cnil.md)
- ❓ [FAQ](./faq.md)

## Besoin d'aide ?

- 📧 Email : contact@synapx.fr
- 🐛 Issues : [GitHub Issues](https://github.com/synapxLab/cookie-consent/issues)
- 💬 Discord : [Communauté SynapxLab](https://discord.gg/synapxlab)