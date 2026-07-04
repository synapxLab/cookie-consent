# Google Consent Mode v2

## 🎯 Qu'est-ce que Google Consent Mode v2 ?

**Google Consent Mode v2** est le nouveau standard de Google pour gérer le consentement des utilisateurs de manière compatible avec le RGPD. Il permet à Google Analytics, Google Ads et Google Tag Manager de continuer à collecter des **données agrégées et anonymisées** même lorsque l'utilisateur refuse les cookies, tout en respectant son choix.

### Avantages principaux

✅ **Conforme RGPD** - Respecte les choix de l'utilisateur  
✅ **Meilleure qualité de données** - Collecte agrégée sans consentement  
✅ **Conversion tracking amélioré** - Suivi des conversions même sans cookies  
✅ **Obligatoire pour Google Ads** - Requis depuis mars 2024 en Europe  
✅ **Aucune configuration nécessaire** - Activé automatiquement

---

## 🚀 Intégration native dans Cookie Consent

Cookie Consent **v2.5.0** intègre nativement Google Consent Mode v2. Aucune configuration supplémentaire n'est nécessaire, le module fonctionne automatiquement dès que vous utilisez Google Analytics ou Google Tag Manager.

### Installation basique (GCM activé par défaut)

```javascript
import '@synapxlab/cookie-consent';

window.CookieConsent.init({
  statistics: {
    google_analytics_key: 'G-XXXXXXXXX'
  }
  // Google Consent Mode v2 est automatiquement actif !
});
```

**C'est tout !** Google Consent Mode v2 est maintenant opérationnel sur votre site.

---

## ⚙️ Configuration avancée

### Personnaliser les paramètres GCM

```javascript
window.CookieConsent.init({
  google_consent_mode: {
    enabled: true,                // Activer/désactiver GCM
    wait_for_update: 500,         // Délai d'attente (ms)
    ads_data_redaction: true,     // Masquer les données pub si refusé
    url_passthrough: false,       // Passer les paramètres URL entre domaines
    region: ['US-CA', 'EU']       // Appliquer uniquement dans certaines régions
  },
  statistics: {
    google_analytics_key: 'G-XXXXXXXXX',
    google_tag_manager_key: 'GTM-XXXXXX'
  }
});
```

### Paramètres disponibles

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `enabled` | Boolean | `true` | Active ou désactive Google Consent Mode v2 |
| `wait_for_update` | Number | `500` | Temps d'attente maximum (ms) avant timeout |
| `ads_data_redaction` | Boolean | `true` | Masque les données publicitaires si consentement refusé |
| `url_passthrough` | Boolean | `false` | Permet de passer les paramètres URL entre domaines |
| `region` | Array | `[]` | Liste des régions où appliquer GCM (ex: `['EU', 'US-CA']`) |

---

## 🔄 Comment ça fonctionne ?

### 1. État initial (avant consentement)

Lorsque l'utilisateur arrive sur le site, **avant** qu'il n'ait fait son choix, Google Consent Mode est en mode **"denied"** par défaut :

```javascript
{
  'ad_storage': 'denied',              // Cookies publicitaires
  'ad_user_data': 'denied',            // Données utilisateur pub
  'ad_personalization': 'denied',      // Personnalisation pub
  'analytics_storage': 'denied',       // Cookies analytics
  'functionality_storage': 'denied',   // Cookies fonctionnels
  'personalization_storage': 'denied', // Cookies personnalisation
  'security_storage': 'granted'        // Cookies sécurité (toujours autorisé)
}
```

À ce stade, Google peut quand même collecter des **données agrégées anonymes** (mode "ping").

### 2. Après consentement

Lorsque l'utilisateur accepte ou refuse, les signaux sont mis à jour automatiquement :

**Si l'utilisateur accepte les statistiques :**
```javascript
{
  'analytics_storage': 'granted',      // ✅ Autorisé
  'ad_storage': 'denied',              // ❌ Toujours refusé
  // ...
}
```

**Si l'utilisateur accepte tout :**
```javascript
{
  'ad_storage': 'granted',             // ✅ Autorisé
  'analytics_storage': 'granted',      // ✅ Autorisé
  'functionality_storage': 'granted',  // ✅ Autorisé
  // ...
}
```

### 3. Mapping automatique

Cookie Consent fait le mapping automatiquement entre vos catégories et les signaux Google :

| Catégorie Cookie Consent | Signaux Google Consent Mode |
|--------------------------|------------------------------|
| **statistics** (Statistiques) | `analytics_storage` |
| **marketing** (Publicité) | `ad_storage`, `ad_user_data`, `ad_personalization` |
| **cookies** (Fonctionnels) | `functionality_storage`, `personalization_storage` |
| *(Toujours actif)* | `security_storage` |

