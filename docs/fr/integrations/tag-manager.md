# Intégration Google Tag Manager

## Vue d'ensemble

Google Tag Manager (GTM) est un outil puissant mais **dangereux pour la conformité RGPD** s'il est mal configuré. Cookie Consent bloque automatiquement les tags GTM jusqu'au consentement utilisateur.

## Problématique GTM & RGPD

### ❌ Le problème

GTM charge par défaut **tous les tags** dès le chargement de la page, **AVANT** le consentement :

```html
<!-- GTM standard (NON CONFORME) -->
<script>(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-XXXX');</script>

<!-- ⚠️ Résultat : Google Analytics, Facebook Pixel, etc. se chargent IMMÉDIATEMENT -->
<!-- ❌ Non conforme CNIL : cookies déposés avant consentement -->
```

### ✅ La solution Cookie Consent

Cookie Consent **bloque automatiquement** GTM et ses tags :

1. **Détection** : Repère `googletagmanager.com` dans les scripts
2. **Freeze** : Bloque l'exécution (`type="text/plain"`)
3. **Release** : Active GTM uniquement après consentement

## Installation

### Méthode 1 : Automatique (recommandée)

```javascript
window.CookieConsent.init({
  statistics: {
    google_tag_manager_key: 'GTM-XXXXXXX'
  }
});
```

Cookie Consent va :
- ✅ Charger GTM automatiquement après consentement
- ✅ Bloquer tous les tags tant que pas de consentement
- ✅ Activer les tags selon les catégories consenties

### Méthode 2 : GTM déjà dans le site

Si GTM est déjà installé dans votre HTML :

```html
<!-- Votre GTM existant -->
<script>(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-XXXX');</script>
```

**Rien à faire !** Cookie Consent le détecte et le bloque automatiquement.

## Configuration GTM pour Cookie Consent

### 1. Variables personnalisées

Créer ces **variables** dans GTM pour détecter les consentements :

#### Variable : Cookie Consent - Statistics

```
Type : Variable JavaScript personnalisée
Nom : CookieConsent - Statistics

Code :
function() {
  if (window.CookieConsent && window.CookieConsent.hasConsent) {
    return window.CookieConsent.hasConsent('statistics') ? 'true' : 'false';
  }
  return 'false';
}
```

#### Variable : Cookie Consent - Marketing

```
Type : Variable JavaScript personnalisée
Nom : CookieConsent - Marketing

Code :
function() {
  if (window.CookieConsent && window.CookieConsent.hasConsent) {
    return window.CookieConsent.hasConsent('marketing') ? 'true' : 'false';
  }
  return 'false';
}
```

#### Variable : Cookie Consent - Functional

```
Type : Variable JavaScript personnalisée
Nom : CookieConsent - Functional

Code :
function() {
  if (window.CookieConsent && window.CookieConsent.hasConsent) {
    return window.CookieConsent.hasConsent('cookies') ? 'true' : 'false';
  }
  return 'false';
}
```

### 2. Déclencheurs conditionnels

Créer des **déclencheurs** basés sur le consentement :

#### Déclencheur : Consent - Statistics Accepted

```
Type : Événement personnalisé
Nom de l'événement : cookieConsentChanged

Conditions de déclenchement :
  {{CookieConsent - Statistics}} est égal à true

Utiliser pour activer :
  ☑️ Ce déclencheur se déclenche sur Toutes les pages
```

#### Déclencheur : Consent - Marketing Accepted

```
Type : Événement personnalisé
Nom de l'événement : cookieConsentChanged

Conditions de déclenchement :
  {{CookieConsent - Marketing}} est égal à true
```

#### Déclencheur : Consent - Functional Accepted

```
Type : Événement personnalisé
Nom de l'événement : cookieConsentChanged

Conditions de déclenchement :
  {{CookieConsent - Functional}} est égal à true
```

### 3. Configuration des tags

#### Tag Google Analytics 4

```
Type : Google Analytics: Configuration GA4
ID de mesure : G-XXXXXXXXX

Déclenchement :
  ☑️ Consent - Statistics Accepted

Exceptions de déclenchement :
  ☐ Aucune
```

#### Tag Facebook Pixel

```
Type : HTML personnalisé

Code HTML :
<script>
!function(f,b,e,v,n,t,s){...}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR-PIXEL-ID');
fbq('track', 'PageView');
</script>

Déclenchement :
  ☑️ Consent - Marketing Accepted
```

#### Tag Hotjar

