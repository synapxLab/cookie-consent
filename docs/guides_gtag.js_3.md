Configurer le mode Consentement sur les sites Web



Cette page s'adresse aux développeurs qui gèrent leur propre solution de consentement sur leur site Web et qui souhaitent intégrer le mode Consentement. Pour en savoir plus sur le mode Consentement, consultez Présentation du mode Consentement. Si vous utilisez une plate-forme de gestion du consentement (CMP) pour obtenir le consentement utilisateur, découvrez comment configurer le mode Consentement avec une CMP.

Vous pouvez implémenter le mode Consentement de base ou avancé. Consultez les consignes de votre entreprise pour choisir une méthode d'implémentation et les valeurs par défaut à définir. En savoir plus sur la différence entre le mode Consentement de base et le mode Consentement avancé

Important : Le mode Consentement a été mis à jour en novembre 2023 et contient désormais deux paramètres supplémentaires. Si vous utilisez déjà le mode Consentement, passez au mode Consentement v2.
En savoir plus sur les modifications apportées au mode Consentement pour le trafic dans l'Espace économique européen (EEE)

Mode Consentement avancé Mode Consentement de base
Avant de commencer
Tenez compte des points suivants avant d'implémenter le mode Consentement :

Si vous utilisez Tag Manager et que vous souhaitez conserver votre propre bannière, nous vous recommandons de la charger via le conteneur Tag Manager. Pour ce faire, vous devez créer un modèle de mode Consentement. Vous pouvez également utiliser un modèle de mode Consentement de la galerie de modèles de la communauté.

Si vous utilisez gtag.js, assurez-vous d'avoir installé la balise Google sur chaque page de votre site Web. Le code du mode Consentement est ajouté à chaque page de votre site Web.

Configurer le mode Consentement
Pour configurer le mode Consentement, vous devez :
Avant qu'un utilisateur n'accorde son consentement : définissez l'état du consentement par défaut.
Mettez à jour l'état du consentement en fonction de l'interaction de l'utilisateur avec vos paramètres de consentement.
Important : Assurez-vous que les mises à jour du consentement sont suivies sur la page où elles se produisent, avant toute transition de page.
La balise Google effectue des actions, comme écrire des cookies ou envoyer des événements, en réponse à la commande pour s'assurer que les futurs événements incluront toutes les données de mesure.

Définir l'état du consentement par défaut
Définissez une valeur par défaut pour chaque type de consentement que vous utilisez. Par défaut, aucune valeur n'est définie pour le mode Consentement.

Il est recommandé de limiter les paramètres de consentement par défaut aux régions où vous diffusez des bannières de consentement auprès de vos visiteurs. Cela permet de conserver la qualité des mesures dans les régions où les bannières de consentement sont requises et où les balises Google ajustent leur comportement en conséquence. Vous évitez également toute perte de mesure lorsqu'aucune bannière de consentement n'est appliquée ou ne s'applique. Consultez la section Comportement spécifique à la région.

gtag.js
Tag Manager
Pour ajuster les capacités de mesure par défaut, appelez la commande gtag('consent', 'default', ...) sur chaque page de votre site avant toute commande qui envoie des données de mesure (comme config ou event).

Par exemple, pour définir le refus du consentement pour tous les paramètres par défaut :


gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied'
});
Facultatif : Intégrer les plates-formes de gestion du consentement asynchrones
Si votre bannière se charge de manière asynchrone, il est possible qu'elle ne s'exécute pas toujours avant vos balises Google. Pour gérer de telles situations, spécifiez wait_for_update avec une valeur en millisecondes pour contrôler le temps d'attente avant l'envoi des données.

Par exemple, pour refuser ad_storage sur une page spécifique par défaut, mais autoriser votre CMP à mettre à jour l'état du consentement, utilisez wait_for_update. Dans le code suivant, ad_storage est défini par défaut sur denied, et l'outil de consentement dispose de 500 millisecondes pour appeler gtag('consent', 'update', ...) avant le déclenchement des balises :

```js
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'wait_for_update': 500
  });
```

Mettre à jour l'état du consentement
gtag.js
Tag Manager
Pour envoyer l'état du consentement de l'utilisateur, utilisez la commande update. Étant donné que le mode Consentement n'enregistre pas les choix de consentement, mettez à jour l'état du consentement dès qu'un utilisateur interagit avec votre solution de gestion du consentement. Une fois que l'utilisateur a donné son consentement, conservez son choix et appelez la commande "update" en conséquence sur les pages suivantes.

