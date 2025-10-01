# Journal des modifications

Tous les changements notables de `@synapxlab/cookie-consent` seront documentés dans ce fichier.
Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet respecte le [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2025-10-01

### Ajouté
- **Affichage automatique des services** : Les services configurés (Google Analytics, AdSense, Facebook Pixel) sont maintenant automatiquement détectés et affichés dans les descriptions des catégories
- **3 nouvelles langues** : 
  - Italien (it)
  - Néerlandais (nl)
  - Portugais (pt)
- **Fonction `getConfiguredServices()`** : Détection automatique des services configurés
- **Nouvelle clé de traduction** : `statsServices` et `marketingServices` pour afficher les services
- **Style `.pmcpli-services`** : Design dédié avec support des 4 thèmes
- **Documentation README** : Version anglaise (README.md) et française (README.fr.md) complètes

### Modifié
- **CSS entièrement encapsulé** : Tous les styles sont maintenant isolés dans `#politecookiebanner` pour éviter tout conflit avec le site parent
- **Structure CONFIG** : Centralisation de la configuration avec `logger`, `statistics` et `marketing`
- **Fonction `init()`** : Support de la nouvelle syntaxe avec rétrocompatibilité totale
- **Traductions** : 7 langues supportées (était 4 en v2.1.1)
- **Taille du bundle** : Optimisé à ~5 KB gzippé (ajout de 3 langues = +2 KB seulement)

### Amélioré
- **Transparence RGPD** : L'utilisateur voit exactement quels services sont utilisés
- **UX** : Affichage conditionnel (si aucun service configuré, pas de ligne "Services")
- **Performance** : Chargement des scripts uniquement si les clés sont présentes
- **Accessibilité** : Reset CSS complet pour éviter les héritages indésirables

### Exemple
```javascript
// Configuration
window.CookieConsent.init({
  statistics: {
    google_manager_key: 'G-ABC123XYZ'
  },
  marketing: {
    google_AdSense_key: 'ca-pub-1234567890',
    facebook: { key: '123456789', track: 'PageView' }
  }
});

// Résultat dans la bannière :
// 📊 Statistiques
// Services : Google Analytics
//
// 📢 Marketing  
// Services : Google AdSense, Facebook Pixel
```

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
window.CookieConsent.init({
  statistics: {
    google_manager_key: 'G-XXXXXXXXXX'
  }
});
```

### Version module seul
```javascript
// Pour intégrations custom
import '@synapxlab/cookie-consent/dist/cookie.js';
```

## Migration

### De 2.1.x vers 2.2.x
```javascript
// ✅ Aucun changement cassant - Rétrocompatibilité totale
// Ancienne syntaxe toujours valide :
window.CookieConsent.init({
  endpoint: '/api/consent/log',
  anonymousId: true
});

// Nouvelle syntaxe (recommandée) :
window.CookieConsent.init({
  logger: {
    enabled: true,
    endpoint: '/api/consent/log',
    anonymousId: true
  },
  statistics: {
    google_manager_key: 'G-ABC123XYZ'
  }
});

// Nouvelles fonctionnalités disponibles :
// - Affichage automatique des services dans la bannière
// - 7 langues supportées (fr, en, es, de, it, nl, pt)
// - CSS entièrement encapsulé
```

### De 2.0.x vers 2.1.x
```javascript
// ✅ API stable, pas de changement cassant
// Nouvelles méthodes disponibles :
window.CookieConsent.hasConsent('statistics');
window.CookieConsent.on('change', callback);
```

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

## Langues supportées

| Version | Langues |
|---------|---------|
| 1.x | Français uniquement |
| 2.0.x - 2.1.x | Français, Anglais, Espagnol, Allemand |
| 2.2.x | Français, Anglais, Espagnol, Allemand, Italien, Néerlandais, Portugais |

## Liens utiles

- 📖 **Documentation** : [https://cookie.synapx.fr/](https://cookie.synapx.fr/)
- 🐛 **Issues** : [https://github.com/synapxlab/cookie-consent/issues](https://github.com/synapxlab/cookie-consent/issues)
- 📦 **npm** : [https://www.npmjs.com/package/@synapxlab/cookie-consent](https://www.npmjs.com/package/@synapxlab/cookie-consent)
- 💬 **Support** : contact@synapx.fr

---

**Format du versioning** : MAJOR.MINOR.PATCH
- **MAJOR** : Changements cassants (breaking changes)
- **MINOR** : Nouvelles fonctionnalités (rétrocompatible)
- **PATCH** : Corrections de bugs (rétrocompatible)