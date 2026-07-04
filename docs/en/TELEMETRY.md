The **SynapxLab Cookie Consent SDK** occasionally checks for new versions via `version.synapx.fr/cookie.json`.

## Behavior

-   **Frequency**: ~10% of page loads (random sampling)
-   **Delay**: 10 seconds after page load
-   **Execution**: During CPU idle time (`requestIdleCallback`)
-   **Cancellation**: Automatically canceled if the page is closed or the tab becomes inactive
    
## Privacy Guarantees

✅ **No data sent** (simple GET request)  
✅ **No cookies**  
✅ **No tracking**  
✅ **Console notification only**

## Console Messages
`⚠️  Synapx Cookie:  v2.4.0  not  supported  →  3.0.0` 

Outdated version detected.
`ℹ️ Synapx Cookie: v2.4.0 → 2.5.0 available` 

Update available.
**GDPR-friendly** • **MIT License**