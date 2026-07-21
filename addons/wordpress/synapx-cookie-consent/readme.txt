=== Synapx Cookie Consent ===
Contributors: synapxlab
Tags: cookie consent, rgpd, gdpr, cnil, google consent mode
Requires at least: 5.8
Tested up to: 7.0
Requires PHP: 7.4
Stable tag: 1.0.1
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Bannière de consentement RGPD/CNIL avec blocage préalable des scripts tiers, Google Consent Mode v2 et prise en charge de 13 langues.

== Description ==

Synapx Cookie Consent affiche une bannière de consentement aux cookies conforme aux exigences du RGPD et aux recommandations de la CNIL. Le plugin intègre la bibliothèque open source @synapxlab/cookie-consent (licence MIT), chargée directement depuis votre site sans recourir à un CDN.

= Fonctionnalités =

* Consentement préalable : tous les services sont refusés par défaut, et le refus reste aussi simple que l'acceptation.
* Blocage automatique des scripts tiers connus avant consentement (Google Analytics, GTM, Matomo, Facebook Pixel, etc.).
* Google Consent Mode v2 : les signaux sont réglés sur « denied » par défaut, puis actualisés selon le choix du visiteur.
* 13 langues : français, anglais, espagnol, allemand, italien, néerlandais, portugais, polonais, roumain, russe, suédois, arabe et chinois. La langue peut être détectée automatiquement ou imposée dans les réglages.
* Le visiteur peut modifier son choix à tout moment grâce à un bouton flottant.
* Expiration du consentement après 6 mois (recommandation CNIL).
* Thèmes intégrés (clair, sombre, brun et rouge) et personnalisation au moyen de variables CSS.
* Configuration des services courants depuis l'administration : Google Analytics 4, Google Tag Manager, Microsoft Clarity, Google AdSense, Facebook Pixel, Crisp et Intercom.
* Possibilité de bloquer manuellement tout autre script avec `type="text/plain"` et `data-cookie-category`.

= Deux modes de fonctionnement =

**Sans clé API (par défaut)** : le plugin fonctionne de manière entièrement autonome. Les choix des visiteurs sont enregistrés dans leur navigateur (localStorage) et aucune donnée de consentement n'est transmise à un service externe.

**Avec une clé API (facultatif)** : les actions de consentement (acceptation, refus et modification) sont journalisées par le service SynapxLab afin de constituer une preuve horodatée (article 7.1 du RGPD). Ce service est payant ; la clé API est disponible depuis l'espace membre sur synapx.fr.

= Services externes =

Ce plugin peut communiquer avec les services suivants :

* **cookie.synapx.fr** — uniquement si une clé API est renseignée. À chaque action de consentement, un enregistrement est transmis (identifiant de consentement, préférences, hôte du site, version de la bannière, locale, referrer et user-agent). Consultez la politique de confidentialité de SynapxLab sur https://synapx.fr/.
* **version.synapx.fr** — la bibliothèque JavaScript intégrée vérifie occasionnellement sa version au moyen d'une simple requête GET, sans cookie ni donnée personnelle. Le résultat apparaît uniquement dans la console du navigateur.

Les services tiers que vous configurez (Google Analytics, Facebook Pixel, etc.) ne sont chargés qu'après consentement du visiteur pour la catégorie correspondante.

= Avertissement =

Ce plugin gère le recueil du consentement aux traceurs et, en option, sa preuve. Il ne constitue pas un conseil juridique et ne remplace pas une démarche complète de conformité au RGPD (registre des traitements, analyse d'impact relative à la protection des données et gestion des droits). Faites valider votre configuration par votre délégué à la protection des données ou votre conseil juridique.

== Installation ==

1. Téléversez le dossier `synapx-cookie-consent` dans `/wp-content/plugins/`, ou installez le plugin depuis l'écran Extensions de WordPress.
2. Activez le plugin.
3. Rendez-vous dans Réglages → Cookie Consent pour configurer la langue, les liens légaux et les services utilisés.
4. Facultatif : renseignez une clé API SynapxLab pour activer la preuve de consentement.

== Frequently Asked Questions ==

= Le plugin fonctionne-t-il sans compte ni clé API ? =

Oui. Sans clé API, la bannière fonctionne de manière entièrement autonome : les choix sont enregistrés dans le navigateur du visiteur et aucune donnée de consentement n'est transmise à un service externe.

= À quoi sert la clé API ? =

Elle active la journalisation des consentements par le service SynapxLab afin de fournir une preuve horodatée en cas de contrôle (article 7.1 du RGPD). Son utilisation reste facultative.

= Comment bloquer un script qui n'est pas dans la liste des services ? =

Dans votre thème ou vos contenus, remplacez `type="text/javascript"` par `type="text/plain"`, puis ajoutez `data-cookie-category="statistics"` (ou `marketing`, `functional`). Le script ne sera exécuté qu'après le consentement du visiteur.

= Comment ajouter un lien « Gérer mes cookies » dans le pied de page ? =

Ajoutez un lien portant l'identifiant `openpolitecookie` : `<a href="#" id="openpolitecookie">Gérer mes cookies</a>`. La bibliothèque l'utilisera automatiquement pour ouvrir la bannière.

= La position de la bannière est-elle configurable ? =

Non. La bibliothèque affiche la bannière en position fixe, au bas de la page. Ses couleurs peuvent toutefois être personnalisées au moyen du thème choisi et des variables CSS `--cc-*`.

= Le plugin est-il compatible avec les caches et les optimiseurs de scripts ? =

Le script de la bannière doit être chargé dans l'en-tête de la page, avant les autres scripts. Excluez `assets/js/cookie.js` des fonctions de regroupement et de chargement différé de vos extensions d'optimisation.

== Screenshots ==

1. Bannière de consentement affichée sur le site public.
2. Panneau de préférences par catégorie.
3. Page de réglages dans l'administration WordPress.

== Changelog ==

= 1.0.1 =
* Correction de l’application des valeurs par défaut de Google Consent Mode v2 avant le chargement des balises Google.
* Correction du ciblage régional du consentement, avec validation des codes de région.
* Suppression d’une commande de consentement en double dans le dataLayer.
* Mise à jour du bundle @synapxlab/cookie-consent en version 2.5.1.

= 1.0.0 =
* Première version.
* Bannière conforme au RGPD et aux recommandations de la CNIL, avec blocage des scripts tiers avant consentement.
* Google Consent Mode v2.
* Mode autonome sans clé API ou preuve de consentement via le service SynapxLab avec une clé API facultative.
* Réglages : langue, thème, liens légaux, services par catégorie.

== Upgrade Notice ==

= 1.0.1 =
Mettez à jour si votre site utilise Google Consent Mode, Google Ads ou Analytics : le ciblage régional et l’application des valeurs par défaut avant les balises Google sont corrigés.

= 1.0.0 =
Première version publique du plugin.
