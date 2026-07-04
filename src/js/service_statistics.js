/**
 * @synapxlab/cookie-consent - service_statistics
 * Point central pour les services d'analytics et de statistiques
 * 
 * @version 2.4.1
 * @author SynapxLab <contact@synapxlab.com>
 * @license MIT
 */

// ——— Loaders "internes" protégés ———
const loaders = {
  ga: (cfg) => {
    const id = cfg.google_analytics_key;
    if (!id) return;
    const s = document.createElement('script');
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    s.async = true;
    document.head.appendChild(s);
    
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', id, { 
      anonymize_ip: true, 
      cookie_flags: 'SameSite=None;Secure' 
    });
  },

  gtm: (cfg) => {
    const id = cfg.google_tag_manager_key;
    if (!id) return;
    
    (function(w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });
      
      const f = d.getElementsByTagName(s)[0];
      const j = d.createElement(s);
      const dl = l !== 'dataLayer' ? '&l=' + l : '';
      
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      f.parentNode?.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', id);
  },

  matomo: (cfg) => {
    if (!cfg.matomo) return;
    const { url, siteId } = cfg.matomo;
    
    window._paq = window._paq || [];
    window._paq.push(['trackPageView']);
    window._paq.push(['enableLinkTracking']);
    
    const u = url.endsWith('/') ? url : url + '/';
    window._paq.push(['setTrackerUrl', u + 'matomo.php']);
    window._paq.push(['setSiteId', siteId]);
    
    const s = document.createElement('script');
    s.src = u + 'matomo.js';
    s.async = true;
    document.head.appendChild(s);
  },

  mixpanel: (cfg) => {
    const token = cfg.mixpanel_token;
    if (!token) return;
    
    (function(f, b) {
      if (!b.__SV) {
        let e, g;
        window.mixpanel = b;
        b._i = [];
        
        b.init = function(e, f, c) {
          function g(a, d) {
            const k = d.split(".");
            if (k.length === 2) {
              a = a[k[0]];
              d = k[1];
            }
            a[d] = function() {
              a.push([d].concat(Array.prototype.slice.call(arguments, 0)));
            };
          }
          
          let a = b;
          if (typeof c !== "undefined") {
            a = b[c] = [];
          } else {
            c = "mixpanel";
          }
          
          a.people = a.people || [];
          const methods = "disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
          
          for (let h = 0; h < methods.length; h++) {
            g(a, methods[h]);
          }
          
          const j = "set set_once union unset remove delete".split(" ");
          a.get_group = function() {
            function c(d) {
              d[d] = function() {
                a.push([e, arguments]);
              };
            }
            const d = {};
            const e = ["get_group"].concat(Array.prototype.slice.call(arguments, 0));
            for (let m = 0; m < j.length; m++) {
              c(j[m]);
            }
            return d;
          };
          
          b._i.push([e, f, c]);
        };
        
        b.__SV = 1.2;
        e = f.createElement("script");
        e.type = "text/javascript";
        e.async = true;
        e.src = "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
        g = f.getElementsByTagName("script")[0];
        g?.parentNode?.insertBefore(e, g);
      }
    })(document, window.mixpanel || []);
    
    window.mixpanel.init(token);
  },

  amplitude: (cfg) => {
    const key = cfg.amplitude_key;
    if (!key) return;
    
    (function(e, t) {
      const n = e.amplitude || { _q: [], _iq: {} };
      const r = t.createElement("script");
      
      r.type = "text/javascript";
      r.crossOrigin = "anonymous";
      r.async = true;
      r.src = "https://cdn.amplitude.com/libs/amplitude-8.21.4-min.gz.js";
      
      const s = t.getElementsByTagName("script")[0];
      s?.parentNode?.insertBefore(r, s);
      
      function i(o, k) {
        o.prototype[k] = function() {
          this._q.push([k].concat(Array.prototype.slice.call(arguments, 0)));
          return this;
        };
      }
      
      const O = function() {
        this._q = [];
        return this;
      };
      ["add", "append", "clearAll", "prepend", "set", "setOnce", "unset", "preInsert", "postInsert", "remove"].forEach(k => i(O, k));
      
      const R = function() {
        this._q = [];
        return this;
      };
      ["setProductId", "setQuantity", "setPrice", "setRevenueType", "setEventProperties"].forEach(k => i(R, k));
      
      const d = ["init", "logEvent", "logRevenue", "setUserId", "setUserProperties", "setOptOut", "setVersionName", "setDomain", "setDeviceId", "enableTracking", "setGlobalUserProperties", "identify", "clearUserProperties", "setGroup", "logRevenueV2", "regenerateDeviceId", "groupIdentify", "onInit", "onNewSessionStart", "logEventWithTimestamp", "logEventWithGroups", "setSessionId", "resetSessionId", "getDeviceId", "getUserId", "setMinTimeBetweenSessionsMillis", "setEventUploadThreshold", "setUseDynamicConfig", "setServerZone", "setServerUrl", "sendEvents", "setLibrary", "setTransport"];
      
      function v(o) {
        d.forEach(k => {
          o[k] = function() {
            o._q.push([k].concat(Array.prototype.slice.call(arguments, 0)));
          };
        });
      }
      
      v(n);
      
      n.getInstance = function(name) {
        name = (!name || name.length === 0 ? "$default_instance" : name).toLowerCase();
        if (!Object.prototype.hasOwnProperty.call(n._iq, name)) {
          n._iq[name] = { _q: [] };
          v(n._iq[name]);
        }
        return n._iq[name];
      };
      
      e.amplitude = n;
    })(window, document);
    
    window.amplitude.getInstance().init(key);
  },

  plausible: (cfg) => {
    const p = cfg.plausible;
    if (!p || !p.domain) return;
    
    const s = document.createElement('script');
    s.defer = true;
    s.setAttribute('data-domain', p.domain);
    s.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(s);
  },

  hotjar: (cfg) => {
    const id = cfg.hotjar_site_id;
    if (!id) return;
    
    (function(h, o, t, j, a, r) {
      h.hj = h.hj || function() {
        (h.hj.q = h.hj.q || []).push(arguments);
      };
      h._hjSettings = { hjid: id, hjsv: 6 };
      
      a = o.getElementsByTagName('head')[0];
      r = o.createElement(t);
      r.async = true;
      r.src = j + h._hjSettings.hjid + '.js?sv=' + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, 'script', 'https://static.hotjar.com/c/hotjar-');
  },

  clarity: (cfg) => {
    const pid = cfg.clarity_project_id;
    if (!pid) return;
    
    (function(c, l, a, r, i, t, y) {
      c[a] = c[a] || function() {
        (c[a].q = c[a].q || []).push(arguments);
      };
      
      t = l.createElement(r);
      t.async = true;
      t.src = "https://www.clarity.ms/tag/" + i;
      
      y = l.getElementsByTagName(r)[0];
      y?.parentNode?.insertBefore(t, y);
    })(window, document, "clarity", "script", pid);
  }
};

