# Conformité RGPD & CNIL

## Vue d'ensemble

Cookie Consent de SynapxLab est conçu pour être **conforme par défaut** aux exigences du RGPD et aux recommandations de la CNIL.

## Cadre légal applicable

### 🇪🇺 RGPD (Règlement Général sur la Protection des Données)

#### Article 4(11) - Définition du consentement
> Le consentement de la personne concernée est toute manifestation de volonté, libre, spécifique, éclairée et univoque.

**Notre implémentation :**
- ✅ **Libre** : Refus aussi simple que l'acceptation
- ✅ **Spécifique** : Catégories séparées (statistiques, marketing, fonctionnel)
- ✅ **Éclairé** : Description claire de chaque finalité
- ✅ **Univoque** : Action positive requise (pas de cases pré-cochées)

#### Article 6(1)(a) - Base légale
> Le traitement n'est licite que si la personne concernée a consenti au traitement.

**Notre implémentation :**
- ✅ Aucun script tiers ne se charge avant consentement
- ✅ Blocage automatique des traceurs détectés
- ✅ Gel des iframes et scripts externes

#### Article 7 - Conditions applicables au consentement
> Le responsable du traitement doit être en mesure de démontrer que la personne concernée a donné son consentement.

**Notre implémentation :**
- ✅ Journalisation horodatée de chaque consentement
- ✅ Enregistrement de la version de la politique
- ✅ Traçabilité des modifications (acceptation, refus, personnalisation)
- ✅ ID anonyme pour lier les événements sans identifier l'utilisateur

### 🇪🇺 Directive ePrivacy (2002/58/CE)

#### Article 5(3) - Confidentialité des communications
> L'utilisation de réseaux de communications électroniques pour stocker des informations ou accéder à des informations stockées dans l'équipement terminal d'un utilisateur n'est permise qu'à condition que l'utilisateur concerné ait donné son consentement.

**Notre implémentation :**
- ✅ Consentement préalable obligatoire
- ✅ Exception pour les cookies strictement nécessaires (authentification, panier)
- ✅ Blocage de tous les autres traceurs par défaut

### 🇫🇷 Loi Informatique et Libertés (Modifiée)

#### Article 82 - Traceurs et cookies
Transposition française de l'ePrivacy : renforce l'obligation de consentement et les sanctions.

**Notre implémentation :**
- ✅ Conformité totale aux recommandations CNIL 2020-2021
- ✅ Refus facilité (bouton "Tout refuser")
- ✅ Pas de "cookie wall" (accès au site même en cas de refus)

## Recommandations CNIL appliquées

### 📋 Lignes directrices CNIL (Juillet 2020, modifiées Mars 2021)

#### 1. Information claire et complète
**Exigence CNIL :**
> L'utilisateur doit être informé de l'identité des responsables de traitement, de la finalité des traceurs et de ses droits.

**Notre solution :**
- ✅ Catégories explicites : Fonctionnels, Statistiques, Marketing
- ✅ Description détaillée de chaque finalité
- ✅ Liste automatique des services configurés
- ✅ Détection et affichage des traceurs présents

#### 2. Refus aussi simple que l'acceptation
**Exigence CNIL :**
> Le refus doit être aussi simple que l'acceptation.

**Notre solution :**
- ✅ Bouton "Tout refuser" au même niveau que "Tout accepter"
- ✅ Même nombre de clics pour accepter ou refuser
- ✅ Pas de dark patterns (manipulation)

#### 3. Pas de traceur avant consentement
**Exigence CNIL :**
> Aucun traceur ne doit être déposé ou lu avant l'action positive de l'utilisateur.

**Notre solution :**
- ✅ **Bloqueur automatique de scripts tiers**
- ✅ MutationObserver pour bloquer les injections dynamiques
- ✅ Freeze/Release des scripts selon le consentement
- ✅ Détection intelligente par domaine et mots-clés

#### 4. Durée de conservation limitée
**Exigence CNIL :**
> La durée de validité du consentement ne doit pas excéder 13 mois.

