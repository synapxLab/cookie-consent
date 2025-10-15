# FAQ - Questions Fréquentes

## Général

### Est-ce que Cookie Consent est gratuit ?

**Oui !** La bannière est **100% gratuite et open source** (licence MIT).

Le logging des consentements est :
- **Gratuit** jusqu'à 300 consentements/mois
- **Payant** au-delà (à partir de 10€/mois pour 10K consentements)

### Quelle est la différence avec Axeptio/Cookiebot ?

| Fonctionnalité | Cookie Consent | Axeptio | Cookiebot |
|---------------|----------------|---------|-----------|
| **Prix** | Gratuit | 50€/mois | 9€/mois |
| **Open Source** | ✅ | ❌ | ❌ |
| **Blocage auto scripts** | ✅ | ✅ | ✅ |
| **Made in France** | ✅ | ✅ | ❌ (Danemark) |
| **Self-hosted possible** | ✅ | ❌ | ❌ |
| **Personnalisation CSS** | ✅ Illimitée | ⚠️ Limitée | ⚠️ Limitée |

### C'est conforme RGPD/CNIL ?

**Oui, à 100%** si vous l'utilisez correctement :
- ✅ Consentement préalable
- ✅ Refus aussi simple que l'acceptation
- ✅ Pas de cookie avant consentement
- ✅ Durée limitée (6 mois par défaut)
- ✅ Logging des consentements

Voir [Documentation Conformité RGPD](./compliance-cnil.md)

### Puis-je utiliser sans le logging ?

**Oui**, mais attention :
- ✅ La bannière fonctionne parfaitement
- ✅ Le blocage des scripts est actif
- ⚠️ **Pas de preuve de consentement** (Article 7.1 RGPD)

