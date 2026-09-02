---
slug: csp-sans-unsafe-inline
mission: rendre le SDK utilisable sous une CSP stricte (sans style-src 'unsafe-inline')
perimetre_ecriture:
  - src/js/cookie.js
  - src/js/nonce.js
  - src/scss/cookie.scss
etat: terminee
heartbeat: 2026-09-02T18:20
---

Constaté sur habilo.fr le 02/09/2026 : sous `style-src 'self'`, la bannière s'affiche
ENTIÈREMENT SANS MISE EN FORME, sans erreur serveur — seule la console le dit.

Deux causes : 10 attributs `style=` et un `.style.cssText` dans le HTML injecté (qu'aucun
nonce ni hash ne peut autoriser, la spec l'exclut pour les attributs), et la feuille
`<style>` de style-loader, qui accepte un nonce mais n'en reçoit aucun.

Aucune mention de CSP dans README, INTEGRATION ni docs/. Le défaut vaut pour les
8 domaines branchés.

## Fait

- 10 attributs `style=` et 1 `.style.cssText` remplacés par des classes (`pmcpli-hidden`,
  `pmcpli-fab`, `pmcpli-fab-icone`, `visually-hidden`), règles ajoutées à `cookie.scss`.
- `src/js/nonce.js`, importé EN PREMIER : lit `<meta name="csp-nonce">` et le passe à
  style-loader par `__webpack_nonce__`. Rien à configurer côté site hôte.
- Les 31 affectations `el.style.prop = …` sont conservées : la CSP ne les bloque pas,
  seuls les attributs et `cssText` le sont.

## Deux pièges rencontrés

1. **Attribut `class` en double.** Remplacer `style="display:none;"` par `class="…"` sur
   une balise qui portait DÉJÀ un `class` plus haut donne deux attributs : le navigateur
   garde le premier et ignore le second. La bannière avait disparu, sans erreur.
2. **Ordre dans la feuille.** `.pmcpli-hidden` doit venir APRÈS `.pmcpli-fab` (même
   spécificité, l'ordre tranche) et SANS `!important` — un `!important` battrait les
   `style.display` en ligne par lesquels le SDK ouvre et ferme la bannière.

## Preuve

habilo.fr.lan sous `style-src 'self' 'nonce-…'`, sans `unsafe-inline` : bannière
complète, mise en forme correcte, **zéro violation** en console. Avant le correctif :
bannière entièrement nue et 6 violations.

## Régression introduite le 02/09, trouvée par test et corrigée

Le remplacement des `style="display:none"` par une classe faisait **revenir le bandeau à
chaque chargement**, alors même que le choix était bien enregistré en localStorage.

Cause : un attribut `style` bat TOUTE règle de feuille. Une classe, non. Or deux règles
existantes la dominaient — `#politecookiebanner` (1-0-0, `display: grid`) et
`#politecookiebanner .pmcpli-*` (1-0-1). La classe nue (0-1-0) perdait contre les deux.

Correctif : trois sélecteurs, dont deux qualifiés par l'identifiant (1-1-0). Toujours sans
`!important`, qui battrait les `style.display` par lesquels le SDK ouvre et ferme.

⚠️ **Leçon générale** : retirer un style en ligne ne se fait jamais à l'aveugle. Il faut
d'abord chercher quelles règles visaient déjà l'élément, et écrire la classe de
remplacement AU MOINS aussi spécifique. Le lint ne voit rien, la console non plus — seul
un test de parcours le montre.

Prouvé par Playwright, contexte unique : premier chargement bandeau visible ; après
« Tout Accepter » masqué et choix enregistré ; **après rechargement, masqué** ; sur une
autre page du même navigateur, masqué. Et après « Tout Refuser », le bouton flottant est
visible et le clic rouvre bien le bandeau.
