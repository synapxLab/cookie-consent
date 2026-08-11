# Système de Logging

## Vue d'ensemble

Le système de logging enregistre chaque consentement utilisateur pour garantir la conformité RGPD (Article 7.1 : "Le responsable du traitement doit être en mesure de démontrer que la personne concernée a consenti").

## Configuration

### Activation du logger

```javascript
window.CookieConsent.init({
  logger: {
    enabled: true,
    apiKey: 'sk-live-xxxxx',
    anonymousId: true,
    retries: 3,
    timeout: 5000,
    headers: {
      'Authorization': 'Bearer your-token'
    }
  }
});
```

### Options du logger

| Option | Type | Défaut | Description |
|--------|------|--------|-------------|
| `enabled` | boolean | false | Activer le logging |
| `endpoint` | string | '' | URL de l'API de logging |
| `apiKey` | string | null | Clé API (sk-live-xxx) |
| `anonymousId` | boolean | true | Générer un ID anonyme |
| `retries` | number | 3 | Nombre de tentatives en cas d'échec |
| `timeout` | number | 5000 | Timeout en ms |
| `headers` | object | {} | Headers HTTP personnalisés |

## Format des données

### Structure du payload

```json
{
  "consent_id": "550e8400-e29b-41d4-a716-446655440000",
  "device_id": "cc_7f3a9b2c1d4e5f6a",
  "site_path": "/products/shoes",
  "consent_action": "accept",
  "consent_method": "banner",
  "pref_cookies": true,
  "pref_statistics": true,
  "pref_marketing": false,
  "banner_version": "2.4.0",
  "locale": "fr-FR",
  "timezone": "Europe/Paris",
  "timestamp": "2025-01-15T14:30:00.000Z",
  "apiKey": "sk-live-xxxxx"
}
```

### Champs détaillés

#### Identifiants

- **consent_id** : UUID unique pour cet événement de consentement
- **device_id** : Identifiant anonyme de l'appareil (non réversible)
- **apiKey** : Votre clé API (pour routage vers votre compte)

#### Contexte

- **site_path** : Chemin de la page où le consentement a été donné
- **locale** : Langue du navigateur (ex: fr-FR, en-US)
- **timezone** : Fuseau horaire de l'utilisateur
- **banner_version** : Version de Cookie Consent utilisée

#### Consentement

- **consent_action** : Type d'action
  - `accept` : Tout accepter
  - `reject` : Tout refuser
  - `customize` : Personnalisation
  - `revoke` : Révocation
  
- **consent_method** : Méthode d'interaction
  - `banner` : Via la bannière initiale
  - `settings` : Via le lien de gestion

- **pref_cookies** : Cookies fonctionnels acceptés (boolean)
- **pref_statistics** : Cookies statistiques acceptés (boolean)
- **pref_marketing** : Cookies marketing acceptés (boolean)

## API de logging

### Endpoint

```
POST https://api.synapx.fr/
```

### Headers requis

```http
Content-Type: application/json
Authorization: Bearer sk-live-xxxxx
```

### Exemple de requête

```bash
curl -X POST https://api.synapx.fr/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-live-xxxxx" \
  -d '{
    "consent_id": "550e8400-e29b-41d4-a716-446655440000",
    "device_id": "cc_7f3a9b2c1d4e5f6a",
    "site_path": "/",
    "consent_action": "accept",
    "consent_method": "banner",
    "pref_cookies": true,
    "pref_statistics": true,
    "pref_marketing": false,
    "banner_version": "2.4.0",
    "locale": "fr-FR",
    "timezone": "Europe/Paris",
    "apiKey": "sk-live-xxxxx"
  }'
```

### Réponse

#### Succès (200)
```json
{
  "success": true,
  "consent_id": "550e8400-e29b-41d4-a716-446655440000",
  "logged_at": "2025-01-15T14:30:00.123Z"
}
```

#### Erreur (400/401/500)
```json
{
  "success": false,
  "error": "Invalid API key",
  "code": "AUTH_ERROR"
}
```

## Gestion des erreurs

### Stratégie de retry

Le logger tente automatiquement 3 fois (configurable) en cas d'échec :

```javascript
// Tentative 1 : immédiate
// Tentative 2 : après 1 seconde
// Tentative 3 : après 2 secondes
// Abandon après 3 échecs
```

### Comportement en cas d'échec

```javascript
document.addEventListener('cookieConsentChanged', (event) => {
  console.log('Logging réussi ?', event.detail.logged);
  
  if (!event.detail.logged) {
    // Le logging a échoué, mais les préférences sont quand même sauvegardées localement
    console.warn('Consentement enregistré localement uniquement');
  }
});
```

**Important** : Si le logging échoue, les préférences utilisateur sont **quand même sauvegardées** dans localStorage. Seul l'enregistrement serveur est manquant.

## Anonymisation & RGPD

### Device ID

Le `device_id` est généré de manière **anonyme et aléatoire** :

```javascript
// Génération (une seule fois par navigateur)
const generateDeviceId = () => {
  return 'cc_' + crypto.randomUUID();
};
// Résultat : cc_7f3a9b2c-1d4e-5f6a-8b9c-0d1e2f3a4b5c
```

**Caractéristiques** :
- ✅ Aléatoire (pas de fingerprint)
- ✅ Non réversible
- ✅ Ne contient aucune donnée personnelle
- ✅ Permet de lier plusieurs événements d'un même appareil
- ❌ Ne permet PAS d'identifier un individu

