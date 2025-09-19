# Journal des modifications

Tous les changements notables de `@synapxlab/cookie-consent` seront documentés dans ce fichier.
Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet respecte le [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.1] - 2025-09-19

### Corrigé
- **API globale** : Décommentée `window.CookieConsent` avec toutes les méthodes
- **Événements** : Ajout de l'événement `cookieConsentChanged` émis automatiquement après sauvegarde
- **Méthodes API** : 
  - `show()` - Afficher la bannière avec préférences
  - `hide()` - Masquer la bannière
  - `reset()` - Supprimer localStorage et recharger la page
  - `getPreferences()` - Récupérer les préférences actuelles
  - `hasConsent(category)` - Vérifier une catégorie spécifique
  - `on('change', callback)` - Écouter les changements
- **Gestion des scripts tiers** : Chargement conditionnel sans rechargement de page
- **Messages adaptatifs** : Basculement entre message d'optin et confirmation
- **Bouton "Del"** : Fonctionnel pour supprimer toutes les préférences
- **Logs de debug** : Ajout de console.log détaillés pour le développement

### Ajouté
- **Gestion clavier** : Touche Escape pour fermer la bannière
- **Focus automatique** : Sur le premier élément interactif à l'ouverture
- **Accessibilité** : Attributs ARIA corrects sur tous les toggles
- **Événement de reset** : Émission d'un événement spécial lors de la suppression
- **Vérification au chargement** : Les scripts tiers se chargent automatiquement si consentement déjà donné

### Amélioré
- **Performance** : Initialisation uniquement si aucun consentement existant
- **UX** : Messages de confirmation après sauvegarde des préférences
- **Robustesse** : Gestion d'erreur pour la lecture du localStorage
- **Documentation** : README.md complètement revu avec exemples pratiques

## [2.1.0] - 2025-09-15

### Corrigé
- Suppression des balises TypeScript du build vanilla JavaScript
- Correction du processus de build pour générer du JS vanilla pur sans annotations TS
- Configuration webpack corrigée pour une sortie JavaScript vanilla pure

### Ajouté
- **Structure de fichiers** : Séparation claire entre `cookie.js` (module) et `bundle.js` (complet)
- **Dossier httpdocs** : Page de démonstration et documentation
- **Support Composer** : Intégration PHP/Laravel avec composer.json
- **Image de présentation** : `Consentement Cookie - Open-Source FR.png`

## [2.0.0] - 2025-09-15

### Modifié
- Refactorisation majeure pour de meilleures performances
- API mise à jour pour une meilleure expérience développeur
- Options de style personnalisables

### Ajouté
- **Thèmes CSS** : Support des thèmes (default, dark, blue, brown)
- **Personnalisation avancée** : Variables CSS pour customisation complète
- **Gestion des frameworks** : Exemples pour React, Vue.js, WordPress, Next.js
- **Logging automatique** : Système de log des consentements (optionnel)
- **Google Consent Mode** : Compatibilité avec Google Consent Mode v2

### Cassant
- **API changée** : Migration de l'ancienne API vers `window.CookieConsent`
- **Structure** : Nouvelle architecture avec webpack et SCSS

## [1.0.0] - 2025-09-13

### Ajouté
- Version initiale de la gestion du consentement cookies
- Implémentation en JavaScript vanilla
- Bannière cookies conforme RGPD
- Intégration facile avec n'importe quel site web

### Fonctionnalités
- API simple pour la gestion du consentement cookies
- JavaScript vanilla léger (aucune dépendance)
- Design responsive
- Fonctions de callback pour les événements de consentement
- **Conformité RGPD complète** :
  - Consentement préalable requis
  - Granularité par catégorie (nécessaire, statistiques, marketing)
  - Révocabilité à tout moment
  - Transparence sur l'utilisation des cookies
- **Interface utilisateur** :
  - Bannière modale avec design moderne
  - Toggles pour chaque catégorie de cookies
  - Boutons d'acceptation/refus global
  - Sauvegarde des préférences individuelles
- **Stockage** : Préférences sauvées dans localStorage
- **Accessibilité** : Navigation clavier et attributs ARIA

## Installation

```bash
npm install @synapxlab/cookie-consent
```

## Utilisation

### Version complète (recommandée)
```html
<!-- CDN -->
<script src="https://unpkg.com/@synapxlab/cookie-consent@latest/dist/bundle.js"></script>
```

```javascript
// npm
import '@synapxlab/cookie-consent/dist/bundle.js';

// API disponible globalement
window.CookieConsent.show();
```

### Version module seul
```javascript
// Pour intégrations custom
import '@synapxlab/cookie-consent/dist/cookie.js';
```

## Migration

### De 1.x vers 2.x
```javascript
// ❌ Ancienne API (1.x)
cookieConsent.init({
  // configuration
});

// ✅ Nouvelle API (2.x+)
// Aucune initialisation requise, fonctionne automatiquement
window.CookieConsent.show(); // Ouvrir manuellement si besoin
```

### De 2.0.x vers 2.1.x
```javascript
// ✅ API stable, pas de changement cassant
// Nouvelles méthodes disponibles :
window.CookieConsent.hasConsent('statistics');
window.CookieConsent.on('change', callback);
```

## Liens utiles

- 📖 **Documentation** : [https://cookie.synapx.fr/](https://cookie.synapx.fr/)
- 🐛 **Issues** : [https://github.com/synapxlab/cookie-consent/issues](https://github.com/synapxlab/cookie-consent/issues)
- 📦 **npm** : [https://www.npmjs.com/package/@synapxlab/cookie-consent](https://www.npmjs.com/package/@synapxlab/cookie-consent)
- 💬 **Support** : contact@synapx.fr