---

## 📊 Vérifier que GCM fonctionne

### 1. Dans la console JavaScript

```javascript
// Vérifier l'état actuel du consentement
console.log(window.CookieConsent.getGoogleConsent());

// Résultat attendu :
// {
//   ad_storage: "denied",
//   analytics_storage: "granted",
//   ...
// }
```

### 2. Dans le dataLayer

```javascript
// Voir tous les événements de consentement
console.log(window.dataLayer);

// Devrait contenir des événements de type "consent"
```

### 3. Avec Google Tag Assistant

1. Installer l'extension [Google Tag Assistant](https://tagassistant.google.com/)
2. Activer sur votre site
3. Vérifier :
   - ✅ "Consent Mode detected" = OUI
   - ✅ "Default consent state" = denied
   - ✅ "Consent updated" = Après acceptation

### 4. Dans Chrome DevTools

**Application > Cookies**
- Les cookies Google devraient respecter l'état du consentement
- Pas de cookies analytics si consentement refusé

---

## 🎛️ API JavaScript

### Récupérer l'état du consentement

```javascript
const consent = window.CookieConsent.getGoogleConsent();
console.log(consent);
// {
//   ad_storage: "denied",
//   analytics_storage: "granted",
//   ...
// }
```

### Mettre à jour manuellement

```javascript
window.CookieConsent.updateGoogleConsent({
  'analytics_storage': 'granted',
  'ad_storage': 'denied'
});
```

### Écouter les changements

```javascript
document.addEventListener('googleConsentUpdated', (event) => {
  console.log('Consentement mis à jour:', event.detail);
  // {
  //   consent: { ad_storage: "granted", ... },
  //   preferences: { statistics: true, marketing: true },
  //   timestamp: 1234567890
  // }
});
```

### Désactiver GCM temporairement

```javascript
window.CookieConsent.init({
  google_consent_mode: false,
  statistics: {
    google_analytics_key: 'G-XXXXXXXXX'
  }
});
```

---

## 🔧 Cas d'usage avancés

### Appliquer GCM uniquement en Europe

```javascript
window.CookieConsent.init({
  google_consent_mode: {
    enabled: true,
    region: ['EU', 'GB'] // UK inclus
  }
});
```

### Augmenter le délai d'attente

Utile si votre site charge lentement :

```javascript
window.CookieConsent.init({
  google_consent_mode: {
    wait_for_update: 2000 // 2 secondes au lieu de 500ms
  }
});
```

### Mode strict (masquer toutes les données pub)

```javascript
window.CookieConsent.init({
  google_consent_mode: {
    ads_data_redaction: true,
    url_passthrough: false
  }
});
```

### Passer les paramètres entre domaines

Pour les sites multi-domaines (ex: checkout externe) :

```javascript
window.CookieConsent.init({
  google_consent_mode: {
    url_passthrough: true
  }
});
```

---

## 🆚 Comparaison : Avec et sans GCM v2

| Fonctionnalité | Sans GCM v2 | Avec GCM v2 |
|----------------|-------------|-------------|
| **Cookies refusés** | ❌ Aucune donnée collectée | ✅ Données agrégées anonymes |
| **Conversions** | ❌ Non trackées sans cookies | ✅ Modélisation des conversions |
| **Qualité des données** | ⚠️ Lacunes importantes | ✅ Meilleure couverture |
| **Google Ads (EU)** | ❌ Non conforme (depuis mars 2024) | ✅ Conforme |
| **RGPD** | ⚠️ Perte de données | ✅ Conforme + données agrégées |

---

## 📋 Conformité RGPD & CNIL

### Google Consent Mode v2 est-il conforme RGPD ?

**Oui**, car :
- ✅ Le consentement de l'utilisateur est respecté
- ✅ Aucun cookie n'est déposé sans consentement
- ✅ Les données collectées en mode "ping" sont **anonymes et agrégées**
- ✅ Impossible d'identifier un utilisateur individuel

### Que se passe-t-il si l'utilisateur refuse ?

1. **Aucun cookie** Google Analytics/Ads n'est déposé
2. Les scripts **ne sont pas chargés** (blocage automatique)
3. Google reçoit uniquement un **signal anonyme** indiquant le refus
4. Des **statistiques agrégées** sont collectées (sans identification)

### Dois-je mentionner GCM dans ma politique de confidentialité ?

**Oui**, il est recommandé d'ajouter :

> *"Nous utilisons Google Consent Mode v2 pour améliorer la qualité de nos statistiques tout en respectant votre vie privée. Même si vous refusez les cookies, des données agrégées et anonymisées peuvent être collectées par Google, sans possibilité de vous identifier individuellement."*