Il vous incombe de vous assurer que les valeurs correctes sont définies pour tous les types de consentement. Pour en savoir plus sur les types acceptés, consultez la documentation de référence de l'API.

L'exemple de code suivant montre comment définir l'état du consentement sur granted lorsque l'utilisateur accepte toutes les options :

```js
<!-- Send consent updates when users interact with your consent banner -->
<script>
function allConsentGranted() {
  gtag('consent', 'update', {
    'ad_user_data': 'granted',
    'ad_personalization': 'granted',
    'ad_storage': 'granted',
    'analytics_storage': 'granted'
  });
}
</script>
<!-- Invoke your consent function when a user interacts with your banner -->
<body>
  ...
  <button onclick="allConsentGranted()">Accept all</button>
  ...
</body>
```



Modifier les choix de consentement des utilisateurs
Les utilisateurs peuvent modifier leurs préférences de consentement après leur interaction initiale. Par exemple, un utilisateur qui a initialement donné son consentement peut décider de le révoquer ultérieurement dans le panneau des paramètres de votre site Web.

gtag.js
Tag Manager
Pour mettre à jour l'état du consentement à tout moment, utilisez la commande update. Cette commande est utilisée pour toute modification de l'état du consentement, y compris pour passer de 'granted' à 'denied'.

Exemple : Retirer le consentement

Si un utilisateur a déjà donné son consentement pour analytics_storage et ad_storage, mais qu'il souhaite désormais le refuser, envoyez un appel update reflétant son nouveau choix :


// User updates their settings to deny consent
gtag('consent', 'update', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied'
});
Points à observer avant de configurer des événements :

Persistance : assurez-vous que les choix de consentement mis à jour de l'utilisateur sont conservés, par exemple dans un cookie propriétaire ou dans le stockage local, afin que l'état correct soit défini lors des chargements de page suivants.
Timing : appelez la commande de mise à jour dès que l'utilisateur confirme ses nouvelles préférences dans l'interface des paramètres de consentement de votre site.
Exemple d'implémentation
L'exemple suivant définit plusieurs paramètres du mode Consentement sur denied par défaut. Une fois que l'utilisateur a indiqué ses choix de consentement, les paramètres concernés sont définis sur granted.

Remarque : Les états du consentement définis dans les exemples suivants ne sont pas définitifs. Vous êtes responsable de la configuration du mode Consentement par défaut pour chacun de vos produits de mesure, afin qu'il corresponde au règlement de votre organisation.
gtag.js
Tag Manager
L'ordre du code est essentiel. Si votre code de consentement est appelé dans le désordre, les paramètres de consentement par défaut ne fonctionneront pas. Les spécificités peuvent varier en fonction des exigences de l'entreprise, mais en général, le code doit s'exécuter dans l'ordre suivant :

Chargez la balise Google. Il s'agit de votre code d'extrait par défaut. L'extrait par défaut doit être mis à jour (voir ci-dessous) pour inclure un appel à gtag('consent', 'default', ...).

Chargez votre solution de consentement. Si votre solution de consentement se charge de manière asynchrone, consultez Intégrer des plates-formes de gestion du consentement asynchrones pour savoir comment vous assurer que cela se produit dans le bon ordre.

Si votre solution de consentement ne le gère pas, appelez gtag('consent', 'update', ...) après que l'utilisateur a donné son consentement.


<script>
// Define dataLayer and the gtag function.
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

// Set default consent to 'denied' as a placeholder
// Determine actual values based on your own requirements
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied'
});
</script>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=TAG_ID">
</script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}

  gtag('js', new Date());
  gtag('config', 'TAG_ID');
</script>

<!-- Send consent updates when users interact with your consent banner -->
<script>
  function allConsentGranted() {
    gtag('consent', 'update', {
      'ad_user_data': 'granted',
      'ad_personalization': 'granted',
      'ad_storage': 'granted',
      'analytics_storage': 'granted'
    });
  }
</script>
<!-- Invoke your consent function when a user interacts with your banner -->
<body>
  ...
  <button onclick="allConsentGranted()">Accept all</button>
  ...
</body>
Passer au mode Consentement v2
Google s'engage de façon continue en faveur d'un écosystème de publicité digitale respectueux de la confidentialité. Dans cette optique, nous renforçons l'application de nos Règles relatives au consentement de l'utilisateur dans l'UE.

