{**
 * SynapxLab Cookie Consent — script d'initialisation front office.
 *
 * $synapxcc_config et $synapxcc_locale sont produits côté PHP par
 * json_encode(JSON_HEX_TAG|JSON_HEX_APOS|JSON_HEX_QUOT|JSON_HEX_AMP) :
 * ils sont sûrs à insérer avec nofilter dans un contexte <script>.
 *
 * @author    SynapxLab <contact@synapx.fr>
 * @copyright 2026 SynapxLab
 * @license   https://opensource.org/licenses/MIT MIT License
 *}
<script src="{$synapxcc_js_url|escape:'html':'UTF-8'}"{if $synapxcc_no_telemetry} data-no-telemetry{/if}></script>
<script>
(function () {
    var cfg = {$synapxcc_config nofilter};
    var forcedLocale = {$synapxcc_locale nofilter};
    var overridden = false;

    if (forcedLocale) {
        /* La bannière détecte sa langue via navigator.language :
           on masque temporairement la valeur du navigateur pour
           imposer la langue choisie (boutique ou langue fixe). */
        try {
            Object.defineProperty(navigator, 'language', {
                get: function () { return forcedLocale; },
                configurable: true
            });
            overridden = true;
        } catch (e) { /* navigateur non modifiable : détection par défaut */ }
    }

    function boot() {
        try {
            if (window.CookieConsent && typeof window.CookieConsent.init === 'function') {
                window.CookieConsent.init(cfg);
            }
        } finally {
            if (overridden) {
                /* Restaure navigator.language pour les autres scripts :
                   la langue de la bannière est déjà résolue et mémorisée. */
                try { delete navigator.language; } catch (e) { /* rien à restaurer */ }
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
</script>
