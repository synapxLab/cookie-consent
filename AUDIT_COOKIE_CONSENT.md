# Audit `@synapxlab/cookie-consent`

Document interne — 21 juillet 2026. Dépôt `/data/vhosts/@synapxlab/cookie-consent`, branche `feat/addons-wp-prestashop`.
L'audit de la page produit `/sdk/Cookie_consent/` fait l'objet d'un document distinct : `synapx.fr/docs/AUDIT_PAGE_COOKIE_CONSENT.md`.

---

## Risques liés aux installations existantes

Section demandée par `docs/missionsuite.md`.

### Préalable : le chiffre d'adoption doit être corrigé

`missionsuite.md` part de « environ **323 téléchargements NPM par semaine** ». **Ce chiffre ne correspond pas aux données du registre npm** (relevé du 21/07/2026, `api.npmjs.org`) :

| Période | Téléchargements |
|---|---|
| Dernière semaine (14 → 20/07/2026) | **12** |
| Dernier mois (21/06 → 20/07/2026) | **128** |
| Total depuis la publication initiale (15/09/2025) | **1 910** |
| Pic journalier | 199, **le jour même de la première publication** |
| Meilleure semaine glissante | 390, **semaine de la publication initiale** |

Répartition par version sur la dernière semaine : `2.1.3` → 6, `2.5.0` → 6.

Le volume réel est donc de l'ordre de **12 à 30 téléchargements par semaine**, très majoritairement des CI, miroirs et scanners. Le chiffre de 323 correspond approximativement au pic de la semaine de lancement, pas au régime actuel.

**Cela ne change pas la conclusion de `missionsuite.md`, cela en change l'échelle.** La prudence reste justifiée — deux versions distinctes sont téléchargées chaque semaine, ce qui indique au moins deux intégrations vivantes non alignées — mais le risque porte sur un petit nombre d'installations, pas sur un parc large. Les décisions ci-dessous sont prises en conséquence : compatibilité systématique, sans pour autant renoncer à corriger des défauts réels.

### Versions publiées

| Version | Date | Taille dépaquetée | `main` | Contenu publié |
|---|---|---|---|---|
| 1.0.0 | 15/09/2025 | 55,9 Ko | `dist/cookie.js` | `dist` + **`src`** |
| 2.0.0 | 15/09/2025 | 55,9 Ko | `dist/cookie.js` | `dist` + **`src`** |
| 2.1.0 | 15/09/2025 | 77,3 Ko | `dist/cookie.js` | `dist` + **`src`** |
| 2.1.1 | 16/09/2025 | 87,7 Ko | `dist/cookie.js` | `dist` + **`src`** |
| 2.1.2 | 19/09/2025 | 66,4 Ko | `dist/cookie.js` | `dist` seul |
| 2.1.3 | 15/10/2025 | 156,5 Ko | `dist/cookie.js` | `dist` seul |
| 2.5.0 | 15/05/2026 | 143,0 Ko | `dist/cookie.js` | `dist` seul |
| 2.5.1 | 21/07/2026 | 145,0 Ko | `dist/cookie.js` | `dist` seul |

`dist-tags.latest` = `2.5.1`. Aucun tag `next`/`beta`. Toutes les versions restent accessibles sur le registre ; aucune n'est dépréciée ni dépubliée. Le champ `main` n'a **jamais** changé — c'est le principal facteur de stabilité du paquet.

### API publiques historiques

Membres de `window.CookieConsent`, extraits des bundles réellement publiés :

| Version | API exposée |
|---|---|
| 1.0.0 – 2.0.0 | *(aucun objet global — bannière autonome uniquement)* |
| 2.1.0 – 2.1.1 | `open`, `reset`, `getPreferences`, `hasConsent` |
| 2.1.2 | + `enableLogging`, `disableLogging`, `getLoggingConfig` |
| 2.1.3 | `open`, `reset`, `getPreferences`, `hasConsent`, **`init`**, `disableLogging`, **`getConfig`** |
| 2.5.0 – 2.5.1 | + `getGoogleConsent`, `updateGoogleConsent` |