En savoir plus sur les modifications apportées par Google au mode Consentement pour le trafic dans l'Espace économique européen (EEE)

Les utilisateurs du mode Consentement doivent envoyer deux nouveaux paramètres en plus de ad_storage et analytics_storage :

Nom du champ	Valeurs autorisées	Description
ad_user_data	'granted' | 'denied'	Définit le consentement pour envoyer à Google des données utilisateur liées à la publicité.
ad_personalization	'granted' | 'denied'	Définit le consentement pour la publicité personnalisée.
Plus de fonctionnalités du mode Consentement
Les fonctionnalités avancées de consentement vous permettent, entre autres, de :

Définissez les services Google avec lesquels vous partagez des données à l'aide de l'interface utilisateur de la balise Google.
Définissez le comportement pour une région géographique.
Transmettez les informations sur les clics sur les annonces, l'ID client et l'ID de session dans les URL lorsque les utilisateurs n'ont pas donné leur consentement pour les cookies.
Masquez complètement (supprimez) les informations sur les annonces lorsque les utilisateurs refusent les cookies publicitaires.
Comportement spécifique à la région
Pour définir des états de consentement par défaut qui s'appliquent aux visiteurs de zones spécifiques, indiquez une région (selon la norme ISO 3166-2) dans votre commande gtag consent default. L'utilisation de valeurs régionales vous permet de respecter les réglementations régionales.

Vous pouvez définir des valeurs par défaut pour des régions spécifiques, puis une autre valeur par défaut pour toutes les autres régions. Une commande gtag de consentement par défaut sans paramètre de région définit la valeur par défaut pour tous les visiteurs non couverts par une autre commande spécifique à une région.

gtag.js
Tag Manager
L'exemple suivant définit analytics_storage sur denied pour les utilisateurs d'Espagne et d'Alaska, et définit ad_storage sur denied pour tous les utilisateurs.

Remarque : Il s'agit d'un exemple. Il vous incombe de vous assurer que le mode Consentement est défini pour chacun de vos produits de mesure afin de respecter le règlement de votre organisation.

  gtag('consent', 'default', {
    'analytics_storage': 'denied',
    'region': ['ES', 'US-AK']
  });

  gtag('consent', 'default', {
    'ad_storage': 'denied'
  });
Le paramètre le plus spécifique est prioritaire
Si deux commandes de consentement par défaut apparaissent sur la même page avec des valeurs pour une région et une sous-région, celle avec la région la plus spécifique prendra effet. Par exemple, si vous avez défini ad_storage sur granted pour la région "États-Unis" et ad_storage sur denied pour la région "États-Unis-Californie", le paramètre le plus spécifique "États-Unis-Californie" s'appliquera à un visiteur de Californie. Dans cet exemple, cela signifie qu'un visiteur provenant de US-CA aura ad_storage défini sur denied.

Région	ad_storage	Comportement
États-Unis	'granted'	S'applique aux utilisateurs aux États-Unis qui ne sont pas en Californie
US-CA	'denied'	S'applique aux utilisateurs situés en Californie (États-Unis)
Non spécifié	'granted'	Utilise la valeur par défaut de 'granted'. Dans l'exemple, s'applique aux visiteurs qui ne se trouvent pas aux États-Unis ni en Californie (US-CA)
Transmettre les informations sur les clics sur les annonces, l'ID client et l'ID de session dans les URL
Lorsqu'un utilisateur accède à votre site Web après avoir cliqué sur une annonce, des informations sur l'annonce peuvent être ajoutées aux URL de vos pages de destination en tant que paramètre de requête. Pour améliorer la précision des événements clés, ces informations sont généralement stockées dans des cookies propriétaires sur votre domaine.

Toutefois, si ad_storage est défini sur denied, ces informations ne seront pas stockées en local. Pour améliorer la qualité de la mesure des clics sur les annonces lorsque ad_storage est défini sur denied, vous pouvez choisir de transmettre des informations sur les clics sur les annonces à vos pages à l'aide du transfert d'URL.

De même, si analytics_storage est défini sur denied, le transfert d'URL peut être utilisé pour envoyer des données analytiques basées sur les événements et les sessions (y compris les événements clés) sans cookies sur les pages.

Pour utiliser la transmission d'URL, vous devez remplir les conditions suivantes :