// ——— Meta pour détection d'URL (bloqueur/observateur) ———
const patterns = [
  'google-analytics',
  'gtag',
  // 'tagmanager',  // âš ï¸ GTM retiré - doit être chargé en dur dans <head>
  'matomo',
  'plausible',
  'hotjar',
  'clarity',
  'mixpanel',
  'amplitude'
];

// ——— API exportée ———
export const service_statistics = {
  /** motifs d'URL à bloquer tant que pas de consentement */
  patterns,

  /** retourne la liste lisible des services configurés */
  getConfigured(cfg) {
    const out = [];
    if (cfg.google_analytics_key) out.push('Google Analytics');
    if (cfg.google_tag_manager_key) out.push('Google Tag Manager');
    if (cfg.matomo) out.push('Matomo');
    if (cfg.mixpanel_token) out.push('Mixpanel');
    if (cfg.amplitude_key) out.push('Amplitude');
    if (cfg.plausible) out.push('Plausible');
    if (cfg.hotjar_site_id) out.push('Hotjar');
    if (cfg.clarity_project_id) out.push('Microsoft Clarity');
    return out;
  },

  /** charge tous les services configurés (à appeler seulement si consentement « statistics » = true) */
  loadAll(cfg) {
    try { loaders.ga(cfg); } catch (e) { console.error('Error loading GA:', e); }
    try { loaders.gtm(cfg); } catch (e) { console.error('Error loading GTM:', e); }
    try { loaders.matomo(cfg); } catch (e) { console.error('Error loading Matomo:', e); }
    try { loaders.mixpanel(cfg); } catch (e) { console.error('Error loading Mixpanel:', e); }
    try { loaders.amplitude(cfg); } catch (e) { console.error('Error loading Amplitude:', e); }
    try { loaders.plausible(cfg); } catch (e) { console.error('Error loading Plausible:', e); }
    try { loaders.hotjar(cfg); } catch (e) { console.error('Error loading Hotjar:', e); }
    try { loaders.clarity(cfg); } catch (e) { console.error('Error loading Clarity:', e); }
  }
};