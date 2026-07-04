/**
 * @synapxlab/cookie-consent - service_preferences
 * Point central pour les services de préférences (chat, support, personnalisation)
 * 
 * ✅ v3.0.0: Renommé de "service_functional" → "service_preferences"
 * Conformité RGPD: Cookies de préférences permettant la personnalisation
 * 
 * @version 3.0.0
 * @author SynapxLab <contact@synapxlab.com>
 * @license MIT
 */

// ——— Loaders "internes" protégés ———
const loaders = {
  intercom: (cfg) => {
    const appId = cfg.intercom_app_id;
    if (!appId) return;
    
    (function() {
      const w = window;
      const ic = w.Intercom;
      
      if (typeof ic === "function") {
        ic('reattach_activator');
        ic('update', w.intercomSettings);
      } else {
        const d = document;
        const i = function() {
          i.c(arguments);
        };
        i.q = [];
        i.c = function(args) {
          i.q.push(args);
        };
        w.Intercom = i;
        
        const l = function() {
          const s = d.createElement('script');
          s.type = 'text/javascript';
          s.async = true;
          s.src = 'https://widget.intercom.io/widget/' + appId;
          const x = d.getElementsByTagName('script')[0];
          x?.parentNode?.insertBefore(s, x);
        };
        
        if (document.readyState === 'complete') {
          l();
        } else if (w.attachEvent) {
          w.attachEvent('onload', l);
        } else {
          w.addEventListener('load', l, false);
        }
      }
    })();
    
    window.Intercom('boot', { app_id: appId });
  },

  crisp: (cfg) => {
    const websiteId = cfg.crisp_website_id;
    if (!websiteId) return;
    
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = websiteId;
    
    (function() {
      const d = document;
      const s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = true;
      d.getElementsByTagName("head")[0]?.appendChild(s);
    })();
  },

  hubspot: (cfg) => {
    const portalId = cfg.hubspot_portal_id;
    if (!portalId) return;
    
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = 'hs-script-loader';
    script.async = true;
    script.defer = true;
    script.src = `//js.hs-scripts.com/${portalId}.js`;
    document.head.appendChild(script);
  },

  segment: (cfg) => {
    const writeKey = cfg.segment_write_key;
    if (!writeKey) return;
    
    (function() {
      const analytics = window.analytics = window.analytics || [];
      
      if (!analytics.initialize) {
        if (analytics.invoked) {
          window.console && console.error && console.error("Segment snippet included twice.");
        } else {
          analytics.invoked = true;
          analytics.methods = [
            "trackSubmit", "trackClick", "trackLink", "trackForm", "pageview",
            "identify", "reset", "group", "track", "ready", "alias", "debug",
            "page", "once", "off", "on", "addSourceMiddleware",
            "addIntegrationMiddleware", "setAnonymousId", "addDestinationMiddleware"
          ];
          
          analytics.factory = function(method) {
            return function() {
              const args = Array.prototype.slice.call(arguments);
              args.unshift(method);
              analytics.push(args);
              return analytics;
            };
          };
          
          for (let i = 0; i < analytics.methods.length; i++) {
            const key = analytics.methods[i];
            analytics[key] = analytics.factory(key);
          }
          
          analytics.load = function(key, options) {
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.async = true;
            script.src = "https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";
            const first = document.getElementsByTagName("script")[0];
            first?.parentNode?.insertBefore(script, first);
            analytics._loadOptions = options;
          };
          
          analytics._writeKey = writeKey;
          analytics.SNIPPET_VERSION = "4.15.3";
          analytics.load(writeKey);
          analytics.page();
        }
      }
    })();
  }
};

// Note: HubSpot peut inclure des fonctionnalités analytics secondaires
// Note: Segment (CDP) peut router des données vers analytics/marketing selon la config serveur

// ——— Meta pour détection d'URL (bloqueur/observateur) ———
const patterns = [
  'intercom',
  'crisp.chat',
  'hubspot',
  'hs-scripts.com',
  'segment.com/analytics'
];

// ——— API exportée ———
export const service_preferences = {
  /** motifs d'URL à bloquer tant que pas de consentement */
  patterns,

  /** retourne la liste lisible des services configurés */
  getConfigured(cfg) {
    const out = [];
    if (cfg.intercom_app_id) out.push('Intercom');
    if (cfg.crisp_website_id) out.push('Crisp');
    if (cfg.hubspot_portal_id) out.push('HubSpot');
    if (cfg.segment_write_key) out.push('Segment');
    return out;
  },

  /** charge tous les services configurés (à appeler seulement si consentement « preferences » = true) */
  loadAll(cfg) {
    try { loaders.intercom(cfg); } catch (e) { console.error('Error loading Intercom:', e); }
    try { loaders.crisp(cfg); } catch (e) { console.error('Error loading Crisp:', e); }
    try { loaders.hubspot(cfg); } catch (e) { console.error('Error loading HubSpot:', e); }
    try { loaders.segment(cfg); } catch (e) { console.error('Error loading Segment:', e); }
  }
};

// ✅ Export de compatibilité (pour migration douce)
export const service_functional = service_preferences;