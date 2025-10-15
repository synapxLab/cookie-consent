# Intégration PrestaShop

## Vue d'ensemble

Le module **SynapxLab Cookie Consent** pour PrestaShop permet une intégration native du système de gestion des cookies conforme RGPD/CNIL dans votre boutique e-commerce.

## Prérequis

- PrestaShop 1.7.x ou 8.x
- PHP 7.4 minimum (8.0+ recommandé)
- Accès administrateur au back-office

## Installation

### Méthode 1 : Via PrestaShop Addons (recommandé)

1. **Accéder à PrestaShop Addons**
   - Connectez-vous à [addons.prestashop.com](https://addons.prestashop.com/)
   - Recherchez "SynapxLab Cookie Consent"

2. **Télécharger le module**
   - Cliquez sur "Ajouter au panier"
   - Procédez au paiement (gratuit)
   - Téléchargez le fichier ZIP

3. **Installer dans PrestaShop**
   - Back-office > Modules > Module Manager
   - Cliquez sur "Envoyer un module"
   - Sélectionnez le fichier ZIP
   - Cliquez sur "Installer"

### Méthode 2 : Installation manuelle

1. **Télécharger le module**
   ```bash
   wget https://github.com/synapxLab/prestashop-cookie-consent/releases/latest/download/synapxlab-cookie-consent.zip
   ```

2. **Décompresser**
   ```bash
   unzip synapxlab-cookie-consent.zip -d modules/
   ```

3. **Installer via back-office**
   - Modules > Module Manager
   - Rechercher "Cookie Consent"
   - Cliquer sur "Installer"

## Configuration

### 1. Accéder aux réglages

**Back-office PrestaShop > Modules > Module Manager**

Recherchez "Cookie Consent" et cliquez sur **"Configurer"**

### 2. Onglet Général

#### Activation
```
☑️ Activer Cookie Consent
```

#### Position d'affichage
- **Bas de page** (recommandé)
- **En overlay**
- **Modal centré**

#### Thème
- **Clair** (défaut)
- **Sombre**
- **Auto** (détection système)
- **Personnalisé** (CSS custom)

### 3. Onglet Logging RGPD

Configuration du système de journalisation :

```
☑️ Activer le logging des consentements

Endpoint API : https://api.synapx.fr/
Clé API : sk-live-xxxxxxxxxxxxx
```

**Obtenir une clé API :**
1. Créer un compte sur [synapx.fr](https://synapx.fr/OAuth/)
2. Aller dans SDK > Cookie Consent
3. Copier votre clé API

**Avantages du logging :**
- ✅ Preuve de consentement RGPD (Article 7.1)
- ✅ Historique des modifications
- ✅ Exports pour audits
- ✅ Dashboard analytics

### 4. Onglet Services Statistiques

#### Google Analytics 4
```
☑️ Activer Google Analytics
Measurement ID : G-XXXXXXXXX
```

#### Google Tag Manager
```
☑️ Activer Google Tag Manager
Container ID : GTM-XXXXXXX
```

#### Matomo (Piwik)
```
☑️ Activer Matomo
URL Matomo : https://analytics.votresite.com/
Site ID : 1
```

#### Autres services disponibles
- **Hotjar** : Heatmaps et enregistrements
- **Microsoft Clarity** : Analytics gratuit Microsoft
- **Mixpanel** : Product analytics
- **Amplitude** : Analytics avancé
- **Plausible** : Analytics privacy-first

### 5. Onglet Services Marketing

#### Google AdSense
```
☑️ Activer Google AdSense
Publisher ID : ca-pub-XXXXXXXXXXXXXXXX
```

#### Facebook Pixel (Meta)
```
☑️ Activer Facebook Pixel
Pixel ID : 123456789012345
Event initial : PageView
```

#### Google Ads Remarketing
```
☑️ Activer Google Ads
Conversion ID : AW-XXXXXXXXX
```

#### Autres services disponibles
- **TikTok Pixel** : Remarketing TikTok
- **LinkedIn Insight Tag** : B2B tracking
- **Twitter Pixel** : Remarketing Twitter
- **Pinterest Tag** : E-commerce tracking

### 6. Onglet Services Fonctionnels

#### Chat en direct
```
☑️ Activer Crisp Chat
Website ID : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

Autres options :
- **Intercom** : Support client premium
- **Zendesk Chat** : Support intégré
- **Tawk.to** : Chat gratuit
- **LiveChat** : Support temps réel

#### CRM & Marketing Automation
- **HubSpot** : CRM complet
- **Segment** : CDP (Customer Data Platform)
- **ActiveCampaign** : Email automation

### 7. Onglet Personnalisation

#### Couleurs du thème
```
Couleur principale : #E63946
Couleur de fond : #FFFFFF
Couleur du texte : #111827
Couleur des bordures : #E5E7EB
```

#### Textes personnalisés (multilingue)
```
Titre FR : Gestion des cookies
Titre EN : Cookie Consent
Titre ES : Gestión de cookies

Message FR : Nous utilisons des cookies pour...
Message EN : We use cookies to...
```

### 8. Onglet Avancé

#### Expiration du consentement
```
Durée de validité : 6 mois (recommandé CNIL)
```

#### Options avancées
```
☑️ Bloquer scripts tiers automatiquement
☑️ Activer MutationObserver (SPA)
☑️ Mode debug (développement uniquement)
```

#### Exclusions
```
Pages exclues : /admin*, /checkout/payment
Scripts exclus : /assets/required.js
```

## Intégration e-commerce

### Tracking des conversions

Le module détecte automatiquement les événements PrestaShop et les transmet aux services consentis.

#### Événements trackés automatiquement

**Sans consentement :**
- ✅ Page view basique (anonyme)
- ✅ Navigation (catégories, produits)

**Avec consentement "Statistiques" :**
- ✅ Vues produit
- ✅ Ajout au panier
- ✅ Début de checkout
- ✅ Achats (transactions)

**Avec consentement "Marketing" :**
- ✅ Events Facebook Pixel
- ✅ Google Ads conversions
- ✅ Remarketing dynamique

### Configuration Google Analytics Enhanced Ecommerce

Le module envoie automatiquement les données e-commerce à GA4 :

```javascript
// Exemple d'événement "purchase" automatique
gtag('event', 'purchase', {
  transaction_id: 'PS-12345',
  value: 89.99,
  currency: 'EUR',
  items: [{
    item_id: 'PROD-001',
    item_name: 'T-shirt bleu',
    price: 29.99,
    quantity: 2
  }]
});
```

### Configuration Facebook Pixel E-commerce

```javascript
// Events automatiques
fbq('track', 'ViewContent', {
  content_ids: ['PROD-001'],
  content_type: 'product',
  value: 29.99,
  currency: 'EUR'
});

fbq('track', 'Purchase', {
  value: 89.99,
  currency: 'EUR'
});
```

## Hooks PrestaShop

### Hooks disponibles

Le module utilise ces hooks PrestaShop :

```php
// Affichage de la bannière
displayFooter

// Tracking e-commerce
actionProductAdd (ajout panier)
actionValidateOrder (commande)
displayOrderConfirmation (confirmation)

// Intégration admin
displayBackOfficeHeader
```

### Personnalisation avec hooks

Dans votre thème (`themes/votre-theme/modules/synapxlab_cookie/views/templates/hook/`), vous pouvez override :

```smarty
{* custom-banner.tpl *}
<div class="cookie-banner-custom">
  {$cookie_banner nofilter}
</div>
```

## Compatibilité modules

### ✅ Modules compatibles

**Paiement :**
- PayPal Official
- Stripe Official
- Alma (paiement fractionné)

**SEO :**
- PrestaShop SEO Expert
- Pretty URLs

**Performance :**
- JMS Page Cache
- Full Page Cache

**Marketing :**
- Newsletter Popup
- Abandoned Cart Pro
- Product Reviews

### ⚠️ Configurations spéciales

#### Module "Google Analytics Official"

Si vous utilisez déjà le module officiel GA :

1. **Désactiver** le module Google Analytics officiel
2. **OU** exclure ses scripts :
   ```
   Configuration > Avancé > Exclusions
   Scripts exclus : /modules/ps_googleanalytics/
   ```

#### Module "Facebook Pixel Official"

Même procédure :
1. Désactiver le module officiel FB Pixel
2. Configurer votre Pixel dans Cookie Consent

#### Module "One Page Checkout"

Compatible mais nécessite :
```
☑️ Activer MutationObserver
```

## Multilingue & Multiboutique

### Support multilingue

Le module détecte automatiquement la langue active PrestaShop :

- 🇫🇷 Français
- 🇬🇧 English
- 🇪🇸 Español
- 🇩🇪 Deutsch
- 🇮🇹 Italiano
- 🇳🇱 Nederlands
- 🇵🇹 Português

### Multiboutique (Multistore)

**Configuration globale :**
- Modules > Module Manager > Cookie Consent
- Cocher "Appliquer à toutes les boutiques"

**Configuration par boutique :**
- Sélectionner la boutique dans le menu déroulant
- Configurer spécifiquement pour cette boutique

## Thèmes PrestaShop

### Classic Theme (défaut)

Compatible immédiatement, pas de configuration nécessaire.

### Warehouse Theme

Compatible. Le module s'intègre automatiquement dans le footer.

### Leo Theme

Compatible. Si le footer est custom, ajouter dans `footer.tpl` :

```smarty
{hook h='displayCookieConsent'}
```

### Thèmes custom

Pour intégrer dans un thème personnalisé :

```smarty
{* Dans footer.tpl ou custom-hook.tpl *}
{if isset($cookieConsent)}
  {$cookieConsent nofilter}
{/if}

{* Lien de gestion *}
<a href="#" id="openpolitecookie" class="footer-link">
  {l s='Manage cookies' mod='synapxlab_cookie'}
</a>
```

## Overrides

### Override du template

Créer : `themes/votre-theme/modules/synapxlab_cookie/views/templates/hook/displayFooter.tpl`

```smarty
<div class="custom-cookie-wrapper">
  {* Votre HTML custom *}
  <div id="cookie-banner-container"></div>
</div>

<script>
// Votre JS custom
window.CookieConsent.init({
  statistics: {
    google_analytics_key: '{$ga_key|escape:'htmlall':'UTF-8'}'
  }
});
</script>
```

### Override du CSS

Créer : `themes/votre-theme/assets/css/modules/synapxlab-cookie.css`

```css
/* Thème custom pour la boutique */
:root {
  --cc-bg: #1a1a1a;
  --cc-accent: #ff6b6b;
  --cc-text: #ffffff;
}

#politecookiebanner {
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
}
```

### Override du module (PHP)

Créer : `override/modules/synapxlab_cookie/synapxlab_cookie.php`

```php
<?php
class SynapxlabCookieOverride extends SynapxlabCookie
{
    public function hookDisplayFooter($params)
    {
        // Votre logique custom
        $this->context->smarty->assign([
            'custom_var' => 'Custom value'
        ]);
        
        return parent::hookDisplayFooter($params);
    }
}
```

## RGPD & Conformité PrestaShop

### Intégration avec le module RGPD PrestaShop

Le module s'intègre avec les fonctionnalités RGPD natives :

**Clients & Contacts > RGPD**

1. **Droit d'accès**
   - Les logs de consentement sont inclus dans l'export client

2. **Droit à l'effacement**
   - Supprime automatiquement les logs du client

3. **Politique de confidentialité**
   - Ajouter un paragraphe sur la gestion des cookies

### Page de politique de confidentialité

Ajoutez ce texte dans **Configuration > Préférences > Pages CMS > Politique de confidentialité** :

```
## Gestion des cookies

Ce site utilise des cookies et traceurs pour améliorer votre expérience 
et analyser notre audience. Vous pouvez gérer vos préférences à tout 
moment via le lien "Gérer mes cookies" en bas de page.

Les cookies sont classés en trois catégories :
- Fonctionnels : Strictement nécessaires au fonctionnement
- Statistiques : Analyse d'audience anonyme
- Marketing : Publicité personnalisée et remarketing

Vos choix sont conservés 6 mois maximum, conformément aux 
recommandations de la CNIL.

Pour en savoir plus : [Lien vers documentation]
```

## Performance

### Impact sur la vitesse

**Module optimisé pour la performance :**
- Script : ~25KB gzippé
- Chargement asynchrone (pas de blocage)
- Cache navigateur activé (1 an)

**Tests PageSpeed Insights :**
- Performance : -1 à -3 points (négligeable)
- Best Practices : +8 points (conformité RGPD)

### Cache PrestaShop

Le module est compatible avec tous les systèmes de cache :

- ✅ Cache natif PrestaShop
- ✅ JMS Page Cache
- ✅ Full Page Cache Pro
- ✅ Cloudflare
- ✅ Varnish

**Configuration recommandée :**
```
Réglages > Performances avancées
☑️ Activer le cache
Exclure : /modules/synapxlab_cookie/views/js/
```

## Débogage

### Mode debug

Activer dans la configuration du module :

```
Configuration > Avancé
☑️ Activer le mode debug
```

Affiche des logs détaillés dans la console navigateur.

### Logs PrestaShop

Consulter : `var/logs/synapxlab_cookie.log`

```
[2025-01-15 14:30:00] INFO: Cookie Consent initialisé
[2025-01-15 14:30:05] INFO: Consentement accepté (statistics: true)
[2025-01-15 14:30:05] INFO: Google Analytics chargé
```

### Console JavaScript

```javascript
// Vérifier le chargement
console.log(window.CookieConsent);

// Voir les préférences
console.log(window.CookieConsent.getPreferences());

// Forcer l'affichage
window.CookieConsent.open();
```

## Migration depuis d'autres modules

### Depuis "EU Cookie Law"

1. Exporter vos réglages (screenshot)
2. Désactiver "EU Cookie Law"
3. Installer SynapxLab Cookie Consent
4. Reconfigurer avec vos paramètres

**Avantages de la migration :**
- ✅ Blocage automatique des scripts
- ✅ Logging RGPD
- ✅ Plus de services supportés
- ✅ Meilleure conformité CNIL

### Depuis "Cookie Plus"

Même procédure. Les préférences utilisateurs seront perdues (localStorage différent).

## Support & Assistance

### Documentation
- 📚 [Documentation complète](https://synapx.fr/sdk/cookie_consent/)
- 🎓 [Guides PrestaShop](https://synapx.fr/sdk/cookie_consent/integrations/prestashop)

### Support technique
- 📧 contact@synapxlab.com
- 💬 [Forum PrestaShop](https://www.prestashop.com/forums/)
- 🐛 [GitHub Issues](https://github.com/synapxLab/prestashop-cookie-consent/issues)

### Support PrestaShop Addons
- ⭐ [Page du module](https://addons.prestashop.com/fr/synapxlab-cookie-consent)
- 📝 Avis et commentaires

## FAQ PrestaShop

### Le module est-il gratuit ?

**Oui !** Le module PrestaShop est gratuit.

Le logging est :
- Gratuit jusqu'à 300 consentements/mois
- Payant au-delà (10€/mois pour 10K)

### Compatible PrestaShop Cloud ?

**Oui**, compatible PrestaShop Cloud et toutes les versions hébergées.

### Fonctionne avec PHP 8.1 ?

**Oui**, compatible PHP 7.4 à 8.3.

### Puis-je personnaliser le design ?

**Oui**, via les variables CSS ou en créant un override du template.

### Bloque-t-il Google Analytics avant consentement ?

**Oui**, blocage automatique de tous les scripts tiers détectés.

### Compatible avec les modules de cache ?

**Oui**, compatible avec tous les modules de cache PrestaShop.

---

**Module PrestaShop by SynapxLab**
**Version : 1.0.0**
**Licence : MIT**