```
Type : HTML personnalisé

Code HTML :
<script>
(function(h,o,t,j,a,r){...})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>

Déclenchement :
  ☑️ Consent - Statistics Accepted
```

## Événement Cookie Consent dans GTM

### Créer un événement dataLayer

Cookie Consent envoie automatiquement un événement à `dataLayer` :

```javascript
// Cookie Consent envoie automatiquement ceci :
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'event': 'cookieConsentChanged',
  'cookieConsent': {
    'statistics': true,
    'marketing': false,
    'cookies': true
  }
});
```

### Capturer l'événement dans GTM

**Variable : Consent Data - Statistics**

```
Type : Variable de couche de données
Nom : consentData.statistics
Version de la couche de données : Version 2
Chemin de la couche de données : cookieConsent.statistics
```

**Variable : Consent Data - Marketing**

```
Type : Variable de couche de données
Nom : consentData.marketing
Chemin : cookieConsent.marketing
```

## Exemples de configurations

### Exemple 1 : Site vitrine (Analytics uniquement)

**Tags GTM :**
1. Google Analytics 4 (GA4)
   - Déclencheur : Consent - Statistics Accepted

**Configuration Cookie Consent :**
```javascript
window.CookieConsent.init({
  statistics: {
    google_tag_manager_key: 'GTM-XXXXXXX'
  }
});
```

### Exemple 2 : E-commerce (Analytics + Marketing)

**Tags GTM :**
1. Google Analytics 4 (Enhanced Ecommerce)
   - Déclencheur : Consent - Statistics Accepted

2. Facebook Pixel
   - Déclencheur : Consent - Marketing Accepted

3. Google Ads Remarketing
   - Déclencheur : Consent - Marketing Accepted

4. Google Ads Conversion
   - Déclencheur : Purchase (+ Marketing Accepted)

**Configuration Cookie Consent :**
```javascript
window.CookieConsent.init({
  logger: {
    enabled: true,
    apiKey: 'sk-live-xxxxx'
  },
  statistics: {
    google_tag_manager_key: 'GTM-XXXXXXX'
  }
});
```

### Exemple 3 : SaaS (Full stack)

**Tags GTM :**
1. Google Analytics 4
   - Déclencheur : Consent - Statistics Accepted

2. Hotjar
   - Déclencheur : Consent - Statistics Accepted

3. Intercom (Chat)
   - Déclencheur : Consent - Functional Accepted

4. Facebook Pixel
   - Déclencheur : Consent - Marketing Accepted

5. LinkedIn Insight Tag
   - Déclencheur : Consent - Marketing Accepted

## Blocage avancé : Consent Mode v2 (Google)

### Qu'est-ce que Consent Mode ?

Google Consent Mode v2 permet à GTM de fonctionner en **mode dégradé** sans cookies si l'utilisateur refuse.

### Configuration Consent Mode

Dans votre GTM, ajouter ce tag **AVANT** tous les autres :

**Tag : Consent Mode - Initialization**

```html
<script>
// Initialisation Consent Mode (par défaut : tout refusé)
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'functionality_storage': 'denied',
  'personalization_storage': 'denied',
  'security_storage': 'granted',  // Toujours accordé (nécessaire)
  'wait_for_update': 500
});
</script>
```

**Déclencheur :** Consent Initialization - All Pages (priorité maximale)

### Mise à jour après consentement

**Tag : Consent Mode - Update**

```html
<script>
// Récupérer les préférences Cookie Consent
const prefs = window.CookieConsent.getPreferences();

gtag('consent', 'update', {
  'ad_storage': prefs.marketing ? 'granted' : 'denied',
  'ad_user_data': prefs.marketing ? 'granted' : 'denied',
  'ad_personalization': prefs.marketing ? 'granted' : 'denied',
  'analytics_storage': prefs.statistics ? 'granted' : 'denied',
  'functionality_storage': prefs.cookies ? 'granted' : 'denied',
  'personalization_storage': prefs.cookies ? 'granted' : 'denied'
});
</script>
```

**Déclencheur :** Consent - Any Category Accepted

## Debugging GTM avec Cookie Consent

### Mode aperçu GTM

1. Activer le **mode aperçu** dans GTM
2. Accéder à votre site
3. Observer le comportement des tags

**Sans consentement :**
- ❌ Tags bloqués (ne se déclenchent pas)
- ✅ Événement `cookieConsentChanged` n'est pas encore envoyé

**Avec consentement Statistics :**
- ✅ Tag GA4 se déclenche
- ✅ Événement `cookieConsentChanged` visible dans dataLayer

