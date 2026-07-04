# Recette locale des addons

Environnements Docker jetables pour valider le plugin WordPress et le module
PrestaShop en conditions réelles avant soumission. Aucun impact sur le serveur :
tout vit dans des conteneurs, supprimés avec `down -v`.

## Prérequis

- Docker et le plugin Compose (`docker compose version`).
- Les addons présents dans `../wordpress/` et `../prestashop/` (dépôt cloné).

## WordPress

```bash
docker compose -f docker-compose.wordpress.yml up -d
```

1. Ouvrir http://localhost:8082 et dérouler l'installation WordPress.
2. `Extensions > Extensions installées` : activer **Synapx Cookie Consent**.
3. `Réglages > Cookie Consent` : configurer, enregistrer.

Purge complète : `docker compose -f docker-compose.wordpress.yml down -v`.

## PrestaShop

```bash
docker compose -f docker-compose.prestashop.yml up -d
```

1. Ouvrir http://localhost:8083 (installation automatique au premier lancement).
2. Back-office `/admin-dev` : `Modules > Gestionnaire de modules`, installer
   **SynapxLab Cookie Consent**, puis « Configurer ».

Compatibilité 1.7 : remplacer l'image par `prestashop/prestashop:1.7-apache`
dans `docker-compose.prestashop.yml`, puis relancer avec `down -v` avant `up -d`.

Purge complète : `docker compose -f docker-compose.prestashop.yml down -v`.

## Checklist de recette (WordPress et PrestaShop)

### Affichage et blocage
- [ ] La bannière apparaît dès le **premier** chargement, avant tout script tiers.
- [ ] `cookie.js` est bien chargé dans le `<head>`, avant les autres scripts.
- [ ] Aucun script tiers (GA4, Pixel…) n'est exécuté avant le consentement.
- [ ] « Tout accepter », « Tout refuser » et « Personnaliser » fonctionnent.
- [ ] Le choix est mémorisé après rechargement ; le bouton flottant rouvre le panneau.

### Configuration
- [ ] **Sans clé API** : aucune requête vers `cookie.synapx.fr` (onglet Réseau).
- [ ] **Avec clé API** : un POST de preuve de consentement part vers l'endpoint.
- [ ] Langue forcée : la bannière s'affiche dans la langue choisie.
- [ ] Langue automatique : la bannière suit la langue du site / du navigateur.
- [ ] Google Consent Mode v2 : `dataLayer` reçoit les `consent` attendus.
- [ ] Le lien Politique de confidentialité pointe vers la bonne page.

### Cycle de vie
- [ ] Activation sans erreur PHP (avec `WP_DEBUG` / `PS_DEV_MODE` actifs).
- [ ] Désactivation puis réactivation : réglages conservés.
- [ ] Désinstallation : options nettoyées, bannière retirée du front.

### Console
- [ ] Aucune erreur JavaScript en console sur le front.
- [ ] Aucune notice/warning PHP dans les logs du conteneur.
