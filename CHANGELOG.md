# Journal des modifications

Tous les changements notables de `@synapxlab/cookie-consent` seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet respecte le [Semantic Versioning](https://semver.org/spec/v2.0.0/).

## [2.2.0] - 2025-09-19

### Ajouté
- API de **logging** côté client : `enableLogging`, `disableLogging`, `getLoggingConfig`.
- Événement `cookieConsentChanged` émis aussi lors d'une suppression (`action: 'deleted'`).

### Modifié
- Accessibilité : corrections A11y (navigation clavier, focus initial, suppression d'inputs dans `<summary>`).
- UI : bascule propre des sections de préférences, icônes animées, gestion d'`Escape`.
- Charge utile de logging enrichie (`device_id`, `banner_version`, `policy_hash`).

### Corrigé
- Synchronisation UI ↔ stockage des préférences.
- Éviction des doublons d'écouteurs.



Tous les changements notables de `@synapxlab/cookie-consent` seront documentés dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet respecte le [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [2.1.0] - 2025-09-15

### Corrigé
- Template HTML : Compacté sans perdre la lisibilité
- Event handlers : Boucle pour éviter la répétition
- Fonctions fléchées : Syntaxe plus concise
- Destructuring : Pour les éléments DOM multiples
- Spread operator : Usage optimisé pour les objets
- Short-circuit evaluation : && pour les conditions
- Optional chaining : ?. pour éviter les erreurs
- Backoff exponentiel : Pour les retries réseau
- Comments : Gardés seulement pour les sections importantes



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