### Console JavaScript

```javascript
// Vérifier Cookie Consent
console.log(window.CookieConsent.getPreferences());

// Vérifier dataLayer
console.log(window.dataLayer);

// Forcer un test
window.CookieConsent.reset(); // Efface et rouvre la bannière
```

### GTM Debug Extension

Installer l'extension Chrome : **Google Tag Assistant**

1. Activer l'extension
2. Recharger votre site
3. Observer les tags qui se chargent
4. Vérifier qu'aucun tag ne se charge avant consentement

## Erreurs fréquentes & Solutions

### ❌ Erreur 1 : Tags se chargent avant consentement

**Cause :** GTM configuré pour tout charger au pageview

**Solution :**
1. Ouvrir GTM > Variables
2. Créer les variables de consentement
3. Modifier chaque tag :
   - Déclencheur : `Consent - [Category] Accepted`
   - Exception : Supprimer "All Pages"

### ❌ Erreur 2 : Événement cookieConsentChanged non reçu

**Cause :** Cookie Consent chargé après GTM

**Solution :**
```html
<!-- ✅ CORRECT : Cookie Consent AVANT GTM -->
<script src="cookie-consent.js"></script>
<script>
  window.CookieConsent.init({
    statistics: {
      google_tag_manager_key: 'GTM-XXXXXXX'
    }
  });
</script>

<!-- GTM se charge automatiquement après consentement -->
```

### ❌ Erreur 3 : Variables undefined dans GTM

**Cause :** Cookie Consent pas encore initialisé

**Solution :** Ajouter une vérification :
```javascript
function() {
  if (typeof window.CookieConsent === 'undefined') {
    return 'false';
  }
  return window.CookieConsent.hasConsent('statistics') ? 'true' : 'false';
}
```

### ❌ Erreur 4 : SPA (Single Page App) - Tags ne se rechargent pas

**Cause :** Navigation client-side, pas de nouveau pageview

**Solution :** Utiliser GTM Virtual Pageview

**Tag : Virtual Pageview**
```javascript
// Dans votre router (React/Vue/Angular)
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'event': 'virtualPageview',
  'pagePath': window.location.pathname,
  'pageTitle': document.title
});
```

**Déclencheur GTM :**
```
Type : Événement personnalisé
Nom : virtualPageview
```

## Performance & Optimisation

### Chargement asynchrone

GTM est automatiquement chargé de manière asynchrone par Cookie Consent :

