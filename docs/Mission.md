Tu travailles sur le projet **@synapxlab/cookie-consent**, une CMP open source développée par SynapxLab.

## Mission

Réalise un audit approfondi du projet, puis corrige directement tout ce qui peut l’être dans le dépôt.

L’objectif n’est pas de reconstruire le projet, mais de le rendre :

* techniquement cohérent ;
* correctement documenté ;
* crédible commercialement ;
* prudent juridiquement ;
* simple à installer et à utiliser ;
* cohérent avec l’écosystème actuel SynapxLab et Adliss.

## Contexte du produit

Le projet ne doit pas être présenté comme une simple bannière de cookies.

Il s’agit d’une CMP open source comprenant notamment :

* blocage des scripts avant consentement ;
* gestion des préférences par catégories ;
* services tiers préconfigurés ;
* Google Consent Mode v2 ;
* plusieurs langues ;
* API JavaScript ;
* événements JavaScript ;
* prise en charge des scripts dynamiques ;
* prise en charge de `type="text/plain"` ;
* installation par NPM ou CDN ;
* journalisation facultative du consentement ;
* aucune dépendance ;
* licence MIT.

Le positionnement économique attendu est le suivant :

1. **Cookie Core**

   * composant minimal ;
   * très léger ;
   * gratuit ;
   * destiné aux développeurs qui veulent garder la maîtrise de l’intégration.

2. **Cookie Consent**

   * CMP complète ;
   * gestion des services ;
   * blocage automatique ;
   * multilingue ;
   * Consent Mode ;
   * API et événements ;
   * open source.

3. **Consent Logger**

   * service complémentaire ;
   * journalisation ;
   * conservation de preuves ;
   * historique des versions ;
   * exports ;
   * accompagnement ;
   * offre commerciale distincte du composant open source.

Le produit open source doit rester réellement utilisable sans souscrire au logger.

## Audit demandé

### 1. Audit du dépôt

Analyse l’ensemble du dépôt :

* README ;
* documentation ;
* exemples ;
* fichiers JavaScript et TypeScript ;
* fichiers CSS ;
* traductions ;
* configuration NPM ;
* package.json ;
* exports du package ;
* builds distribués ;
* références aux CDN ;
* tests ;
* licences ;
* liens ;
* noms de domaines ;
* adresses électroniques ;
* mentions commerciales ;
* mentions juridiques ;
* ancienne terminologie.

Recherche notamment :

* les références obsolètes à Administralis ;
* les références qui devraient maintenant mentionner Adliss ;
* les incohérences entre Synapx, SynapxLab et les domaines utilisés ;
* les adresses électroniques différentes selon les fichiers ;
* les liens morts ;
* les exemples qui ne correspondent plus à l’API ;
* les fonctions documentées mais absentes ;
* les fonctions présentes mais non documentées ;
* les différences entre le README GitHub et la documentation du site ;
* les promesses qui ne correspondent pas réellement au code.

### 2. Audit technique

Vérifie en particulier :

* que les scripts soumis au consentement sont réellement bloqués avant accord ;
* qu’aucune requête tierce n’est déclenchée prématurément ;
* le fonctionnement de `type="text/plain"` ;
* le chargement conditionnel des scripts ;
* les scripts dynamiques ;
* les changements de consentement après le chargement de la page ;
* le retrait du consentement ;
* les événements personnalisés ;
* l’API publique ;
* Google Consent Mode v2 ;
* le fonctionnement sans logger ;
* la persistance locale ;
* la durée et le format des cookies ou du stockage local ;
* le comportement en cas d’erreur réseau ;
* le comportement lorsque JavaScript est partiellement indisponible ;
* l’accessibilité clavier ;
* les attributs ARIA ;
* le focus ;
* les contrastes ;
* le responsive ;
* la compatibilité SPA ;
* les risques XSS ;
* les injections HTML ;
* les risques liés aux configurations fournies par l’intégrateur.

Teste ou vérifie les API de ce type :