---

## ❓ FAQ

### Est-ce obligatoire ?

**Non**, mais **fortement recommandé** car :
- ✅ Obligatoire pour Google Ads en Europe depuis mars 2024
- ✅ Améliore significativement la qualité des données
- ✅ Permet le tracking des conversions même sans cookies

### Ça marche avec GTM ?

**Oui !** Google Tag Manager hérite automatiquement des signaux de consentement. Tous vos tags GTM respecteront l'état du consentement.

### Et avec GA4 ?

**Oui !** Google Analytics 4 est pleinement compatible. Les événements sont envoyés selon l'état du consentement.

### Puis-je utiliser GCM sans Cookie Consent ?

Techniquement oui, mais vous perdez :
- ❌ Le blocage automatique des scripts
- ❌ La gestion des préférences utilisateur
- ❌ Le registre de consentement RGPD
- ❌ L'interface utilisateur

### Ça fonctionne en SSR (Next.js, Nuxt, etc.) ?

**Oui !** Le module détecte automatiquement l'environnement serveur et se désactive proprement. GCM ne fonctionne que côté client (browser).

### Comment désactiver GCM ?

```javascript
window.CookieConsent.init({
  google_consent_mode: false
});
```

### GCM ralentit-il mon site ?

**Non**. L'impact est négligeable (~1-2ms). Le code est optimisé et chargé de manière asynchrone.

---

## 🛠️ Dépannage

### "Google Consent Mode non détecté" dans Tag Assistant

**Causes possibles :**
1. GCM désactivé dans la config
2. Google Analytics/GTM pas configuré
3. Scripts bloqués par un ad-blocker

**Solution :**
```javascript
// Vérifier que GCM est activé
console.log(window.CookieConsent.getConfig().google_consent_mode);
// Devrait afficher : { enabled: true, ... }
```

### Les cookies Google s'installent quand même

**Causes possibles :**
1. Scripts chargés avant Cookie Consent
2. Configuration Google Analytics incorrecte

**Solution :**
Assurez-vous que Cookie Consent est chargé **AVANT** tout script Google :

```html
<!-- ✅ BON : Cookie Consent en premier -->
<script src="cookie-consent.js"></script>
<script>
  window.CookieConsent.init({ /* ... */ });
</script>

<!-- ❌ MAUVAIS : GA chargé avant -->
<script src="https://www.googletagmanager.com/gtag/js?id=G-XXX"></script>
<script src="cookie-consent.js"></script>
```

### Le dataLayer est vide

**Cause :** GCM pas initialisé.

**Solution :**
```javascript
// Forcer l'initialisation
window.CookieConsent.init({
  google_consent_mode: { enabled: true }
});
```

### Erreur "gtag is not a function"

**Cause :** Google Analytics pas encore chargé.

**Solution :** C'est normal ! GCM s'initialise avant GA. Le signal sera envoyé dès que GA sera chargé.

---

## 📚 Ressources

### Documentation officielle Google
- [Guide Google Consent Mode v2](https://support.google.com/analytics/answer/9976101)
- [Implémentation pour développeurs](https://developers.google.com/tag-platform/security/guides/consent)
- [FAQ Google Consent Mode](https://support.google.com/analytics/answer/9976101)

### Documentation CNIL
- [Cookies et traceurs](https://www.cnil.fr/fr/cookies-et-autres-traceurs)
- [Solutions pour les outils de mesure](https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience)

### Outils de validation
- [Google Tag Assistant](https://tagassistant.google.com/)
- [Consent Mode Checker](https://consent-mode-checker.web.app/)

---

## 🎓 Aller plus loin

### Formation vidéo (bientôt disponible)
- 📹 Comment configurer Google Consent Mode v2
- 📹 Vérifier la conformité RGPD
- 📹 Optimiser les conversions avec GCM

### Support
- 📧 Email : contact@synapx.fr
- 🐛 [GitHub Issues](https://github.com/synapxLab/cookie-consent/issues)
- 💬 [Discord communauté](https://discord.gg/synapxlab) *(bientôt)*

---

## ✅ En résumé

**Google Consent Mode v2 est :**
- ✅ Natif dans Cookie Consent (depuis v2.5.0)
- ✅ Activé par défaut (aucune config nécessaire)
- ✅ 100% conforme RGPD
- ✅ Compatible GA4, GTM, Google Ads
- ✅ Améliore la qualité des données
- ✅ Obligatoire pour Google Ads (EU)

**Vous n'avez rien à faire, ça marche automatiquement !** 🎉

---

*Dernière mise à jour : Janvier 2025*