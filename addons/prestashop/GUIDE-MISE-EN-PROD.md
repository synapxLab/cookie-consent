# Guide de mise en production — Module PrestaShop `synapxcookieconsent`

Module PrestaShop intégrant la bannière de consentement aux cookies **@synapxlab/cookie-consent** (RGPD/CNIL).
Compatible **PrestaShop 1.7.x et 8.x**, **PHP 7.2+**.

## 1. Construire le zip du module

Le fichier zip doit contenir un seul dossier racine : `synapxcookieconsent/`.

```bash
cd addons/prestashop

# Synchroniser le bundle JS avec la dernière version du SDK
cp ../../dist/cookie.js synapxcookieconsent/views/js/cookie.js

# Construire l'archive (sans fichiers parasites)
zip -r synapxcookieconsent.zip synapxcookieconsent \
  -x "*.git*" -x "*.DS_Store" -x "*__MACOSX*"
```

Vérifier le contenu de l'archive :

```bash
unzip -l synapxcookieconsent.zip
```

Arborescence attendue :

```
synapxcookieconsent/
├── synapxcookieconsent.php     # Classe principale du module
├── config.xml                  # Métadonnées (cache module PrestaShop)
├── logo.png                    # Logo 128x128
├── index.php                   # Protection d'accès direct
├── translations/index.php
├── upgrade/index.php
└── views/
    ├── index.php
    ├── js/
    │   ├── cookie.js           # Bundle SDK embarqué (aucun CDN)
    │   └── index.php
    └── templates/
        ├── index.php
        ├── admin/configure.tpl # Panneau d'information back-office
        ├── admin/index.php
        ├── hook/header.tpl     # Script d'initialisation front
        └── hook/index.php
```

## 2. Checklist de validation PrestaShop Addons

