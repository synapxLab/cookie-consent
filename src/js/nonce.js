/**
 * Nonce CSP pour la feuille injectée à l'exécution.
 *
 * POURQUOI CE FICHIER EXISTE, ET POURQUOI IL EST IMPORTÉ EN PREMIER.
 * `style-loader` insère la feuille du SDK par un `<style>` créé à l'exécution. Un site
 * qui applique une CSP stricte (`style-src 'self'`, sans `unsafe-inline`) refuse cette
 * balise si elle ne porte pas le nonce de la réponse — et la bannière s'affiche alors
 * SANS AUCUNE mise en forme, sans erreur serveur, sans page blanche : rien ne le
 * signale hors de la console du navigateur.
 *
 * `__webpack_nonce__` est la variable que style-loader lit au moment d'insérer la
 * balise. Elle doit être posée AVANT que la feuille ne soit importée : les imports ES
 * sont hissés et évalués dans l'ordre, d'où ce module séparé, importé en tête.
 *
 * CONTRAT POUR LE SITE HÔTE — rien à configurer, une balise suffit :
 *
 *     <meta name="csp-nonce" content="LE_NONCE_DE_LA_RÉPONSE">
 *
 * Sans cette balise, le comportement est inchangé : la variable reste vide, et un site
 * qui autorise `unsafe-inline` continue de fonctionner comme avant.
 */
try {
  const balise = document.querySelector('meta[name="csp-nonce"]');
  if (balise && balise.content) {
    // eslint-disable-next-line no-undef, camelcase
    __webpack_nonce__ = balise.content;
  }
} catch (e) {
  // Un document indisponible (rendu côté serveur, test hors DOM) ne doit pas
  // empêcher le chargement du SDK : le nonce est un confort, pas une dépendance.
}
