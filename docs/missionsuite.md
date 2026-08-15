## Contexte d’adoption à prendre très au sérieux

Le package `@synapxlab/cookie-consent` enregistre actuellement environ **323 téléchargements NPM par semaine**.

Le projet ne doit donc pas être traité comme un prototype inutilisé ou comme un dépôt pouvant être refondu librement.

Même si un téléchargement NPM ne correspond pas nécessairement à une installation unique — les chiffres pouvant inclure les CI/CD, réinstallations, builds automatisés et mises à jour — cette activité indique que le package est probablement déjà intégré dans plusieurs projets réels.

En conséquence :

* considère que des sites en production dépendent potentiellement de l’API actuelle ;
* évite toute rupture silencieuse ;
* conserve les anciens noms de fonctions lorsqu’une compatibilité raisonnable est possible ;
* ajoute des alias ou des avertissements de dépréciation avant toute suppression ;
* vérifie les chemins CDN actuellement publiés ;
* vérifie que les anciennes versions restent accessibles ;
* documente précisément les changements cassants ;
* propose un guide de migration lorsqu’une rupture est indispensable ;
* ne modifie pas les clés de stockage sans stratégie de migration ;
* ne modifie pas les catégories ou leurs identifiants sans compatibilité ;
* vérifie le comportement lors d’une mise à jour sur un site ayant déjà enregistré le consentement ;
* contrôle que les nouvelles versions ne provoquent pas la réapparition injustifiée de la bannière ;
* ajoute des tests de migration depuis les formats de préférences précédents ;
* respecte strictement le versionnage sémantique.

Avant toute correction importante, inspecte l’historique Git, les tags et les versions publiées sur NPM afin d’identifier les API et comportements déjà distribués.

Ajoute dans `AUDIT_COOKIE_CONSENT.md` une section :

### Risques liés aux installations existantes

Cette section devra contenir :

* les versions publiées ;
* les API publiques historiques ;
* les formats de stockage utilisés ;
* les chemins CDN historiques ;
* les changements présentant un risque de régression ;
* la stratégie de compatibilité choisie ;
* les migrations nécessaires ;
* les éléments qui ne peuvent pas être modifiés sans nouvelle version majeure.

L’objectif n’est plus seulement d’améliorer le package : il faut le faire évoluer sans casser les intégrations qui expliquent ses téléchargements actuels.
