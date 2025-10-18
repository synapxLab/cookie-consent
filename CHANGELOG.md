
# Journal des modifications

Tous les changements notables de `@synapxlab/cookie-consent` seront documentés dans ce fichier.
Le format est basé sur [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
et ce projet respecte le [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [2.5.0] - 2025-10-18

### 🎉 Ajouté

#### Google Consent Mode v2
- **Support natif de Google Consent Mode v2** pour conformité avec les exigences Google Ads (obligatoire depuis mars 2024 en Europe)
- **Module `google-consent-mode.js`** : Gestion complète des signaux de consentement Google
  - Initialisation automatique en mode "denied" par défaut
  - Mise à jour dynamique des signaux selon les préférences utilisateur
  - Mapping automatique : `statistics` → `analytics_storage`, `marketing` → `ad_storage`
- **10 fonctions exportées** avec gestion d'erreurs robuste :
  - `initGoogleConsentMode()` : Initialisation avec configuration personnalisable
  - `updateGoogleConsent()` : Mise à jour des signaux en temps réel
  - `getGoogleConsentState()` : Récupération de l'état actuel
  - `forceUpdateGoogleConsent()` : Mise à jour manuelle
  - `isGoogleConsentModeAvailable()` : Vérification de disponibilité
  - `getConsentHistory()` : Historique des événements (debug)
  - `resetGoogleConsentMode()` : Réinitialisation (développement)
  - `createGCMConfig()` : Création de configuration personnalisée
  - `onGoogleConsentChange()` : Écoute des changements (event listener)
- **Configuration avancée** :
  - `wait_for_update` : Délai d'attente avant timeout (défaut: 500ms)
  - `ads_data_redaction` : Masquage des données pub si refusé (défaut: true)
  - `url_passthrough` : Passage de paramètres URL entre domaines (défaut: false)
  - `region` : Application par région géographique (ex: ['EU', 'US-CA'])
- **Event personnalisé `googleConsentUpdated`** : Notifications temps réel des changements de consentement
- **Badge GCM ultra-discret** dans le banner :
  - Position : À côté du titre "Gérer le consentement aux cookies"
  - Style : `📊 Google Consent Mode v2` avec tooltip informatif
  - Affichage conditionnel : Uniquement si GCM activé ET Google Analytics/GTM configuré
- **Section GCM dans mode Personnaliser** :
  - Bloc d'information dédié avec fond coloré (bleu Google)
  - Texte explicatif complet conforme RGPD
  - Support des 4 thèmes (default, dark, blue, brown)
- **Traductions GCM** dans les 7 langues :
  - `gcmBadge` : Texte du badge header
  - `gcmDesc` : Description complète dans Personnaliser
- **Documentation complète** en français :
  - Guide d'utilisation avec exemples
  - Configuration avancée
  - Cas d'usage
  - FAQ GCM v2
  - Comparaison avec/sans GCM
  - Conformité RGPD/CNIL

#### Mouse Analytics (préparation)
- **Architecture préparée** pour service Mouse Analytics propriétaire
  - Workers chargés depuis CDN externe (code propriétaire protégé)
  - Configuration `mouse_analytics` dans `CONFIG.statistics`
  - Fonction `loadMouseAnalytics()` pour chargement dynamique
  - Fonction `stopMouseAnalytics()` pour arrêt propre
  - Intégration dans `applyPreferences()`
- **Support WebSocket temps réel** via infrastructure Synapx Chat
  - 2 Web Workers : `mouse-tracker.worker.js` + `websocket-sender.worker.js`
  - Tracking : mouvements souris, clics, scroll, hover avec ID éléments
  - Envoi par batch configurable

### 🔧 Modifié

- **Fichier `cookie.js`** :
  - Import du module `google-consent-mode.js`
  - Ajout de `google_consent_mode` dans CONFIG (par défaut activé)
  - Appel `initGoogleConsentMode()` au chargement et dans `attachHandlers()`
  - Appel `updateGoogleConsent()` dans `applyPreferences()` AVANT chargement des services
  - Support de la config GCM dans `init()` avec validation des propriétés
  - API publique enrichie : `getGoogleConsent()` et `updateGoogleConsent()`
  - Gestion d'erreurs complète avec try/catch sur tous les appels GCM

- **Fichier `translat.js`** :
  - Ajout `gcmBadge` : Label du badge (7 langues)
  - Ajout `gcmDesc` : Description GCM dans Personnaliser (7 langues)

- **Fichier `cookie.scss`** :
  - Classe `.pmcpli-gcm-badge` : Badge header discret avec hover
  - Classe `.pmcpli-gcm-category` : Bloc d'information dans Personnaliser
  - Support des 4 thèmes pour les 2 classes
  - Dégradé bleu-vert (couleurs Google) pour cohérence visuelle

- **Fichier `renderOnce()`** :
  - Création dynamique `gcmBadge` (conditionnel)
  - Création dynamique `gcmCategory` (conditionnel)
  - Insertion dans le template HTML

### 🛡️ Sécurité

- **Protection contre tous les crashs GCM** :
  - Vérification `typeof window === 'undefined'` (compatibilité SSR)
  - Vérification `typeof window.gtag === 'function'` avant usage
  - Validation `Array.isArray(window.dataLayer)` avant lecture
  - Validation des types de toutes les entrées utilisateur
  - Try/catch sur dispatch d'événements (CustomEvent)
  - Try/catch sur tous les callbacks (event listeners)
  - Gestion des erreurs de réseau (timeout, retry)
- **Mode dégradé gracieux** :
  - Si GCM plante, le reste de Cookie Consent continue de fonctionner
  - Logs d'erreur détaillés sans bloquer l'exécution
  - Retours `false`/`null` explicites en cas d'échec

### 📚 Documentation

- **Nouveau fichier** : `docs/google-consent-mode-v2.md` (français)
  - Qu'est-ce que GCM v2 ?
  - Installation et configuration
  - Exemples d'utilisation (basique et avancé)
  - API JavaScript complète
  - Cas d'usage avancés
  - Comparaison avec/sans GCM v2
  - Conformité RGPD/CNIL
  - FAQ (10 questions)
  - Dépannage (4 problèmes courants)
  - Ressources (liens officiels Google et CNIL)

### 🐛 Corrections

- **Noms de propriétés corrigés** dans la documentation :
  - ❌ `google_manager_key` → ✅ `google_analytics_key`
  - ❌ `google_AdSense_key` → ✅ `google_adsense_key` (minuscule)
  - ❌ `facebook` → ✅ `facebook_pixel`

### 🔄 Compatibilité

- **Rétrocompatibilité totale** : GCM v2 activé par défaut mais peut être désactivé
- **Zéro breaking change** : Aucune modification de l'API existante
- **Compatible SSR/Node.js** : Détection automatique et désactivation propre
- **Compatible tous navigateurs modernes** : Chrome, Firefox, Safari, Edge

### 📦 Performance

- **Impact minimal** : +5KB non gzippé (~1.5KB gzippé) pour le module GCM
- **Chargement asynchrone** : N'impacte pas le temps de chargement initial
- **Lazy loading** : Badge et catégorie GCM créés uniquement si activé

### 🎯 Avantages GCM v2

- ✅ Collecte de données agrégées même sans consentement (mode "ping")
- ✅ Amélioration significative de la qualité des conversions Google
- ✅ Conformité obligatoire pour Google Ads en Europe (depuis mars 2024)
- ✅ Compatible GA4, Google Tag Manager, Google Ads
- ✅ Respect total du choix utilisateur (conforme RGPD)

---


## [2.4.0] - 2025-10-14

### Ajouté
- **Support complet de 15+ services marketing et analytics** :
  - **Statistics** : Google Analytics, Google Tag Manager, Matomo, Mixpanel, Amplitude, Plausible, Hotjar, Microsoft Clarity
  - **Marketing** : Google AdSense, Facebook Pixel, TikTok Pixel, LinkedIn Insight Tag
  - **Cookies (Chat/CRM)** : Intercom, Crisp, HubSpot, Segment
- **Détection automatique des services** : Les services configurés s'affichent dans les descriptions des catégories
- **Logger avancé** avec retry et timeout configurables
- **Pseudonymisation automatique** : Génération de device_id anonyme
- **En-têtes HTTP personnalisables** dans la configuration logger
- **Support de plusieurs clés par catégorie** : `google_analytics_key` ET `google_tag_manager_key` supportés simultanément
- **Fonction `getConfiguredServices()`** : Détection automatique de tous les services actifs
- **Nouvelles clés de traduction** : `cookiesServices` pour les services de chat/CRM
- **Catégorie "Cookies de fonctionnalité"** distincte des cookies strictement nécessaires

### Modifié
- **Structure CONFIG complètement réorganisée** :
  - `logger` : Configuration centralisée du système de journalisation
  - `statistics` : Tous les outils d'analyse
  - `marketing` : Tous les outils publicitaires
  - `cookies` : Outils de chat et CRM
- **Fonction `init()`** : Support de la nouvelle syntaxe structurée avec rétrocompatibilité
- **Affichage conditionnel** : Les sections de services n'apparaissent que si des clés sont configurées
- **Chargement intelligent** : Chaque service ne se charge que si sa clé est présente
- **Messages de logging** plus détaillés avec emojis pour meilleure lisibilité

### Amélioré
- **Conformité RGPD renforcée** : 
  - Device ID stocké séparément de la clé de consentement
  - Option `anonymousId` pour désactiver le tracking inter-sessions
  - Headers personnalisables pour CSRF tokens
- **Performance** : Lazy loading de tous les scripts tiers
- **DX (Developer Experience)** : 
  - Console logs détaillés lors de l'initialisation
  - Messages explicites lors du chargement de chaque service
  - Fonction `getConfig()` pour débugger la configuration
- **Documentation** : Exemples pour tous les services supportés

### Exemple de migration
```javascript
// ✅ Nouvelle syntaxe (v2.4+) - Plus de services disponibles
window.CookieConsent.init({
  logger: {
    enabled: true,
    endpoint: '/api/consent/log',
    apiKey: 'your-key',
    anonymousId: true,
    headers: {
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content
    }
  },
  statistics: {
    google_analytics_key: 'G-ABC123XYZ',    // Nouveau nom de clé
    google_tag_manager_key: 'GTM-XXXXXXX',
    matomo: { url: 'https://matomo.example.com/', siteId: '1' },
    mixpanel_token: 'YOUR_TOKEN',
    amplitude_key: 'YOUR_KEY',
    plausible: { domain: 'example.com' },
    hotjar_site_id: 123456,
    clarity_project_id: 'ABC123XYZ'
  },
  marketing: {
    google_adsense_key: 'ca-pub-XXXXXXXXXXXXXXXX',
    facebook_pixel: { key: 'PIXEL_ID', track: 'PageView' },
    tiktok_pixel_id: 'TIKTOK_PIXEL_ID',
    linkedin_partner_id: 'PARTNER_ID'
  },
  cookies: {
    intercom_app_id: 'APP_ID',
    crisp_website_id: 'WEBSITE_ID',
    hubspot_portal_id: 'PORTAL_ID',
    segment_write_key: 'WRITE_KEY'
  }
});
```

## [2.3.0] - 2025-10-10

### Ajouté
- **Catégorie "Preuve de consentement"** affichée quand logger est activé
- **Message de transparence CNIL** : Explication complète sur la pseudonymisation et la conservation des logs
- **Support des clés alternatives** : `google_manager_key` accepté comme alias de `google_analytics_key`
- **Détection Facebook Pixel** : Support de la syntaxe objet `{ key, track }`

### Modifié
- **Affichage conditionnel de la catégorie logging** : Ne s'affiche que si `logger.enabled === true`
- **Traductions enrichies** : Ajout de `loggingTitle` et `loggingNotice` dans les 7 langues

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

## [2.1.1] - 2025-09-19

### Corrigé
- **API globale** : Décommentée `window.CookieConsent` avec toutes les méthodes
- **Événements** : Ajout de l'événement `cookieConsentChanged` émis automatiquement après sauvegarde
- **Méthodes API** : 
  - `open()` - Afficher la bannière
  - `open(true)` - Afficher avec préférences détaillées
  - `reset()` - Supprimer localStorage et rouvrir la bannière
  - `getPreferences()` - Récupérer les préférences actuelles
  - `hasConsent(category)` - Vérifier une catégorie spécifique
- **Gestion des scripts tiers** : Chargement conditionnel sans rechargement de page
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

## Migration

### De 2.3.x vers 2.4.x
```javascript
// Nouvelles fonctionnalités disponibles :
// - 15+ services supportés (Matomo, Mixpanel, Amplitude, Hotjar, Clarity, etc.)
// - Catégorie "Cookies" séparée pour Intercom, Crisp, HubSpot, Segment
// - Logger avec retry, timeout et headers personnalisables
```

### De 2.2.x vers 2.3.x
```javascript
// ✅ Aucun changement cassant
// Nouveautés :
// - Catégorie "Preuve de consentement" affichée automatiquement
// - Message de transparence CNIL intégré
```

### De 2.1.x vers 2.2.x
```javascript
// ✅ Aucun changement cassant - Rétrocompatibilité totale
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
window.CookieConsent.getConfig();
```

### De 1.x vers 2.x
```javascript
// ✅ Nouvelle API (2.x+)
// Aucune initialisation requise, fonctionne automatiquement
window.CookieConsent.open(); // Ouvrir manuellement si besoin
```

## Langues supportées

| Version | Langues |
|---------|---------|
| 1.x | Français uniquement |
| 2.0.x - 2.1.x | Français, Anglais, Espagnol, Allemand |
| 2.2.x+ | Français, Anglais, Espagnol, Allemand, Italien, Néerlandais, Portugais |

## Services supportés par version

| Version | Services Statistics | Services Marketing | Services Cookies/CRM |
|---------|--------------------|--------------------|---------------------|
| 2.0.x - 2.3.x | Google Analytics, Google Tag Manager | Google AdSense, Facebook Pixel | - |
| 2.4.x | GA, GTM, Matomo, Mixpanel, Amplitude, Plausible, Hotjar, MS Clarity | AdSense, FB Pixel, TikTok Pixel, LinkedIn Insight | Intercom, Crisp, HubSpot, Segment |

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