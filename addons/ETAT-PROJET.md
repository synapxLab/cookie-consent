# État du projet — cookie-consent & addons

_Bilan technique au 3 juillet 2026. Document de travail interne (contient des points de
sécurité) — ne pas publier tel quel._

## 1. Synthèse

Le package npm `@synapxlab/cookie-consent` v2.5.0 est publié et fonctionnel. Deux
addons (WordPress et PrestaShop) ont été créés, revus et packagés au niveau
distribution. Le site vitrine synapx.fr a été corrigé sur plusieurs failles de
sécurité. Il reste des décisions et un test en conditions réelles qui dépendent de
toi ou d'un environnement dédié.

## 2. Addons — prêts pour soumission

| Élément | WordPress | PrestaShop |
|---|---|---|
| Code | `addons/wordpress/synapx-cookie-consent/` | `addons/prestashop/synapxcookieconsent/` |
| Zip | `addons/build/synapx-cookie-consent-1.0.0.zip` | `addons/build/synapxcookieconsent-1.0.0.zip` |
| Guide mise en prod | `addons/wordpress/GUIDE-MISE-EN-PROD.md` | `addons/prestashop/GUIDE-MISE-EN-PROD.md` |
| Licence GPLv2 | ✅ `LICENSE` | ✅ `LICENSE` |
| i18n | ✅ `languages/*.pot` (60 chaînes) | source déjà en français |
| Bundle local | ✅ identique à `dist/cookie.js` | ✅ identique à `dist/cookie.js` |

- Deux modes gérés : **sans clé API** (autonome) et **avec clé API** (preuve de consentement).
- 13 langues, Google Consent Mode v2, blocage des scripts tiers.
- `php -l` vert sur tous les fichiers ; en-têtes et versions cohérents (1.0.0).
- Bug critique corrigé : la bannière WordPress ne s'affichait pas au premier chargement
  (init dans le `<head>` avant `document.body`) — vérifié en navigateur headless.
- Recette conteneurisée fournie : `addons/test/` (docker-compose WP + PrestaShop, checklist).
- Captures : `imag/shots/screenshot-1-banner.png`, `screenshot-2-preferences.png`.

## 3. Site synapx.fr — corrigé

- Backdoor de mot de passe maître supprimée (connexion sur n'importe quel compte).
- `display_errors` coupé, erreurs journalisées hors webroot.
- `php-error.log` et `info.php` sortis du webroot ; `.htaccess` bloque `.log/.yml/.env/.sql/.ppk`.
- Comparatif CMP : structure HTML du tableau réparée, version à jour (v2.5.0).
- Identifiants SMTP Mailjet déplacés du code vers `config.yml` (section `smtp`).
- « 1000 partenaires » : vérifié, aucun claim de ce type sur le site.

## 4. À décider ou exécuter (hors périmètre autonome)

1. **Sécurité — à faire d'urgence** : rotationner les identifiants Mailjet (compromis
   car présents dans l'historique) et les clés SSH privées à la racine de synapx.fr.
2. **Décision produit** : le SDK contacte `version.synapx.fr` (télémétrie de version)
   même sans clé API. Contradiction avec « aucune donnée sortante ». Si un mode
   strictement zéro-sortie est voulu, prévoir un opt-out non-cassant + rebuild de `dist/`.
3. **Test en conditions réelles** : lancer la recette `addons/test/` sur une machine
   avec Docker (absent de la R440) et dérouler la checklist.
4. **Juridique** : faire valider le disclaimer d'auto-notation du comparatif.
5. **Rédaction** : passe Codex sur les nouveaux textes (`addons/test/README.md`,
   sections « Recette locale » des guides).
6. **Git** : aucun commit effectué (repos cookie-consent et synapx.fr) — en attente de feu vert.