**Notre solution :**
- ✅ Expiration par défaut : 6 mois (plus strict que la CNIL)
- ✅ Paramétrable : `expiration_months`
- ✅ Vérification automatique à chaque chargement
- ✅ Redemande automatique après expiration

#### 5. Preuve du consentement
**Exigence CNIL :**
> Le responsable doit pouvoir démontrer que l'utilisateur a consenti.

**Notre solution :**
- ✅ Logging avec horodatage précis
- ✅ Version de la bannière enregistrée
- ✅ Action tracée (accept/reject/customize)
- ✅ Device ID anonyme (pas d'IP, pas de fingerprint)
- ✅ Exports possibles (CSV, JSON)

## Architecture de conformité

### Flux de consentement

```
1. Chargement de la page
   ├─ Vérification localStorage
   │  ├─ Consentement valide ? → Appliquer préférences
   │  └─ Pas de consentement ou expiré ? → Afficher bannière
   │
2. Scan de la page
   ├─ Détection des scripts tiers (src matching)
   ├─ Freeze des scripts non autorisés (type="text/plain")
   └─ MutationObserver activé (SPA)
   │
3. Action utilisateur
   ├─ Tout accepter → Logger + Release tous les scripts
   ├─ Tout refuser → Logger + Garder blocage
   └─ Personnaliser → Logger + Release conditionnel
   │
4. Après consentement
   ├─ Sauvegarde localStorage (avec expiresAt)
   ├─ Event 'cookieConsentChanged' dispatché
   └─ Services activés selon les catégories consenties
```

### Données enregistrées (logging)

```json
{
  "consent_id": "550e8400-e29b-41d4-a716-446655440000",
  "device_id": "cc_anonyme_xyz",
  "site_path": "/",
  "consent_action": "accept",
  "consent_method": "banner",
  "pref_cookies": true,
  "pref_statistics": true,
  "pref_marketing": false,
  "banner_version": "2.4.0",
  "locale": "fr-FR",
  "timezone": "Europe/Paris",
  "timestamp": "2025-01-15T14:30:00Z"
}
```

**Anonymisation :**
- ❌ Pas d'adresse IP
- ❌ Pas de fingerprint navigateur
- ❌ Pas de données personnelles
- ✅ Device ID généré aléatoirement
- ✅ Non réversible vers une identité

## Sanctions en cas de non-conformité

### Amendes CNIL possibles

- ⚠️ **Niveau 1** : Jusqu'à **10 millions d'euros** ou **2% du CA mondial**
- 🔴 **Niveau 2** : Jusqu'à **20 millions d'euros** ou **4% du CA mondial**

### Exemples de condamnations

| Entreprise | Année | Amende | Motif |
|------------|-------|--------|-------|
| Google/Amazon | 2020 | 100M€ | Cookies sans consentement |
| TikTok | 2024 | 5M€ | Défaut d'information |
| Microsoft | 2022 | 60M€ | Refus non facilité |

## Droits des utilisateurs

### Droits RGPD respectés

- ✅ **Droit d'accès** : Voir ses données loggées
- ✅ **Droit de rectification** : Modifier son consentement
- ✅ **Droit d'opposition** : Refuser tout traitement
- ✅ **Droit à l'effacement** : Bouton "Supprimer mes préférences"
- ✅ **Droit à la portabilité** : Export des logs (CSV/JSON)

### Lien de gestion obligatoire

```html
<a href="#" id="openpolitecookie">Gérer mes cookies</a>
```

Ce lien doit être accessible depuis toutes les pages (footer recommandé).

## Checklist de conformité

### ✅ Avant le consentement
- [ ] Aucun script tiers chargé
- [ ] Bannière affichée au premier chargement
- [ ] Information claire sur les finalités
- [ ] Pas de cases pré-cochées
- [ ] Bouton "Tout refuser" visible

### ✅ Pendant le consentement
- [ ] Catégories séparées (fonctionnel, statistiques, marketing)
- [ ] Description de chaque catégorie
- [ ] Services listés automatiquement
- [ ] Action explicite requise

### ✅ Après le consentement
- [ ] Préférences sauvegardées (localStorage)
- [ ] Logging effectué (si activé)
- [ ] Scripts autorisés chargés
- [ ] Event 'cookieConsentChanged' dispatché
- [ ] Lien de gestion accessible
- [ ] Expiration programmée (max 6 mois)

### ✅ Gestion continue
- [ ] Possibilité de modifier son choix à tout moment
- [ ] Redemande automatique après expiration
- [ ] Logs consultables et exportables
- [ ] Documentation accessible

## Responsabilités légales

### Rôle de SynapxLab

**En tant qu'éditeur du logiciel :**
- ✅ Fournit un outil conforme par conception
- ✅ Maintient la conformité aux évolutions légales
- ✅ Documente les bonnes pratiques
- ❌ N'est PAS responsable du traitement des données

### Rôle de l'utilisateur (vous)

**En tant que responsable de traitement :**
- ✅ Configurer correctement la bannière
- ✅ Respecter les consentements utilisateurs
- ✅ Tenir un registre des traitements
- ✅ Nommer un DPO si nécessaire
- ✅ Répondre aux demandes d'exercice de droits

## Bonnes pratiques

### ✅ À FAIRE

1. **Activer le logging**
```javascript
window.CookieConsent.init({
  logger: {
    enabled: true,
    apiKey: 'votre-clé'
  }
});
```

2. **Ne pas charger de scripts avant consentement**
```html
<!-- ❌ FAUX -->
<script src="https://www.googletagmanager.com/gtag/js"></script>

<!-- ✅ CORRECT -->
<!-- Le script sera bloqué automatiquement par Cookie Consent -->
```

3. **Mettre un lien de gestion visible**
```html
<footer>
  <a href="#" id="openpolitecookie">Gérer mes cookies</a>
</footer>
```

4. **Respecter les préférences dans votre code custom**
```javascript
document.addEventListener('cookieConsentChanged', (event) => {
  if (event.detail.preferences.statistics) {
    // Votre code analytics personnalisé
  }
});
```

### ❌ À ÉVITER

1. **Cookie walls** (bloquer l'accès au site)
2. **Cases pré-cochées**
3. **Refus plus complexe que l'acceptation**
4. **Durée de validité > 13 mois**
5. **Rechargement automatique du consentement à chaque visite**

## Ressources officielles

### 📚 Textes légaux
- [RGPD - Texte officiel](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- [Directive ePrivacy](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A32002L0058)
- [Loi Informatique et Libertés](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000886460/)

### 📋 Recommandations CNIL
- [Cookies et traceurs](https://www.cnil.fr/fr/cookies-et-autres-traceurs)
- [Lignes directrices](https://www.cnil.fr/fr/lignes-directrices-cookies-et-autres-traceurs)
- [Questions/réponses](https://www.cnil.fr/fr/cookies-solutions-pour-les-outils-de-mesure-daudience)

### 🛠️ Outils CNIL
- [Cookieviz](https://www.cnil.fr/fr/cookieviz-une-application-pour-visualiser-les-cookies)
- [Mon périmètre RGPD](https://www.cnil.fr/fr/mon-perimetre-rgpd)

## Support & Conseil

### Besoin d'aide ?

**Questions techniques :**
- 📧 contact@synapx.fr
- 🐛 [GitHub Issues](https://github.com/synapxLab/cookie-consent/issues)

**Questions juridiques :**
> ⚠️ SynapxLab n'est pas un cabinet d'avocats. Pour des conseils juridiques personnalisés, consultez :
> - Votre DPO (Délégué à la Protection des Données)
> - Un avocat spécialisé en droit numérique
> - La CNIL directement

### Audit de conformité

Pour un audit complet de votre site :
1. Contactez un consultant RGPD certifié
2. Utilisez les outils de la CNIL
3. Vérifiez cette checklist

## Conclusion

Cookie Consent de SynapxLab vous fournit **tous les outils techniques** pour être conforme au RGPD et aux recommandations CNIL. Cependant, la conformité légale est une **responsabilité partagée** :

- 🛠️ **SynapxLab** : Fournit la technologie conforme
- ⚖️ **Vous** : Utilisez correctement l'outil et respectez vos obligations légales

**En cas de doute, consultez toujours un professionnel du droit.**