**Recommandation** : Activez le logging (gratuit jusqu'à 300/mois) pour être en règle.

## Installation & Configuration

### Comment installer sur un site HTML statique ?

Très simple :

```html
<script src="https://unpkg.com/@synapxlab/cookie-consent/dist/cookie.js"></script>
```

Voir [Guide Vanilla JS](./integrations/vanilla.md)

### Comment installer sur WordPress ?

1. Extensions > Ajouter
2. Rechercher "SynapxLab Cookie Consent"
3. Installer et activer

Voir [Guide WordPress](./integrations/wordpress.md)

### Comment installer sur React/Vue/Next.js ?

Via npm :

```bash
npm install @synapxlab/cookie-consent
```

Puis dans votre `main.js` ou `app.js` :

```javascript
import '@synapxlab/cookie-consent';
```

### Dois-je configurer quelque chose ?

**Non !** La bannière fonctionne sans configuration.

Pour activer des services (Google Analytics, etc.), utilisez `init()` :

```javascript
window.CookieConsent.init({
  statistics: {
    google_analytics_key: 'G-XXXXXXXXX'
  }
});
```

Voir [Configuration complète](./configuration.md)

### Comment obtenir une clé API pour le logging ?

1. Créer un compte sur [synapx.fr](https://synapx.fr/OAuth/)
2. Aller dans **SDK > Cookie Consent**
3. Copier votre clé API (commence par `sk-live-`)

## Fonctionnement

### Comment fonctionne le blocage automatique ?

Cookie Consent utilise 3 mécanismes :

1. **Scan initial** : Détecte tous les `<script src>` et `<iframe src>` au chargement
2. **Freeze** : Transforme les scripts détectés en `type="text/plain"` (bloqué)
3. **MutationObserver** : Surveille les injections dynamiques (SPA, GTM)

Voir [Documentation technique](./configuration.md#blocage-automatique)

### Quels services sont détectés automatiquement ?

**Services supportés par défaut :**

**Statistiques :**
- Google Analytics (GA4, Universal)
- Google Tag Manager
- Matomo
- Hotjar
- Microsoft Clarity
- Mixpanel
- Amplitude
- Plausible

**Marketing :**
- Google AdSense
- Facebook Pixel
- TikTok Pixel
- LinkedIn Insight
- DoubleClick

**Fonctionnels :**
- Intercom
- Crisp Chat
- HubSpot
- Segment
- Zendesk

### Et si mon service n'est pas dans la liste ?

Le système détecte automatiquement les domaines tiers. Si un service n'est pas listé, il sera quand même bloqué s'il correspond aux patterns (domaines externes).

Vous pouvez aussi l'ajouter manuellement en modifiant `CATEGORY_MATCHERS` dans le code source.

### Pourquoi ma bannière ne s'affiche pas ?

**Causes possibles :**

1. **Consentement déjà donné**
   ```javascript
   // Vérifier
   console.log(localStorage.getItem('politecookiebanner'));
   
   // Effacer
   localStorage.removeItem('politecookiebanner');
   location.reload();
   ```

2. **Erreur JavaScript**
   - Ouvrir la console (F12)
   - Vérifier les erreurs en rouge

3. **Script pas chargé**
   ```javascript
   // Vérifier
   console.log(window.CookieConsent);
   // Doit afficher un objet
   ```

4. **Conflit CSS**
   - Votre CSS masque peut-être la bannière
   - Inspecter l'élément `#politecookiebanner`

### Comment tester la bannière ?

```javascript
// Méthode 1 : Reset complet
localStorage.removeItem('politecookiebanner');
location.reload();

// Méthode 2 : Ouvrir manuellement
window.CookieConsent.open();

// Méthode 3 : Reset et ouvrir
window.CookieConsent.reset();
```

## Personnalisation

### Comment changer les couleurs ?

Via CSS :

```css
:root {
  --cc-bg: #ffffff;        /* Fond */
  --cc-text: #111827;      /* Texte */
  --cc-accent: #e63946;    /* Couleur principale */
  --cc-border: #e5e7eb;    /* Bordures */
}
```

Voir [Personnalisation CSS](./configuration.md#personnalisation-css)

### Comment changer les textes ?

Les textes sont automatiquement traduits en 7 langues (FR, EN, ES, DE, IT, NL, PT).

Pour personnaliser :

```javascript
import t from '@synapxlab/cookie-consent/translat';

t.add('fr', {
  title: "Mon titre personnalisé",
  message: "Mon message...",
  acceptAll: "J'accepte"
});
```

### Comment ajouter une langue ?

```javascript
import t from '@synapxlab/cookie-consent/translat';

t.add('ja', {
  title: "クッキー同意",
  message: "...",
  acceptAll: "すべて受け入れる",
  denyAll: "すべて拒否",
  // ... voir translat.js pour toutes les clés
});

t.setLocale('ja');
```

Voir [Internationalisation](./integrations/i18n.md)

### Puis-je modifier le HTML de la bannière ?

Oui, mais nécessite de forker le projet et modifier `cookie.js`.

**Alternative recommandée** : Utiliser les variables CSS pour adapter le style sans toucher au HTML.

## Logging & Conformité

### Où sont stockés les logs ?

**Sans logging activé :**
- Uniquement en local (localStorage du navigateur)
- Pas de serveur distant

**Avec logging activé :**
- Serveurs OVH en France (RGPD natif)
- Base de données sécurisée
- Accès via dashboard SynapxLab

### Quelles données sont loggées ?

```json
{
  "consent_id": "uuid",
  "device_id": "cc_anonyme",
  "consent_action": "accept",
  "pref_statistics": true,
  "banner_version": "2.4.0",
  "locale": "fr-FR",
  "timezone": "Europe/Paris"
}
```

**Données NON collectées :**
- ❌ Adresse IP
- ❌ Nom, email
- ❌ Fingerprint navigateur
- ❌ Données personnelles

Voir [Documentation Logging](./logger.md)

### Comment exporter mes logs ?

Dashboard SynapxLab > Cookie Consent > Exporter

Formats disponibles :
- CSV (Excel)
- JSON (API)
- PDF (Audit)

### Combien de temps sont conservés les logs ?

**Par défaut : 13 mois** (maximum recommandé CNIL)

Vous pouvez réduire à 6 ou 12 mois dans les paramètres.

### Comment prouver la conformité RGPD ?

1. **Activer le logging** (preuve de consentement)
2. **Exporter les logs** régulièrement
3. **Documenter** votre configuration
4. **Tenir un registre** des traitements (obligation RGPD)

En cas de contrôle CNIL, vous pourrez fournir :
- ✅ Les logs horodatés des consentements
- ✅ La version de la bannière utilisée
- ✅ La configuration des services
- ✅ Les exports CSV/PDF

## Performance

### Quel est l'impact sur la vitesse du site ?

**Très faible :**
- Taille du script : ~25Ko (gzippé)
- Chargement asynchrone (pas de blocage)
- Pas de dépendances externes

**Impact Lighthouse :**
- Performance : 0 à -2 points
- Best Practices : +10 points (conformité)

### Le script bloque-t-il le rendering ?

**Non**, si chargé correctement :

```html
<!-- ✅ CORRECT : Pas de blocage -->
<script src="cookie.js" defer></script>

<!-- ❌ ÉVITER : Bloque le parsing -->
<script src="cookie.js"></script>
```

### Compatible avec WP Rocket / Autoptimize ?

**Oui**, mais exclure cookie.js de l'agrégation :

**WP Rocket :**
Réglages > Fichiers JavaScript > Exclure :
```
/cookie.js
```

**Autoptimize :**
Réglages > JavaScript > Exclure :
```
cookie.js
```

## Intégrations

### Compatible avec Google Tag Manager ?

**Oui !** GTM est même l'une des meilleures intégrations.

Le système bloque les tags GTM jusqu'au consentement, puis les active conditionnellement.

Voir [Guide Google Tag Manager](./integrations/tag-manager.md)

### Compatible avec WordPress ?

**Oui !** Plugin officiel disponible :

WordPress Admin > Extensions > Ajouter > "SynapxLab Cookie Consent"

Voir [Guide WordPress](./integrations/wordpress.md)

### Compatible avec PrestaShop ?

**Oui !** Module en cours de finalisation (bêta disponible).

### Compatible avec Shopify ?

Oui, via intégration manuelle (pas encore d'app officielle).

### Compatible avec React/Vue/Angular/Svelte ?

**Oui, tous !**

```bash
npm install @synapxlab/cookie-consent
```

```javascript
// Dans votre main.js
import '@synapxlab/cookie-consent';
```

### Compatible avec Next.js ?

**Oui !** Ajouter dans `_app.js` :

```javascript
import '@synapxlab/cookie-consent';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

## Développement

### Puis-je contribuer au projet ?

**Oui !** Le projet est open source (MIT License).

- 🐛 Signaler des bugs : [GitHub Issues](https://github.com/synapxLab/cookie-consent/issues)
- 💻 Proposer du code : [Pull Requests](https://github.com/synapxLab/cookie-consent/pulls)
- 💬 Rejoindre la communauté : [Discord](https://discord.gg/synapxlab)

### Comment compiler depuis les sources ?

```bash
git clone https://github.com/synapxLab/cookie-consent.git
cd cookie-consent
npm install
npm run build
```

Le fichier compilé sera dans `/dist/cookie.js`.

### Où trouver le code source ?

- **GitHub** : [github.com/synapxLab/cookie-consent](https://github.com/synapxLab/cookie-consent)
- **npm** : [npmjs.com/package/@synapxlab/cookie-consent](https://www.npmjs.com/package/@synapxlab/cookie-consent)

### Comment signaler un bug ?

1. Vérifier qu'il n'existe pas déjà : [Issues GitHub](https://github.com/synapxLab/cookie-consent/issues)
2. Créer une nouvelle issue avec :
   - Description du problème
   - Étapes pour reproduire
   - Navigateur et version
   - Console logs si possible

## Juridique

### Qui est responsable en cas de non-conformité ?

**Vous**, en tant que responsable du traitement.

SynapxLab fournit l'outil, mais vous êtes responsable de :
- Configurer correctement la bannière
- Respecter les consentements
- Tenir un registre des traitements
- Répondre aux demandes RGPD

Voir [Responsabilités légales](./compliance-cnil.md#responsabilités)

### Dois-je quand même consulter un avocat ?

**Oui, c'est recommandé**, surtout si :
- Vous traitez des données sensibles
- Vous avez un trafic important (>100K visiteurs/mois)
- Vous faites du profilage/ciblage
- Vous êtes dans un secteur réglementé (santé, finance, etc.)

Cookie Consent vous aide techniquement, mais ne remplace pas un conseil juridique.

### Puis-je utiliser pour un site commercial ?

**Oui !** Licence MIT = usage commercial autorisé.

Vous pouvez :
- ✅ L'utiliser gratuitement
- ✅ Sur des sites commerciaux
- ✅ Pour des clients
- ✅ Le modifier

Obligation : Conserver la mention de licence MIT.

### Puis-je revendre le plugin ?

**Techniquement oui** (licence MIT), mais :
- ❌ Pas éthique sans contribuer au projet
- ⚠️ Vous devez maintenir à jour
- ⚠️ Vous devez fournir support

**Alternative recommandée** : Devenir partenaire SynapxLab (contactez-nous).

## Support

### Où trouver de l'aide ?

**Documentation :**
- 📚 [Documentation complète](https://synapx.fr/sdk/cookie_consent/)
- 🎓 [Guides d'intégration](./integrations/)

**Communauté :**
- 💬 [Discord SynapxLab](https://discord.gg/synapxlab)
- 🐛 [GitHub Issues](https://github.com/synapxLab/cookie-consent/issues)

**Support direct :**
- 📧 contact@synapx.fr
- ⏱️ Délai de réponse : 24-48h

### Le support est-il gratuit ?

**Oui !** Pour :
- Questions générales
- Bugs
- Suggestions d'amélioration

**Support premium disponible** pour :
- Configuration personnalisée
- Intégration sur mesure
- Audit de conformité
- SLA garanti

Contactez-nous : contact@synapx.fr

### Proposez-vous des formations ?

Pas encore, mais c'est prévu !

En attendant :
- 📚 Documentation complète disponible
- 🎥 Tutoriels vidéo en préparation
- 💬 Rejoignez notre Discord pour des conseils

## Tarification

### Quel est le prix ?

**Bannière : GRATUIT** (open source)

**Logging :**
| Volume/mois | Prix HT |
|-------------|---------|
| 0 - 300 | **Gratuit** 🎁 |
| 301 - 10K | 10€ |
| 10K - 100K | 25€ |
| 100K - 500K | 54€ |
| 500K - 1.5M | 99€ |
| +1.5M | 199€ |

**Facturation automatique** selon le volume mensuel.

### Comment est calculé le volume ?

**1 consentement = 1 action enregistrée**

Exemples d'actions :
- Accepter tout
- Refuser tout
- Personnaliser
- Modifier ses préférences

**Exemple :**
- 10 000 visiteurs uniques/mois
- 30% acceptent = 3 000 consentements
- 20% refusent = 2 000 consentements
- Total : 5 000 consentements → **Forfait 10€/mois**

### Y a-t-il des frais cachés ?

**Non, aucun !**

- ✅ Bannière gratuite
- ✅ Pas de limite de pages vues
- ✅ Pas de limite de domaines
- ✅ Tous les services inclus
- ✅ Support gratuit

Seul le logging au-delà de 300/mois est payant.

### Puis-je changer de forfait ?

**Oui, automatiquement !**

Le forfait s'ajuste chaque mois selon votre volume réel.

Mois 1 : 500 consentements → 10€
Mois 2 : 15 000 consentements → 25€
Mois 3 : 200 consentements → 0€ (gratuit)

### Comment payer ?

- 💳 Carte bancaire (Stripe)
- 🏦 Virement (sur demande pour +500€/an)
- 📄 Facture automatique

Dashboard SynapxLab > Facturation

## Autres questions

### Une question non listée ici ?

**Contactez-nous :**
- 📧 contact@synapx.fr
- 💬 [Discord](https://discord.gg/synapxlab)
- 🐛 [GitHub Issues](https://github.com/synapxLab/cookie-consent/issues)

**Contribuez à cette FAQ :**
Proposez votre question via une Pull Request sur GitHub !

---

**Dernière mise à jour : Janvier 2025**