```js
window.CookieConsent.hasConsent('statistics');

document.addEventListener('cookieConsentChanged', event => {
    console.log(event.detail.preferences);
});
```

Ne présume pas que ces API fonctionnent uniquement parce qu’elles sont présentes dans la documentation.

### 3. Audit du package NPM

Contrôle :

* le nom exact du package ;
* la portée `@synapxlab` ;
* la version ;
* les exports ESM et CommonJS ;
* les types TypeScript ;
* les fichiers réellement publiés ;
* les champs `main`, `module`, `exports`, `types` et `files` ;
* la déclaration `sideEffects` ;
* la licence ;
* le dépôt GitHub ;
* la page d’accueil ;
* les mots-clés ;
* la compatibilité avec les bundlers modernes ;
* l’import CSS ;
* l’installation avec npm, pnpm et yarn.

Produis des exemples réellement fonctionnels pour :

* HTML avec CDN ;
* JavaScript vanilla ;
* installation NPM ;
* Vite ;
* React ;
* Vue ;
* application SPA.

Ne crée pas de fausses intégrations si le package ne les permet pas encore. Dans ce cas, documente clairement la limite ou implémente une solution propre.

### 4. Audit du poids

Mesure précisément :

* la taille source ;
* la taille minifiée ;
* la taille gzip ;
* la taille Brotli si possible ;
* la taille du CSS ;
* la taille du JavaScript ;
* la part occupée par les traductions et les services préconfigurés.

Ne qualifie pas automatiquement le package principal d’« ultra léger » si son poids ne le justifie pas.

Réserve éventuellement cette promesse à Cookie Core si les mesures sont cohérentes.

Cherche les possibilités d’optimisation sans casser l’API :

* suppression de code mort ;
* découpage des traductions ;
* chargement à la demande ;
* séparation du cœur et des services ;
* tree-shaking ;
* builds minimal et complet.

### 5. Audit documentaire

Réécris la documentation autour d’une structure claire :

1. présentation ;
2. fonctionnalités ;
3. démonstration minimale ;
4. installation ;
5. configuration ;
6. catégories ;
7. services ;
8. blocage des scripts ;
9. API JavaScript ;
10. événements ;
11. Consent Mode v2 ;
12. SPA et scripts dynamiques ;
13. journalisation facultative ;
14. accessibilité ;
15. sécurité ;
16. migration ;
17. résolution des problèmes ;
18. licence et contribution.

La documentation doit clairement différencier :

* ce qui est exécuté dans le navigateur ;
* ce qui nécessite un serveur ;
* ce qui appartient au composant open source ;
* ce qui dépend du service Consent Logger ;
* ce qui est automatique ;
* ce que l’intégrateur doit configurer lui-même.

Ajoute un exemple minimal pouvant être copié-collé.

Ajoute ensuite un exemple complet, mais ne transforme pas le README en argumentaire commercial interminable.

### 6. Prudence juridique

Le projet peut aider à mettre en œuvre une gestion du consentement, mais il ne doit pas promettre à lui seul une conformité juridique absolue.

Corrige les formulations trop catégoriques, notamment autour de phrases comme :

* « conforme RGPD » ;
* « conforme CNIL » ;
* « journalisation obligatoire » ;
* « preuve juridiquement valide » ;
* « conservation obligatoire pendant cinq ans » ;
* « durée CNIL de treize mois plus cinq ans ».

Privilégie des formulations prudentes :

* « aide à mettre en œuvre » ;
* « conçu pour faciliter » ;
* « doit être configuré selon les traitements réellement utilisés » ;
* « la responsabilité finale appartient au responsable du traitement » ;
* « les durées de conservation doivent être définies selon le contexte juridique et les finalités ».

Distingue clairement :

* la durée de vie des traceurs ;
* la durée de validité ou de renouvellement du choix ;
* la conservation d’une preuve de consentement ;
* la conservation des journaux techniques ;
* les obligations propres à chaque responsable de traitement.

Ne donne pas de conclusion juridique définitive sans source.

Ajoute un avertissement précisant que la documentation ne constitue pas un conseil juridique.

