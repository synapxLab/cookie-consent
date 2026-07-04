# Guide de mise en production — Plugin WordPress Synapx Cookie Consent

Ce guide présente les étapes de préparation du plugin `synapx-cookie-consent` en vue de sa mise en production et de sa soumission au répertoire officiel wordpress.org.

## 1. Synchroniser le bundle JavaScript

Le plugin embarque une copie locale de `dist/cookie.js`. À chaque nouvelle version de la bibliothèque :

```bash
# Depuis la racine du repo
npm run build   # si le dist doit être régénéré
cp dist/cookie.js addons/wordpress/synapx-cookie-consent/assets/js/cookie.js
```

Mettre ensuite à jour la constante `SCC_BANNER_VERSION` dans `synapx-cookie-consent.php` (elle permet de renouveler le cache du script) et, si le plugin lui-même évolue :

- `SCC_VERSION` et l'en-tête `Version:` dans `synapx-cookie-consent.php`
- `Stable tag:` et le `Changelog` dans `readme.txt`

Les trois numéros de version (`Version:`, `SCC_VERSION`, `Stable tag`) doivent être identiques.

## 2. Construire le zip

```bash
cd addons/wordpress
zip -r synapx-cookie-consent.zip synapx-cookie-consent \
  -x "*.git*" -x "*.DS_Store" -x "*node_modules*"
```

Vérifier le contenu attendu du zip :

```
synapx-cookie-consent/
├── synapx-cookie-consent.php
├── readme.txt
├── uninstall.php
├── includes/
│   ├── class-scc-settings.php
│   └── class-scc-frontend.php
├── admin/
│   └── class-scc-admin.php
├── assets/
│   └── js/
│       └── cookie.js
└── languages/
```

## 3. Checklist avant soumission wordpress.org

### Technique

- [ ] `php -l` ne signale aucune erreur dans les fichiers PHP (version 7.4 au minimum).
- [ ] Tests effectués sur une installation WordPress 5.8 et sur la dernière version stable.
- [ ] Tests effectués avec `WP_DEBUG` activé : aucune notice ni aucun avertissement PHP.
- [ ] Activation, désactivation, désinstallation : `uninstall.php` supprime bien l'option `scc_settings`.
- [ ] Test multisite (activation réseau et par site).
- [ ] Vérification effectuée avec le plugin [Plugin Check (PCP)](https://wordpress.org/plugins/plugin-check/) — obligatoire pour les nouvelles soumissions.
- [ ] Aucun appel CDN : `assets/js/cookie.js` est bien servi localement.

### Conformité répertoire

- [ ] `readme.txt` est valide (à contrôler avec le validateur : https://wordpress.org/plugins/developers/readme-validator/).
- [ ] `Tested up to:` correspond à la dernière version majeure de WordPress disponible au moment de la soumission.
- [ ] Les services externes (`cookie.synapx.fr`, `version.synapx.fr`) sont documentés dans le readme — exigence des guidelines wordpress.org pour tout appel sortant.
- [ ] Le code JavaScript embarqué (`cookie.js`) est sous licence MIT, compatible avec la GPL. Le code source non minifié est accessible publiquement (dépôt GitHub et npm) : indiquer le lien dans la fiche si l'équipe de revue le demande.
- [ ] Pas de code de tracking actif sans consentement ni d'obfuscation.
- [ ] Le slug demandé lors de la soumission est `synapx-cookie-consent` (il devient définitif et ne peut plus être modifié).

### Fonctionnel

- [ ] La bannière s'affiche sur le site public et son script est chargé en premier dans le `<head>` (vérifier l'ordre des scripts).
- [ ] Sans clé API : aucun POST sortant lors des actions de consentement (vérifier l'onglet réseau).
- [ ] Avec une clé API : la requête POST est envoyée à `cookie.synapx.fr` avec la clé.
- [ ] Langue forcée : la bannière s'affiche dans la langue choisie.
- [ ] Google Consent Mode v2 : `window.dataLayer` contient bien le `consent default` défini sur `denied` avant tout choix.
- [ ] Le blocage manuel avec `type="text/plain"` et `data-cookie-category` fonctionne correctement.
- [ ] Compatibilité vérifiée avec une extension de cache (WP Super Cache, W3TC ou équivalent) et un outil d'optimisation JavaScript (`cookie.js` doit en être exclu).

## 4. Assets SVN wordpress.org

Une fois le plugin approuvé, un dépôt SVN est fourni. Les visuels ne sont **pas** inclus dans le fichier zip du plugin : ils doivent être placés dans le dossier `assets/` à la racine du dépôt SVN :

```
svn/
├── trunk/            ← contenu du plugin
├── tags/1.0.0/       ← copie de trunk à chaque release
└── assets/           ← visuels de la fiche wordpress.org
    ├── icon-128x128.png
    ├── icon-256x256.png
    ├── banner-772x250.png
    ├── banner-1544x500.png
    ├── screenshot-1.png
    ├── screenshot-2.png
    └── screenshot-3.png
```

> Les icônes et bannières existent déjà dans le repo, dossier `imag/` à la racine :
> `icon-128x128.png`, `icon-256x256.png`, `banner-772x250.png`, `banner-1544x500.png`, `screenshot-1.png` (ainsi que les sources `icon.svg` et `banner.svg`).
> Prévoir les captures d'écran 2 et 3 (panneau de préférences et page de réglages de l'administration) afin qu'elles correspondent à la section `== Screenshots ==` du readme.txt.

Les captures d'écran sont numérotées (`screenshot-1.png`, `screenshot-2.png`, …) et leur ordre doit correspondre aux légendes du `readme.txt`.

### Commandes SVN types

```bash
svn co https://plugins.svn.wordpress.org/synapx-cookie-consent svn-scc
cd svn-scc

# Copier le plugin dans trunk/ et les visuels dans assets/
cp -r /chemin/vers/synapx-cookie-consent/* trunk/
cp /chemin/vers/repo/imag/icon-*.png /chemin/vers/repo/imag/banner-*.png /chemin/vers/repo/imag/screenshot-*.png assets/

svn add --force trunk assets
svn cp trunk tags/1.0.0
svn ci -m "Release 1.0.0"
```

## 5. Après publication

- Vérifier le rendu de la fiche publique (icône, bannière, captures d'écran et readme).
- Tester l'installation depuis le répertoire sur un site propre.
- À chaque mise à jour : incrémenter les versions, actualiser `trunk/` et créer le tag SVN correspondant au `Stable tag`.

## Recette locale (avant soumission)

Un environnement Docker jetable est fourni dans `addons/test/`.

```bash
cd addons/test
docker compose -f docker-compose.wordpress.yml up -d   # http://localhost:8082
```

Le plugin est monté automatiquement dans WordPress. La checklist de recette
(affichage, blocage des scripts, modes avec/sans clé API, cycle de vie) figure
dans `addons/test/README.md`. Purge : `docker compose -f docker-compose.wordpress.yml down -v`.
