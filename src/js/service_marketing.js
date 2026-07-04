/**
 * @synapxlab/cookie-consent - service_marketing
 * Point central pour les services marketing (publicité, tracking commercial)
 * 
 * @version 2.4.1
 * @author SynapxLab <contact@synapxlab.com>
 * @license MIT
 */

// ——— Loaders "internes" protégés ———
const loaders = {
  facebook: (cfg) => {
    const pixel = cfg.facebook_pixel;
    if (!pixel || !pixel.key) return;
    
    (function(f, b, e, v, n, t, s) {
      if (f.fbq) return;
      
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = '2.0';
      n.queue = [];
      
      t = b.createElement(e);
      t.async = true;
      t.src = v;
      
      s = b.getElementsByTagName(e)[0];
      s?.parentNode?.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    
    if (typeof window.fbq === 'function') {
      window.fbq('init', pixel.key);
      window.fbq('track', pixel.track || 'PageView');
    }
  },

  adsense: (cfg) => {
    const key = cfg.google_adsense_key;
    if (!key) return;
    
    const script = document.createElement('script');
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${key}`;
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  },

  tiktok: (cfg) => {
    const pixelId = cfg.tiktok_pixel_id;
    if (!pixelId) return;
    
    (function(w, d, t) {
      w.TiktokAnalyticsObject = t;
      const ttq = w[t] = w[t] || [];
      
      ttq.methods = [
        "page", "track", "identify", "instances", "debug", "on", "off",
        "once", "ready", "alias", "group", "enableCookie", "disableCookie"
      ];
      
      ttq.setAndDefer = function(t, e) {
        t[e] = function() {
          t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
        };
      };
      
      for (let i = 0; i < ttq.methods.length; i++) {
        ttq.setAndDefer(ttq, ttq.methods[i]);
      }
      
      ttq.instance = function(t) {
        const e = ttq._i[t] || [];
        for (let n = 0; n < ttq.methods.length; n++) {
          ttq.setAndDefer(e, ttq.methods[n]);
        }
        return e;
      };
      
      ttq.load = function(e, n) {
        const i = "https://analytics.tiktok.com/i18n/pixel/events.js";
        ttq._i = ttq._i || {};
        ttq._i[e] = [];
        ttq._i[e]._u = i;
        ttq._t = ttq._t || {};
        ttq._t[e] = +new Date();
        ttq._o = ttq._o || {};
        ttq._o[e] = n || {};
        
        const o = document.createElement("script");
        o.type = "text/javascript";
        o.async = true;
        o.src = i + "?sdkid=" + e + "&lib=" + t;
        
        const a = document.getElementsByTagName("script")[0];
        a?.parentNode?.insertBefore(o, a);
      };
      
      ttq.load(pixelId);
      ttq.page();
    })(window, document, 'ttq');
  },

  linkedin: (cfg) => {
    const partnerId = cfg.linkedin_partner_id;
    const legal = 'https://www.linkedin.com/legal/cookie-policy';
    if (!partnerId) return;
    
    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
    window._linkedin_data_partner_ids.push(partnerId);
    
    (function(l) {
      if (!l) {
        window.lintrk = function(a, b) {
          window.lintrk.q.push([a, b]);
        };
        window.lintrk.q = [];
      }
      
      const s = document.getElementsByTagName("script")[0];
      const b = document.createElement("script");
      b.type = "text/javascript";
      b.async = true;
      b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
      s?.parentNode?.insertBefore(b, s);
    })(window.lintrk);
  }
};

// ——— Meta pour détection d'URL (bloqueur/observateur) ———
const patterns = [
  'adsense',
  'doubleclick',
  'facebook',
  'fbq',
  'tiktok',
  'linkedin',
  'snap.licdn',
  'googlesyndication'
];

// ——— API exportée ———
export const service_marketing = {
  /** motifs d'URL à bloquer tant que pas de consentement */
  patterns,

  /** retourne la liste lisible des services configurés */
  getConfigured(cfg) {
    const out = [];
    if (cfg.google_adsense_key) out.push('Google AdSense');
    if (cfg.facebook_pixel) out.push('Facebook Pixel');
    if (cfg.tiktok_pixel_id) out.push('TikTok Pixel');
    if (cfg.linkedin_partner_id) out.push('LinkedIn Insight');
    return out;
  },

  /** charge tous les services configurés (à appeler seulement si consentement « marketing » = true) */
  loadAll(cfg) {
    try { loaders.facebook(cfg); } catch (e) { console.error('Error loading Facebook Pixel:', e); }
    try { loaders.adsense(cfg); } catch (e) { console.error('Error loading Google AdSense:', e); }
    try { loaders.tiktok(cfg); } catch (e) { console.error('Error loading TikTok Pixel:', e); }
    try { loaders.linkedin(cfg); } catch (e) { console.error('Error loading LinkedIn Insight:', e); }
  }
};