Avant toute soumission sur [validator.prestashop.com](https://validator.prestashop.com/) :

- [ ] `php -l` ne signale aucune erreur dans les fichiers PHP (versions 7.2, 7.4 et 8.1 si possible)
- [ ] Le nom du dossier, le nom du fichier principal et `$this->name` sont identiques : `synapxcookieconsent`
- [ ] `config.xml` est présent et sa version correspond à celle du module (`$this->version`)
- [ ] Un fichier `index.php` de protection est présent dans **chaque** dossier
- [ ] `logo.png` est présent à la racine du module
- [ ] Un en-tête de licence figure dans chaque fichier PHP et TPL
- [ ] Aucune fonction PHP interdite n'est utilisée (`eval`, `exec`, `system`, ...)
- [ ] Toutes les entrées utilisateur passent par `Tools::getValue()` et sont validées
- [ ] Aucune variable non échappée dans les `.tpl` (`|escape:'html':'UTF-8'` ; `nofilter` réservé au JSON encodé avec `JSON_HEX_*`)
- [ ] `install()` / `uninstall()` sont propres : les clés `SYNAPXCC_*` sont supprimées à la désinstallation
- [ ] `ps_versions_compliancy` est déclaré (`min 1.7.0.0`)
- [ ] Aucune ressource externe obligatoire : `views/js/cookie.js` est servi localement
- [ ] Le fichier zip a été contrôlé avec le validateur officiel et tous les avertissements bloquants ont été corrigés

Note Addons : la description du produit, les captures d'écran et les traductions
de la fiche doivent être préparées séparément dans le back-office vendeur Addons.

## 3. Installation manuelle (FTP)

1. Décompresser le fichier zip sur le poste local.
2. Téléverser le dossier `synapxcookieconsent/` dans `modules/` de la boutique.
3. Vérifier les droits d'accès : dossiers `755`, fichiers `644`, propriétaire = utilisateur du serveur web.
4. Depuis le back-office : **Modules > Gestionnaire de modules** > rechercher « Cookie Consent » > **Installer**.
5. Cliquer sur **Configurer** et renseigner les options (langue, Google Consent Mode, politique de confidentialité, services et clé API facultative).
6. Vider le cache : **Paramètres avancés > Performances > Vider le cache**.

Installation à partir du fichier zip : **Modules > Gestionnaire de modules > Installer un module**, puis sélectionner `synapxcookieconsent.zip`.

## 4. Tests à effectuer (boutique 1.7 **et** 8)

### Installation / désinstallation

- [ ] Installation sans erreur ni avertissement
- [ ] La page de configuration s'ouvre correctement et enregistre les valeurs saisies
- [ ] Les valeurs invalides sont refusées avec un message d'erreur (clé API mal formée, `G-` invalide, URL invalide)
- [ ] Après la désinstallation : la bannière n'apparaît plus sur le site public et les clés `SYNAPXCC_*` sont supprimées de `ps_configuration`

### Front office

- [ ] `views/js/cookie.js` est chargé dans le `<head>` **avant** les autres scripts (vérifier dans le code source de la page)
- [ ] Le script d'initialisation intégré (hook `displayHeader`) est présent dans le `<head>`
- [ ] La bannière s'affiche dès la première visite ; aucun script tiers (GA, pixel...) ne se charge avant le recueil du consentement (onglet Réseau)
- [ ] « Tout refuser » est aussi accessible que « Tout accepter »
- [ ] Le choix persiste après rechargement de la page ; le bouton flottant permet de le modifier
- [ ] Langue : la bannière suit celle de la boutique (à vérifier en changeant de langue sur le site public) et son sélecteur de langue reste fonctionnel
- [ ] Le lien vers la politique de confidentialité pointe vers la bonne page CMS
- [ ] Aucune erreur dans la console du navigateur

### Google Consent Mode v2 (si activé)

- [ ] Avant consentement : `window.dataLayer` contient un `consent default` avec les signaux positionnés sur `denied`
- [ ] Après acceptation : un événement `consent update` est déclenché avec les signaux accordés
- [ ] Option désactivée : aucun appel à `gtag('consent', ...)` n'est effectué

### Mode avec clé API (si utilisé)

- [ ] Après un choix de l'utilisateur, une requête POST est envoyée vers `https://cookie.synapx.fr/` (onglet Réseau)
- [ ] Le consentement apparaît bien dans l'espace SynapxLab
- [ ] Sans clé API : **aucune** requête sortante liée au module

### Environnements

- [ ] PrestaShop 1.7.x (dernière 1.7.8) + PHP 7.2/7.4
- [ ] PrestaShop 8.x (dernière 8.1/8.2) + PHP 8.1
- [ ] Thème Classic et au moins un thème tiers
- [ ] Mode de débogage (`_PS_MODE_DEV_ = true`) : aucune notice ni aucun avertissement PHP
- [ ] Multiboutique si utilisé : la configuration reste propre à chaque boutique

## 5. Mise à jour du module

1. Incrémenter `$this->version` dans `synapxcookieconsent.php` **et** dans `config.xml`.
2. Si une migration est nécessaire (nouvelle clé de configuration, nouveau hook), ajouter un script `upgrade/upgrade-X.Y.Z.php`.
3. Resynchroniser `views/js/cookie.js` depuis `dist/cookie.js` si le SDK a évolué.
4. Reconstruire le zip et rejouer l'ensemble de la checklist de la section 4.

## Recette locale (avant soumission)

Un environnement Docker jetable est fourni dans `addons/test/`.

```bash
cd addons/test
docker compose -f docker-compose.prestashop.yml up -d   # http://localhost:8083
```

Le module est monté automatiquement dans PrestaShop (installation depuis le
Gestionnaire de modules). Pour valider la compatibilité 1.7, remplacer l'image
par `prestashop/prestashop:1.7-apache`. La checklist de recette figure dans
`addons/test/README.md`. Purge : `docker compose -f docker-compose.prestashop.yml down -v`.