**Rupture cassante déjà distribuée, non documentée :** `enableLogging()` et `getLoggingConfig()`, introduits en **2.1.2**, ont été **supprimés en 2.1.3** — une version *patch*. C'est une violation du versionnage sémantique. L'impact réel est faible (2.1.2 n'a été `latest` que du 19/09 au 15/10/2025) mais le précédent doit être connu : il n'existe aujourd'hui **aucune procédure de dépréciation** dans le projet.

Hors ce cas, l'évolution de l'API est purement **additive** depuis 2.1.0. Les quatre méthodes d'origine (`open`, `reset`, `getPreferences`, `hasConsent`) sont présentes dans toutes les versions depuis, avec des signatures inchangées.

### Formats de stockage utilisés

Clé `localStorage` : **`politecookiebanner`** — **inchangée de 1.0.0 à 2.5.1**. Aucune migration de clé n'a jamais été nécessaire, et aucune ne doit l'être.

Deux formats de valeur se sont succédé :

| Versions | Format |
|---|---|
| 1.0.0 → 2.1.2 | Objet **plat** : `{statistics, marketing, cookies}` |
| 2.1.3 → 2.5.1 | Objet **enveloppé** : `{data:{…}, timestamp, expiresAt}`, puis `+ consent_id, consent_timestamp` en 2.5.0 |

`loadPrefs()` gère explicitement les deux (`if (parsed.data) … else return parsed`) : **la lecture est rétrocompatible**, c'est correct et doit le rester.

Conséquence secondaire à connaître : un enregistrement au format plat n'a **pas d'`expiresAt`**. Le consentement d'un visiteur venu du temps des versions ≤ 2.1.2 **n'expire donc jamais** et ne sera jamais renouvelé. Ce point mérite une décision produit (forcer une réexpression du choix au-delà d'une certaine ancienneté), non traitée ici car elle ferait réapparaître la bannière — exactement ce que `missionsuite.md` demande d'éviter sans arbitrage.

Autres clés écrites : `cookie_consent_device_id` (depuis 2.1.3, uniquement si `logger.anonymousId`), et les identifiants de cases `politecookiecheckbox*`.

### Régression identifiée et corrigée : catégorie `cookies` → `functional`

**C'est le risque de régression le plus sérieux du parc installé, et il était actif en production.**

En 2.5.0, la troisième catégorie a été renommée `cookies` → `functional` (visible dans les identifiants de cases : `politecookiecheckboxcookies` → `politecookiecheckboxfunctional`). Une reprise avait bien été prévue pour les **options d'`init()`** (`src/js/cookie.js`, avertissement de dépréciation), mais **aucune pour les préférences déjà enregistrées**.

Conséquence pour tout visiteur ayant consenti avec une version ≤ 2.1.3 :

- `loadPrefs()` retourne `{…, cookies: true}` ;
- `prefs.functional` vaut `undefined` → **les services fonctionnels (Intercom, Crisp, HubSpot, Segment) ne sont plus jamais chargés** ;
- `releaseByConsent()` ne connaît pas la clé `cookies` → **les scripts marqués `data-cookie-category="cookies"` ne sont jamais restaurés** ;
- le consentement restant valide, **la bannière ne se réaffiche pas** : l'utilisateur n'a aucun moyen de corriger la situation.

Une régression silencieuse, sans erreur console, invisible en test sur un navigateur neuf — elle ne se manifeste que sur un profil ayant consenti avant mai 2026.

**Correctif appliqué** (`src/js/cookie.js`) : une fonction `migratePrefs()` recopie `cookies` vers `functional` à la lecture lorsque `functional` est absent, et `releaseByConsent()` traite `cookies` comme un alias de `functional`. Aucune écriture, aucune modification de la valeur stockée, aucun changement de clé : la reprise est faite **en lecture seule**, à chaque chargement.

### Bug corrigé : blocage manuel `type="text/plain"` sans effet

Défaut distinct, découvert pendant l'audit et **présent dans toutes les versions publiées**.

La documentation décrit longuement le blocage manuel :

```html
<script type="text/plain" data-cookie-category="statistics" src="..."></script>
```

Or `scanAndFreezeThirdParty()` ne sélectionnait que `script[src], iframe[src]` et déduisait la catégorie **de l'URL**, en ignorant l'attribut `data-cookie-category`. Seul `freezeElement()` posait le marqueur `data-cookie-blocked="true"`, et `releaseByConsent()` ne restaure que les éléments portant ce marqueur.

Un élément neutralisé à la main par l'intégrateur n'était donc **jamais marqué, donc jamais restauré** : il restait inerte définitivement, quel que soit le consentement donné.

Vérifié en Chromium sur les trois cas (script inline, `src` d'URL inconnue, `src` d'URL reconnue) : **aucun n'était restauré**.

**Correctif appliqué** : `adoptManuallyBlocked()` sérialise les attributs d'origine des éléments `type="text/plain"` porteurs d'un `data-cookie-category` et les marque comme bloqués, ce qui les fait entrer dans le flux de restauration existant. Appelée depuis `scanAndFreezeThirdParty()` et, de façon idempotente, depuis `releaseByConsent()` pour être insensible à l'ordre d'appel.

**Nature du changement — à lire avant publication.** Ce correctif est une correction de conformité au comportement documenté, mais il **modifie le comportement observable en production** : des scripts jusqu'ici inertes chez les intégrateurs concernés vont commencer à s'exécuter après consentement. C'est le comportement attendu et annoncé, mais il doit être publié comme un changement de comportement explicite, jamais en catimini.

### Chemins CDN historiques

| Chemin | État |
|---|---|
| `https://cdn.jsdelivr.net/npm/@synapxlab/cookie-consent/dist/cookie.js` | **Valide** — chemin de référence du README, stable depuis 1.0.0 |
| `https://cdn.jsdelivr.net/npm/@synapxlab/cookie-consent/dist/cookie.min.js` | Répond via la minification à la volée de jsDelivr, **mais ce fichier n'existe pas dans le paquet**. Chemin à ne pas promouvoir. |
| `dist/bundle.js` | Construit mais **absent du champ `files`** : non publié, donc inaccessible via npm ou jsDelivr. |

Aucun CDN propriétaire. Le champ `main` n'ayant jamais bougé, les intégrations par CDN comme par bundler restent valides sur toute la plage de versions.

### Ajout non cassant : `CookieConsent.i18n`

La documentation proposait `import t from '@synapxlab/cookie-consent/translat'`. Cet import **fonctionnait de 1.0.0 à 2.1.1** (le paquet publiait alors `src/`) et a été **cassé silencieusement en 2.1.2**, quand `src/` est sorti du champ `files`. Depuis, aucun moyen fonctionnel d'ajouter une langue n'existait, alors que la documentation continuait de l'expliquer.

Le module de traduction est désormais exposé en `window.CookieConsent.i18n` (`setLocale`, `getLocale`, `add`, `dict`, `setVariables`, `getVariables`, `applyTemplate`). Ajout **purement additif**. Vérifié en Chromium : l'ajout d'une 14ᵉ langue puis son activation fonctionnent.

Republier `src/` dans `files` restaurerait aussi l'import historique. Non fait : cela alourdirait le paquet et l'ancien chemin est cassé depuis dix mois. **Décision à arbitrer.**

### Stratégie de compatibilité retenue

1. **Ne jamais changer** la clé `politecookiebanner` ni le champ `main`.
2. **Lecture tolérante, écriture stricte** : accepter tous les formats historiques en lecture, n'écrire que le format courant.
3. **Alias plutôt que renommage** : `cookies` reste accepté comme alias de `functional`, en options d'`init()`, en préférences stockées et en attribut `data-cookie-category`.
4. **Additif par défaut** : toute nouvelle capacité s'ajoute à l'API sans en retirer.
5. **Aucune suppression sans dépréciation préalable** annoncée sur au moins une version mineure — procédure inexistante aujourd'hui, à instaurer.

### Migrations nécessaires

Aucune migration à la charge des intégrateurs. Les deux correctifs opèrent en lecture, à l'exécution, sans intervention ni réécriture du stockage.

### Ce qui ne peut pas être modifié sans version majeure

- La clé `localStorage` `politecookiebanner`.
- Les noms `open`, `reset`, `getPreferences`, `hasConsent` et leurs signatures.
- Le nom du global `window.CookieConsent`.
- Le nom et la forme du `detail` de l'événement `cookieConsentChanged`.
- L'acceptation de `cookies` comme alias de `functional`.
- Le champ `main` pointant sur `dist/cookie.js`.
- Les identifiants de catégorie `statistics` et `marketing`.

### Version recommandée pour ces changements

**2.5.2** ne convient pas : le correctif `text/plain` modifie un comportement observable et `i18n` ajoute une API. **`2.6.0`** est le bon numéro (ajout de fonctionnalité + correction de comportement, sans rupture d'API).

La page produit a été alignée sur **2.6.0**. Si un autre numéro est retenu à la publication, les deux mentions de la page sont à mettre à jour.

### Angle mort persistant

Le projet n'a **aucun test automatisé** (`npm test` = `echo 'Tests à venir' && exit 0`). Les deux régressions décrites ci-dessus ont vécu en production sans être détectées, et rien n'empêche aujourd'hui qu'elles réapparaissent. Les tests de migration réclamés par `missionsuite.md` (point 23) supposent d'abord d'installer un runner — travail non engagé, faute d'arbitrage sur l'outillage.

Scénarios minimaux à couvrir en priorité, tous vérifiés manuellement en Chromium pendant cet audit :

| Scénario | Attendu | Vérifié |
|---|---|---|
| Aucun consentement | tous les scripts bloqués | ✅ |
| Refus total | tous les scripts bloqués | ✅ |
| Accord `statistics` seul | `statistics` exécuté, autres bloqués | ✅ |
| Préférences legacy `{cookies:true}` | catégorie fonctionnelle honorée, autres bloquées | ✅ |
| Accord total | tous les scripts exécutés | ✅ |
| Ajout d'une langue via `i18n.add()` | langue disponible et activable | ✅ |