Votre balise Google est sensible au consentement et présente sur la page.
L'annonceur a activé la fonctionnalité de transfert d'URL.
Le mode Consentement est implémenté sur la page.
Le lien sortant renvoie au même domaine que celui de la page actuelle.
Un GCLID ou un DCLID est présent dans l'URL (balises Google Ads et Floodlight uniquement).

gtag.js
Tag Manager
Pour activer cette fonctionnalité, définissez le paramètre url_passthrough sur true. Ajoutez la commande suivante à l'extrait par défaut avant toute commande config :


gtag('set', 'url_passthrough', true);
Dans Tag Manager, accédez à Champs à définir, puis sélectionnez **Configuration de la balise.

Champs à définir**.

Lorsque la section "Champs à définir" est développée, cliquez sur Ajouter une ligne.
Dans le champ Nom du champ, saisissez url_passthrough.
Pour Valeur, saisissez "true" (vrai).
Enregistrez la balise et publiez-la.
Remarque : Vous devez définir le transfert d'URL de manière cohérente pour toutes vos balises UA ou GA4, respectivement.
Vous pouvez également définir le paramètre url_passthrough sur true sur chaque page de votre site avant l'extrait d'installation GTM.


window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
gtag('set', 'url_passthrough', true);
Lorsque vous activez le transfert d'URL, quelques paramètres de requête peuvent être ajoutés aux liens lorsque les utilisateurs parcourent les pages de votre site Web :

gclid
dclid
gclsrc
_gl
wbraid
Pour obtenir les meilleurs résultats possible, assurez-vous que :

Les redirections sur votre site transmettent tous les paramètres de requête précédents.
Vos outils d'analyse ignorent ces paramètres dans les URL de page.
Ces paramètres n'interfèrent pas avec le comportement de votre site.
Remarque : Si votre site Web utilise des paramètres de requête pour contrôler le contenu ou la navigation, vérifiez que ces paramètres n'interfèrent pas avec le comportement de votre site.
Masquer les données relatives aux annonces
Lorsque ad_storage est défini sur denied, aucun nouveau cookie n'est défini à des fins publicitaires. De plus, les cookies tiers précédemment définis sur google.com et doubleclick.net ne seront pas utilisés, sauf à des fins de protection contre le spam et la fraude. Les données envoyées à Google incluront toujours l'URL complète de la page, y compris les informations sur les clics sur les annonces dans les paramètres d'URL.

gtag.js
Tag Manager
Pour masquer davantage les données relatives à vos annonces lorsque ad_storage est défini sur denied, définissez ads_data_redaction sur true.

```js
gtag('set', 'ads_data_redaction', true);
```

Lorsque ads_data_redaction est défini sur true et que ad_storage est défini sur denied, les identifiants de clics sur les annonces envoyés dans les requêtes réseau par les balises Google Ads et Floodlight sont masqués. Les requêtes réseau seront également envoyées via un domaine sans cookies tiers, tel que pagead2.googlesyndication.com.

Remarque : Le paramètre ads_data_redaction n'aura aucun effet lorsque ad_storage est défini sur granted ou si la commande gtag('consent') n'est pas utilisée.
Problèmes courants
Consultez les problèmes courants suivants rencontrés lors de l'implémentation.

Le consentement n'est pas mis à jour sur une page de transition
Lorsque vous implémentez le mode Consentement avancé, vous devez appeler une commande de mise à jour sur la page où l'utilisateur donne son consentement.

Lorsqu'une page se charge avec le consentement refusé, puis se recharge avec le consentement accordé après un changement de consentement, les balises Google peuvent perdre des points de données clés de la page d'origine. Les rapports suivants peuvent être incomplets.

Par exemple, dans Google Analytics, il peut manquer un événement session_start à de nombreuses sessions avec consentement.

Pour éviter ce problème, appelez la commande "update" chaque fois que l'état du consentement d'un utilisateur change.

Consentement mis à jour immédiatement avant le rechargement de la page
Dans certains cas, lorsqu'un type de consentement passe de "Refusé" à "Accordé", les balises Google peuvent envoyer des mesures basées sur cette modification. Si la commande de mise à jour est appelée lorsque la page est déchargée, le navigateur peut annuler ce trafic réseau avant qu'il ne soit terminé. Les rapports suivants peuvent être incomplets.

Si possible, assurez-vous que les commandes de mise à jour sont enregistrées bien avant le déchargement de la page.