### Données NON collectées

- ❌ Adresse IP (ni brute ni hashée)
- ❌ User-Agent complet
- ❌ Fingerprint navigateur
- ❌ Canvas fingerprinting
- ❌ Nom, email, ou toute donnée personnelle

### Données collectées

- ✅ Choix de consentement (catégories acceptées/refusées)
- ✅ Horodatage
- ✅ Version de la bannière
- ✅ Langue et fuseau horaire (pour contexte)
- ✅ Chemin de la page (pas de query params sensibles)

## Dashboard & Analytics

### Accès aux logs

Connectez-vous sur [https://synapx.fr/sdk/cookie_consent/](https://synapx.fr/sdk/cookie_consent/)

### Statistiques disponibles

- 📊 Taux d'acceptation global
- 📊 Taux d'acceptation par catégorie
- 📊 Évolution dans le temps
- 📊 Répartition géographique (pays/fuseau horaire)
- 📊 Langues des utilisateurs

### Exports

Formats disponibles :
- **CSV** : Pour analyse dans Excel/Google Sheets
- **JSON** : Pour traitement programmatique
- **PDF** : Pour audits et rapports de conformité

```bash
# Exemple d'export CSV
Date,Consent ID,Action,Cookies,Statistics,Marketing
2025-01-15 14:30,550e8400...,accept,true,true,false
2025-01-15 14:35,661f9511...,reject,false,false,false
```

## Conformité légale

### Durée de conservation

**Recommandation CNIL** : 13 mois maximum

Notre implémentation :
- ✅ Expiration automatique après 13 mois
- ✅ Possibilité de réduire (ex: 6 mois)
- ✅ Purge automatique des logs expirés

### Droits des utilisateurs

#### Droit d'accès
```
Utilisateur : "Montrez-moi mes logs"
→ Export CSV/JSON de tous ses consentements
```

#### Droit à l'effacement
```
Utilisateur : "Supprimez mes logs"
→ Suppression de tous les logs liés à son device_id
```

#### Droit à la portabilité
```
Utilisateur : "Exportez mes données"
→ Export JSON structuré
```

### Preuve de consentement

En cas de contrôle CNIL ou contentieux :

```json
{
  "consent_id": "550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2025-01-15T14:30:00.000Z",
  "action": "accept",
  "preferences": {
    "cookies": true,
    "statistics": true,
    "marketing": false
  },
  "banner_version": "2.4.0",
  "proof_hash": "a7f2b9c1d4e5f6a8b9c0d1e2f3a4b5c6"
}
```

## Mode self-hosted

### Hébergement de votre propre API

Si vous ne souhaitez pas utiliser notre API :

```javascript
window.CookieConsent.init({
  logger: {
    enabled: true,
    endpoint: 'https://votre-api.com/consent/log',
    apiKey: 'votre-clé-interne',
    headers: {
      'X-Custom-Header': 'value'
    }
  }
});
```

### Exemple de serveur Node.js

```javascript
// server.js
const express = require('express');
const app = express();

app.post('/consent/log', express.json(), (req, res) => {
  const {
    consent_id,
    device_id,
    consent_action,
    pref_cookies,
    pref_statistics,
    pref_marketing  
  } = req.body;
  
  // Sauvegarder dans votre BDD
  db.saveConsent(req.body);
  
  res.json({
    success: true,
    consent_id,
    logged_at: new Date().toISOString()
  });
});

app.listen(3000);
```
### 🔑 Espace membre & Multi-sites

**💼 Solution multi-clients** : Idéale pour les agences web et développeurs freelances.

Connectez-vous sur [https://synapx.fr/sdk/cookie_consent/](https://synapx.fr/sdk/cookie_consent/) pour :

- **Gérer plusieurs sites** depuis un seul compte
- **Générer des clés API** dédiées par client/domaine
- **Auto-configurer le code JavaScript** pour chaque projet
  - Services pré-configurés (Analytics, Pixels, Chat...)
  - Configuration complète exportable
  - Gestion centralisée des logs de consentement

Chaque site client dispose de sa propre configuration isolée et sécurisée.

## 💰 Tarification

| Volume/mois | 0 - 300        |  301 - 10K  |  10K - 100K  |  100K - 500K |  500K - 1.5M |     1.5M+        |
|-------------|----------------|-------------|--------------|--------------|--------------|------------------|
| Prix        | **GRATUIT** 🎁 |    10€      |      25€     |      54€     |     99€      | [Nous contacter](mailto:contact@synapx.fr) |

**Facturation automatique** selon le volume mensuel réel.

## Désactivation du logging

Si vous souhaitez utiliser la bannière **sans logging** :

```javascript
// Option 1 : Ne pas configurer de logger
window.CookieConsent.init({
  statistics: {
    google_analytics_key: 'G-XXX'
  }
  // Pas de section "logger"
});

// Option 2 : Désactiver explicitement
window.CookieConsent.disableLogging();
```

**Impact** :
- ✅ Bannière fonctionne normalement
- ✅ Blocage des scripts tiers actif
- ❌ Pas de preuve de consentement serveur
- ❌ Non conforme Article 7.1 RGPD (sauf si vous loggez autrement)

## Support

Questions sur le logging ?
- 📧 contact@synapx.fr
- 📚 [FAQ](./faq.md)
- 🐛 [GitHub Issues](https://github.com/synapxLab/cookie-consent/issues)