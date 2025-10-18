# Intégration WordPress

## Installation du plugin

### Méthode 1 : Via le répertoire WordPress (recommandé)

1. Connectez-vous à votre admin WordPress
2. Allez dans **Extensions > Ajouter**
3. Recherchez "**SynapxLab Cookie Consent**"
4. Cliquez sur **Installer** puis **Activer**

### Méthode 2 : Installation manuelle

1. **Télécharger le plugin**
   - [synapxlab-cookie-consent.zip](https://wordpress.org/plugins/synapxlab-cookie-consent/)

2. **Uploader dans WordPress**
   - Admin WordPress > Extensions > Ajouter
   - Cliquez sur "Téléverser une extension"
   - Sélectionnez le fichier ZIP
   - Cliquer sur "Installer maintenant"

3. **Activer le plugin**

## Configuration

### 1. Accéder aux réglages

WordPress Admin > **Réglages > Cookie Consent**

### 2. Configuration générale

#### Activation
- ✅ **Activer Cookie Consent** : Cochez pour activer la bannière

#### Langue
- **Détection automatique** : Utilise la langue de WordPress
- **Forcer une langue** : FR, EN, ES, DE, IT, NL, PT

### 3. Logging RGPD (optionnel)

Pour activer la journalisation des consentements :

```
☑️ Activer le logging RGPD
Endpoint API : https://cookie.synapx.fr/
Clé API : sk-live-xxxxx
```

**Obtenir une clé API :**
1. Créer un compte sur [synapx.fr](https://synapx.fr/OAuth/)
2. Aller dans SDK > Cookie Consent
3. Copier votre clé API

### 4. Services statistiques

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

#### Matomo
```
☑️ Activer Matomo
URL Matomo : https://analytics.votresite.com/
Site ID : 1
```

#### Autres services
- Hotjar Site ID
- Microsoft Clarity Project ID
- Mixpanel Token
- Amplitude Key
- Plausible Domain

### 5. Services marketing

#### Facebook Pixel
```
☑️ Activer Facebook Pixel
Pixel ID : 123456789012345
Event initial : PageView
```

#### Google AdSense
```
☑️ Activer Google AdSense
Publisher ID : ca-pub-XXXXXXX
```

#### Autres services
- TikTok Pixel ID
- LinkedIn Partner ID

### 6. Services fonctionnels

#### Intercom
```
☑️ Activer Intercom
App ID : abc123xyz
```

#### Crisp Chat
```
☑️ Activer Crisp
Website ID : xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

#### Autres services
- HubSpot Portal ID
- Segment Write Key

### 7. Sauvegarde

Cliquez sur **Enregistrer les modifications**

## Personnalisation

### Modifier le style

**Admin WordPress > Apparence > Personnaliser > CSS additionnel**

```css
/* Thème personnalisé */
:root {
  --cc-bg: #ffffff;
  --cc-text: #111827;
  --cc-accent: #e63946;    /* Couleur de votre marque */
  --cc-border: #e5e7eb;
}

/* Thème sombre */
@media (prefers-color-scheme: dark) {
  :root {
    --cc-bg: #1f2937;
    --cc-text: #f9fafb;
    --cc-accent: #3b82f6;
    --cc-border: #374151;
  }
}
```

### Ajouter le lien de gestion

Le plugin ajoute automatiquement un shortcode :

```
[cookie_consent_link]
```

**Utilisation dans un menu :**
1. Admin WordPress > Apparence > Menus
2. Ajouter un "Lien personnalisé"
3. URL : `#`
4. Texte : "Gérer mes cookies"
5. Ajouter la classe CSS : `cookie-consent-trigger`

**Utilisation dans un widget :**
```html
<a href="#" class="cookie-consent-trigger">Gérer mes cookies</a>
```

**Utilisation dans un article/page :**
```
[cookie_consent_link text="Gérer mes préférences"]
```

## Hooks & Filtres WordPress

### Personnaliser la configuration

```php
// Dans functions.php de votre thème

// Modifier la configuration par défaut
add_filter('synapxlab_cookie_config', function($config) {
  // Forcer 3 mois d'expiration au lieu de 6
  $config['storage']['expiration_months'] = 3;
  
  return $config;
});
```

### Ajouter du code après consentement

```php
// Ajouter du code personnalisé dans le footer
add_action('wp_footer', function() {
  ?>
  <script>
  document.addEventListener('cookieConsentChanged', function(event) {
    if (event.detail.preferences.marketing) {
      // Votre code custom
      console.log('Marketing accepté sur WordPress');
    }
  });
  </script>
  <?php
});
```

### Désactiver sur certaines pages

```php
// Désactiver la bannière sur la page de login
add_filter('synapxlab_cookie_enabled', function($enabled) {
  if (is_page('login') || is_admin()) {
    return false;
  }
  return $enabled;
});
```

## Compatibilité plugins

### ✅ Plugins compatibles

- **WooCommerce** : Fonctionne parfaitement
- **Elementor** : Compatible
- **Yoast SEO** : Compatible
- **WPML** : Support multilingue
- **Polylang** : Support multilingue
- **Contact Form 7** : Compatible
- **WP Rocket** : Compatible (exclure cookie.js du cache)
- **Autoptimize** : Compatible (exclure cookie.js de l'agrégation)

### ⚠️ Configurations spéciales

#### WP Rocket

**Réglages > WP Rocket > Fichiers JavaScript**

Exclure du cache :
```
/wp-content/plugins/synapxlab-cookie-consent/assets/cookie.js
```

#### Autoptimize

**Réglages > Autoptimize > JavaScript**

Exclure de l'agrégation :
```
synapxlab-cookie-consent
```

#### Cloudflare

Si vous utilisez Cloudflare, désactivez le minify JS/CSS pour :
```
*cookie.js
```

## WooCommerce

### Tracking e-commerce

Le plugin détecte automatiquement WooCommerce et bloque :
- ✅ Google Analytics Enhanced Ecommerce
- ✅ Facebook Pixel Purchase events
- ✅ Pixels de remarketing

### Configuration recommandée

```php
// Dans functions.php

// Tracker les achats uniquement avec consentement
add_action('woocommerce_thankyou', function($order_id) {
  ?>
  <script>
  if (window.CookieConsent && window.CookieConsent.hasConsent('statistics')) {
    // Envoyer l'événement purchase à GA
    gtag('event', 'purchase', {
      transaction_id: '<?php echo $order_id; ?>',
      value: <?php echo wc_get_order($order_id)->get_total(); ?>,
      currency: 'EUR'
    });
  }
  </script>
  <?php
});
```

## Multisite WordPress

Le plugin est compatible WordPress Multisite.

### Installation réseau

1. Uploader le plugin
2. **Extensions réseau > Activer**
3. Chaque site peut avoir sa propre configuration

### Configuration globale (network-wide)

```php
// Dans wp-config.php

define('SYNAPXLAB_COOKIE_NETWORK_CONFIG', [
  'logger' => [
    'enabled' => true,
    'apiKey' => 'sk-live-xxxxx'
  ]
]);
```

## Gutenberg

### Bloc personnalisé

Le plugin ajoute un bloc Gutenberg : **"Cookie Consent Link"**

**Utilisation :**
1. Éditeur de page/article
2. Cliquer sur "+"
3. Rechercher "Cookie Consent"
4. Ajouter le bloc
5. Personnaliser le texte

## Thèmes populaires

### Divi

Compatible immédiatement. Pour personnaliser :

**Divi > Options du thème > Personnaliser > CSS additionnel**

### Astra

Compatible. Ajouter le lien dans :

**Apparence > Menus > Footer Menu**

### OceanWP

Compatible. Le widget fonctionne dans tous les emplacements.

## RGPD & WordPress

### Intégration avec les outils de confidentialité WP

Le plugin s'intègre avec les fonctionnalités RGPD de WordPress :

**Réglages > Confidentialité**

Ajoutez ce texte suggéré :
```
Ce site utilise Cookie Consent de SynapxLab pour gérer 
les cookies et traceurs conformément au RGPD.

Vous pouvez gérer vos préférences à tout moment via 
le lien "Gérer mes cookies" en bas de page.

Les consentements sont conservés 6 mois maximum.
```

### Export des données utilisateur

Le plugin ajoute automatiquement les logs de consentement à l'export RGPD WordPress.

### Effacement des données

Lors d'une demande d'effacement, le plugin supprime :
- ✅ Les préférences localStorage de l'utilisateur
- ✅ Les logs de consentement associés (si logging activé)

## Débogage

### Mode debug

```php
// Dans wp-config.php
define('WP_DEBUG', true);
define('SYNAPXLAB_COOKIE_DEBUG', true);
```

Affichera des logs détaillés dans :
```
/wp-content/debug.log
```

### Vérifier le chargement

```php
// Vérifier que le script est chargé
add_action('wp_footer', function() {
  ?>
  <script>
  console.log('Cookie Consent loaded:', typeof window.CookieConsent);
  </script>
  <?php
});
```

## Migration depuis un autre plugin

### Depuis Cookie Notice

1. Exporter vos réglages actuels (screenshot)
2. Désactiver Cookie Notice
3. Installer SynapxLab Cookie Consent
4. Reconfigurer avec vos paramètres

### Depuis GDPR Cookie Consent

Même procédure, aucune perte de données.

## FAQ WordPress

### Le plugin ralentit-il mon site ?

Non. Le script fait ~25Ko et se charge de manière asynchrone.

### Compatible avec mon thème ?

Oui, le plugin est agnostique du thème. Il fonctionne avec tous les thèmes WordPress standards.

### Puis-je traduire le plugin ?

Oui, le plugin est translation-ready. Fichiers PO/MO dans `/languages`.

### Fonctionne avec PHP 7.4 ?

Oui, compatible PHP 7.4 à 8.3.

## Support

### Documentation officielle
- 📚 [Documentation complète](https://synapx.fr/sdk/cookie_consent/)

### Support WordPress
- 🐛 [Forum WordPress](https://wordpress.org/support/plugin/synapxlab-cookie-consent/)
- 📧 contact@synapx.fr

### Communauté
- 💬 [Discord SynapxLab](https://discord.gg/synapxlab)