### 7. Vérification des extensions

Vérifie les affirmations concernant :

* WordPress ;
* PrestaShop ;
* leurs marketplaces officielles ;
* les liens de téléchargement ;
* leur disponibilité réelle ;
* leur maintenance ;
* leur compatibilité avec la version actuelle du composant.

Une extension non publiée ne doit pas être présentée comme disponible sur une marketplace officielle.

Utilise plutôt des mentions explicites telles que :

* disponible ;
* en bêta ;
* en cours de validation ;
* prévue ;
* dépôt séparé ;
* non maintenue.

Ne laisse aucune affirmation invérifiable.

### 8. Identité et cohérence de marque

Uniformise les références entre :

* Synapx ;
* SynapxLab ;
* `synapx.fr` ;
* `synapxlab.com` ;
* l’organisation GitHub ;
* le package NPM ;
* les adresses de contact.

Utilise **Adliss** à la place d’Administralis lorsqu’il est question du produit actuel.

Ne remplace toutefois pas aveuglément les anciens noms lorsqu’ils font partie d’un historique, d’une URL encore valide ou d’une contrainte de compatibilité.

## Contraintes

* Ne casse pas l’API publique sans nécessité.
* Toute rupture doit être justifiée et documentée.
* Prévois une compatibilité ascendante lorsque cela reste raisonnable.
* Ne supprime pas une fonctionnalité simplement parce qu’elle est mal documentée.
* Ne prétends pas avoir testé ce qui ne l’a pas été.
* Ne fabrique aucune statistique, certification, publication ou validation officielle.
* Ne transforme pas la documentation en discours marketing creux.
* Ne donne pas de leçon juridique.
* Ne rends pas le logger indispensable au fonctionnement de la CMP.
* Ne change pas le nom du package sans justification majeure.
* Respecte la licence MIT.
* Travaille directement dans le dépôt.

## Méthode de travail

1. Explore d’abord le dépôt complet.
2. Identifie l’architecture réelle.
3. Compare le code, le README, les exemples et les métadonnées NPM.
4. Crée un état initial dans un fichier d’audit.
5. Classe les problèmes par criticité :

   * bloquant ;
   * important ;
   * amélioration ;
   * cosmétique.
6. Corrige les problèmes bloquants et importants.
7. Ajoute ou améliore les tests.
8. Exécute les tests et le build.
9. Mesure les bundles générés.
10. Mets à jour la documentation.
11. Vérifie le diff final.
12. Produis un rapport de mission.

## Livrables

Crée au minimum :

### `AUDIT_COOKIE_CONSENT.md`

Avec :

* résumé exécutif ;
* architecture observée ;
* fonctionnalités réellement disponibles ;
* problèmes constatés ;
* incohérences documentaires ;
* risques techniques ;
* risques de sécurité ;
* problèmes d’accessibilité ;
* points juridiques à reformuler ;
* mesures de poids ;
* corrections réalisées ;
* corrections non réalisées ;
* recommandations futures.

### `CHANGELOG_AUDIT.md`

Avec la liste précise des modifications apportées.

### Documentation corrigée

Mets à jour les fichiers existants plutôt que de créer plusieurs documentations concurrentes.

### Tests

Ajoute des tests ciblés concernant au minimum :

* consentement accepté ;
* consentement refusé ;
* consentement partiel ;
* retrait du consentement ;
* script bloqué avant consentement ;
* script chargé après consentement ;
* persistance des préférences ;
* émission des événements ;
* utilisation sans logger ;
* configuration invalide.

## Rapport final attendu

À la fin, donne un rapport synthétique avec :

* les fichiers modifiés ;
* les principales erreurs trouvées ;
* les corrections effectuées ;
* les tests exécutés ;
* leur résultat ;
* les tailles mesurées ;
* les éventuelles ruptures de compatibilité ;
* les points qui nécessitent encore une validation humaine ;
* les points juridiques qui doivent être relus par un professionnel.

Ne te contente pas de produire des recommandations : réalise les corrections possibles directement dans le projet.
