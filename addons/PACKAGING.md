# Contenus pour les marketplaces — document préparatoire

> **Statut : brouillon (document de travail).** Ces textes doivent être relus et finalisés avant
> toute soumission publique. Règle absolue : ne publier aucun chiffre inventé (pas de « X partenaires »
> ni de statistiques invérifiables). Toute affirmation doit correspondre aux fonctions réelles du produit.

## Produit

- **Nom** : Synapx Cookie Consent
- **Base** : package npm `@synapxlab/cookie-consent` v2.5.0 — bannière de consentement aux cookies RGPD/CNIL en JavaScript natif, sans dépendance.
- **Points différenciants réels** (vérifiés dans le code) :
  - Blocage automatique des scripts tiers avant consentement.
  - Google Consent Mode v2 natif.
  - Fonctionne **sans compte ni clé API** : utilisation entièrement autonome, sans transmission de données.
  - Clé API **facultative** : journalisation de la preuve de consentement (conforme aux recommandations de la CNIL, purge ≤ 13 mois, pseudonymisation de l'adresse IP et de l'agent utilisateur côté serveur).
  - Multilingue, léger, open source (MIT).

## Textes — WordPress.org

- **Titre** : Synapx Cookie Consent – Bannière RGPD/CNIL
- **Description courte (≤150 car.)** :
  « Bannière RGPD/CNIL légère et sans dépendance. Blocage préalable des scripts tiers, Google Consent Mode v2 et preuve de consentement facultative. »
- **Description longue** : reprendre les points différenciants ci-dessus, ajouter une section « Avec ou sans clé API » présentant les deux modes, puis une section consacrée à la vie privée (aucune donnée transmise sans clé API).
- **Tags** : cookie, consent, gdpr, rgpd, cnil, privacy, cookie-banner
- Le fichier `readme.txt` du plugin (addons/wordpress/…) constitue la source à relire et à finaliser.

## Textes — PrestaShop Addons

- **Nom du module** : Synapx Cookie Consent (RGPD/CNIL)
- **Accroche** : « Déployez une bannière de consentement RGPD/CNIL avec blocage des scripts tiers avant consentement et Google Consent Mode v2. »
- **Description** : reprendre les mêmes points en les adaptant au commerce électronique (compatibilité 1.7/8.x, configuration depuis le back-office, langue de la boutique, lien vers la page CMS de confidentialité).
- **Catégorie Addons** : Administration > Législation (RGPD).

## Images

Sources existantes dans `imag/` (racine du repo) :

| Fichier | Dimensions | Usage |
|---|---|---|
| icon-128x128.png | 128×128 | Icône wordpress.org (ressources SVN) |
| icon-256x256.png | 256×256 | Icône wordpress.org haute résolution |
| banner-772x250.png | 772×250 | Bannière wordpress.org |
| banner-1544x500.png | 1544×500 | Bannière wordpress.org haute résolution |
| icon.svg / banner.svg | vectoriel | Fichiers sources modifiables |
| screenshot-1.png | 1227×699 | Capture de la bannière |

Captures générées (Chromium headless, 1280×800, dans `imag/shots/`) :
- `screenshot-1-banner.png` — bannière au premier chargement (nom d'entreprise « Ma Boutique »).
- `screenshot-2-preferences.png` — panneau de préférences détaillées (3 catégories de cookies).

À produire (éléments manquants) :
- **WordPress** : screenshot-3 (page de réglages de l'administration — nécessite une instance WordPress), screenshot-4 (Google Consent Mode v2 et preuve de consentement). Format PNG, nommage `screenshot-N.png`, légendes dans readme.txt.
- **PrestaShop** : logo.png 128×128 (copie de icon-128x128.png, déjà intégrée au module), image de la configuration back-office (nécessite une boutique PrestaShop), journal des consentements.

## Checklist avant soumission

- [ ] Textes relus et finalisés (readme.txt, description Addons, PACKAGING.md).
- [ ] Aucun chiffre invérifiable dans les textes.
- [ ] Captures d'écran à jour avec la version publiée.
- [ ] Version du plugin/module alignée sur la version npm embarquée (2.5.0).
