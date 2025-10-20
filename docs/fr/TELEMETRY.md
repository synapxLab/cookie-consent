
> **Télémétrie légère (opt-in / opt-out)**  
> Ce projet peut, à faible fréquence (~1/300 vues), contacter `version.synapx.fr/ping.php` pour :  
> – récupérer la dernière version disponible,  
> – compter de manière agrégée les domaines utilisant la librairie.  
> **Données envoyées :** _nom de domaine_ uniquement.  
> **Désactiver :**
> 
> `<script>window.CookieConsent = { disableVersionCheck: true };</script> <script  src="/js/cookie.min.js"></script>` 
> 
> **Activer explicitement :**
> 
> `<script  src="/js/cookie.min.js"  data-check-version="1"></script>` 
> 
> **Rétention :** 30 jours max, agrégation statistique.  
> **Finalité :** mesurer l’adoption et notifier des mises à jour de sécurité.  
> Aucun suivi individuel, aucun cookie, aucune IP/UA stockée.

## Bonus “safe by default”

-   Respecter `Do-Not-Track` : si `navigator.doNotTrack == "1"`, **ne pas ping**.
    
-   Côté serveur, accepter `?optout=1` (au cas où certains veulent router le script via un proxy et couper le ping).
    

Bref : **MIT + télémétrie minimale documentée + opt-out = ok**.