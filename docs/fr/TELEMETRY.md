
Le SDK SynapxLab Cookie Consent vérifie occasionnellement la disponibilité de nouvelles versions via `version.synapx.fr/cookie.json`.

## Comportement

-   **Fréquence** : ~10% des chargements (échantillonnage aléatoire)
-   **Délai** : 10 secondes après le chargement
-   **Exécution** : Pendant les périodes d'inactivité CPU (`requestIdleCallback`)
-   **Annulation** : Automatique si la page se ferme ou l'onglet devient inactif

## Garanties de confidentialité

✅ **Aucune donnée envoyée** (requête GET simple)  
✅ **Aucun cookie**  
✅ **Aucun tracking**  
✅ **Notification console uniquement**

## Messages console

```
⚠️ Synapx Cookie: v2.4.0 non supportée → 3.0.0
```
Version obsolète détectée.
```
ℹ️ Synapx Cookie: v2.4.0 → 2.5.0 disponible
```

Mise à jour disponible.

## Configuration

Modifier dans le code source :

javascript

```javascript
const CHANCE = 0.10;   // Probabilité (0-1)
const DELAY_MS = 10_000; // Délai (ms)
```

----------

**RGPD-friendly** • **Licence MIT**