```javascript
// Cookie Consent charge GTM comme ceci :
const script = document.createElement('script');
script.src = `https://www.googletagmanager.com/gtm.js?id=GTM-XXXXXXX`;
script.async = true;
document.head.appendChild(script);
```

### Lazy Loading des tags

Pour optimiser encore plus, différer certains tags :

**Tag : Hotjar (Lazy)**
```html
<script>
// Charger Hotjar 5 secondes après le consentement
setTimeout(function() {
  (function(h,o,t,j,a,r){...})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
}, 5000);
</script>
```

**Déclencheur :** Consent - Statistics Accepted

### Limite de tags

**Recommandation CNIL :** Limiter le nombre de traceurs

- ✅ 1-3 tags : Excellent
- ⚠️ 4-10 tags : Acceptable
- ❌ 10+ tags : Impact performance + complexité RGPD

## Audit de conformité GTM

### Checklist pré-déploiement

- [ ] Tous les tags ont un déclencheur conditionnel
- [ ] Aucun tag sur "All Pages" sans condition de consentement
- [ ] Variables de consentement configurées
- [ ] Événement `cookieConsentChanged` capturé
- [ ] Mode aperçu GTM testé sans consentement
- [ ] Mode aperçu GTM testé avec consentement
- [ ] Consent Mode v2 configuré (si Google Ads)
- [ ] Documentation GTM à jour

### Test en production

**1. Vider le cache navigateur**
```
Chrome : Ctrl+Shift+Del > Tout effacer
```

**2. Ouvrir le site en navigation privée**

**3. Vérifier (sans consentement) :**
- [ ] Aucun cookie tiers déposé
- [ ] Network tab : pas de requêtes vers analytics/ads
- [ ] dataLayer vide ou sans événements trackers

**4. Accepter les cookies**

**5. Vérifier (avec consentement) :**
- [ ] Cookies déposés correctement
- [ ] Événements envoyés aux plateformes
- [ ] dataLayer contient `cookieConsentChanged`

### Outils d'audit

**Extensions Chrome :**
- **Google Tag Assistant** : Vérifier les tags GTM
- **CookieBot** : Scanner les cookies
- **GDPR Cookie Scanner** : Audit conformité

**Outils en ligne :**
- [Cookiebot Scanner](https://www.cookiebot.com/en/cookie-scanner/)
- [GDPR Cookie Compliance](https://www.gdprcookiecompliance.com/)

## Cas d'usage avancés

### Cas 1 : A/B Testing avec Google Optimize

**Tag : Google Optimize**
```html
<script src="https://www.googleoptimize.com/optimize.js?id=OPT-XXXXXXX"></script>
```

**Déclencheur :** Consent - Statistics Accepted

**Note :** Google Optimize est maintenant déprécié. Utilisez plutôt :
- VWO
- Optimizely
- AB Tasty

### Cas 2 : Tracking cross-domain

**Variable : Cross Domain Tracking**
```javascript
function() {
  return {
    'allowLinker': true,
    'linker': {
      'domains': ['site1.com', 'site2.com', 'checkout.site.com']
    }
  };
}
```

**Tag GA4 :**
```
Paramètres : {{Cross Domain Tracking}}
```

### Cas 3 : Server-Side Tagging

GTM Server-Side permet de réduire les appels client-side.

**Configuration :**
1. Créer un container GTM Server
2. Configurer l'endpoint (ex: `gtm.votresite.com`)
3. Rediriger les tags via le serveur

**Avantages :**
- ✅ Meilleure performance
- ✅ Moins de blocage par adblockers
- ✅ Contrôle des données côté serveur

**Avec Cookie Consent :**
```javascript
window.CookieConsent.init({
  statistics: {
    google_tag_manager_key: 'GTM-XXXXXXX',
    server_container_url: 'https://gtm.votresite.com'
  }
});
```

## Documentation GTM

### Variables à documenter

Créer un document partagé (Google Docs) avec :

| Variable | Type | Usage | Catégorie |
|----------|------|-------|-----------|
| CookieConsent - Statistics | JS Custom | Détecter consentement stats | Compliance |
| CookieConsent - Marketing | JS Custom | Détecter consentement marketing | Compliance |
| GA4 Measurement ID | Constante | ID Google Analytics | Analytics |
| FB Pixel ID | Constante | ID Facebook Pixel | Marketing |

### Tags à documenter

| Tag | Type | Déclencheur | Données envoyées |
|-----|------|-------------|------------------|
| GA4 - Configuration | GA4 Config | Consent Statistics | Pageviews, events |
| GA4 - Purchase | GA4 Event | Purchase + Consent | Transaction data |
| FB Pixel - PageView | HTML | Consent Marketing | Page views |
| FB Pixel - Purchase | HTML | Purchase + Consent | Conversion data |

### Déclencheurs à documenter

| Déclencheur | Type | Condition | Usage |
|-------------|------|-----------|-------|
| Consent - Statistics | Custom Event | cookieConsentChanged + stats=true | Activer analytics |
| Consent - Marketing | Custom Event | cookieConsentChanged + marketing=true | Activer ads |
| Purchase | Custom Event | ecommerce purchase | Tracking conversions |

## Ressources

### Documentation officielle

- [Google Tag Manager](https://tagmanager.google.com/)
- [Consent Mode v2](https://support.google.com/tagmanager/answer/10718549)
- [GTM Best Practices](https://developers.google.com/tag-platform/tag-manager/best-practices)

### Outils

- [GTM Preview Mode](https://tagmanager.google.com/)
- [Google Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/)
- [dataLayer Inspector+](https://chrome.google.com/webstore/detail/datalayer-inspector/)

### Support

- 📧 contact@synapx.fr
- 💬 [Discord SynapxLab](https://discord.gg/synapxlab)
- 📚 [Documentation complète](../configuration.md)

## Conclusion

L'intégration de Google Tag Manager avec Cookie Consent garantit :

- ✅ **Conformité RGPD totale** : Pas de traceurs avant consentement
- ✅ **Blocage automatique** : Aucune configuration manuelle des scripts
- ✅ **Flexibilité** : Gérez tous vos tags depuis GTM
- ✅ **Performance** : Chargement asynchrone optimisé
- ✅ **Audit facilité** : Variables et déclencheurs centralisés

**Rappel important :** GTM est un outil puissant mais nécessite une configuration rigoureuse pour rester conforme. Testez toujours en mode aperçu avant de publier !

---

**Guide créé par SynapxLab**
**Dernière mise à jour : Janvier 2025**
**Compatible : GTM Web + Server-Side**