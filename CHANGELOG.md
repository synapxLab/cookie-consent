# Journal des modifications

Tous les changements notables de `@synapxlab/cookie-consent` seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet respecte le [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [2.1.0] - 2025-09-15

### Corrigé
- Suppression des balises TypeScript du build vanilla JavaScript
- Correction du processus de build pour générer du JS vanilla pur sans annotations TS
- Configuration webpack corrigée pour une sortie JavaScript vanilla pure

## [2.0.0] - 2025-09-15

### Modifié
- Refactorisation majeure pour de meilleures performances
- API mise à jour pour une meilleure expérience développeur
- Options de style personnalisables

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

## Installation

```bash
npm install @synapxlab/cookie-consent
```

## Utilisation

```javascript
import cookieConsent from '@synapxlab/cookie-consent';

cookieConsent.init({
  // votre configuration
});
```