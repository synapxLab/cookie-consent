/**
 * @synapxlab/cookie-consent
 * Bannière de consentement + Logger + Intégration services
 * 
 * @version 2.4.0
 * @author SynapxLab <contact@synapx.fr>
 * @license MIT
 */

import '../scss/cookie.scss';
import t from './translat';

const STORAGE_KEY = 'politecookiebanner';

// Configuration centralisée
const CONFIG = {
  logger: {
    enabled: false,
    endpoint: 'https://api.synapx.fr/',
    apiKey: null,
    retries: 3,
    timeout: 5000,
    anonymousId: true,
    headers: {}
  },
  statistics: {
    google_analytics_key: null,
    google_tag_manager_key: null,
    matomo: null,
    mixpanel_token: null,
    amplitude_key: null,
    plausible: null,
    hotjar_site_id: null,
    clarity_project_id: null
  },
  marketing: {
    google_adsense_key: null,
    facebook_pixel: null,
    tiktok_pixel_id: null,
    linkedin_partner_id: null
  },
  functional: {  // ✅ RENOMMÉ de cookies → functional
    intercom_app_id: null,
    crisp_website_id: null,
    hubspot_portal_id: null,
    segment_write_key: null
  },
  storage: {
    expiration_months: 6, // CNIL recommande 6 mois max
    auto_renew: false     // ne pas prolonger automatiquement à chaque visite
  }  
};

const EXPIRATION_MS = Math.max(1, Number(CONFIG.storage.expiration_months || 6)) * 30 * 24 * 60 * 60 * 1000;

// ========== UTILITAIRES ==========
const loadPrefs = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw || '{}');
    if (!parsed || typeof parsed !== 'object') return null;

    // ⏳ Vérifie la date d'expiration
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null; // Consentement expiré → redemander
    }

    return parsed.data || parsed; // compatibilité ancienne structure
  } catch {
    return null;
  }
};

const generateUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0;
  return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
});

const getDeviceId = () => {
  if (!CONFIG.logger.anonymousId) return null;
  const KEY = 'cookie_consent_device_id';
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = 'cc_' + generateUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
};


// ========== BLOQUEUR TIERS (Scan + Freeze + Release) ==========
/**
 * Mots-clés par catégorie pour classer automatiquement les ressources tierces.
 * Ajuste librement (ordre important : on s'arrête au premier match).
 */
const CATEGORY_MATCHERS = [
  { cat: 'statistics', kw: ['google-analytics','gtag','tagmanager','matomo','plausible','hotjar','clarity','mixpanel','amplitude'] },
  { cat: 'marketing',  kw: ['adsense','doubleclick','facebook','fbq','tiktok','linkedin','snap.licdn','googlesyndication'] },
  { cat: 'cookies',    kw: ['intercom','crisp.chat','hubspot','hs-scripts.com','segment.com/analytics'] }
];

/** Détecte la catégorie à partir d'une URL */
const detectCategoryFromUrl = (url='') => {
  const u = url.toLowerCase();
  for (const {cat, kw} of CATEGORY_MATCHERS) {
    if (kw.some(k => u.includes(k))) return cat;
  }
  return null;
};

/** Convertit <script/iframe> en élément inerte tant que pas consenti */
const freezeElement = (el, cat) => {
  if (!cat || el.dataset.cookieBlocked === 'true') return;

  el.dataset.cookieBlocked = 'true';
  el.dataset.cookieCategory = cat;

  // On remplace par un "placeholder" neutre pour éviter l'exécution immédiate
  const placeholder = document.createElement(el.tagName);
  placeholder.setAttribute('type', 'text/plain');
  placeholder.dataset.cookieBlocked = 'true';
  placeholder.dataset.cookieCategory = cat;

  // On sauvegarde les attributs d'origine
  const attrs = {};
  for (const {name, value} of [...el.attributes]) {
    attrs[name] = value;
  }
  placeholder.dataset.cookieOrigAttrs = JSON.stringify(attrs);

  // On garde aussi le contenu inline si présent
  if (el.textContent && el.textContent.trim()) {
    placeholder.textContent = el.textContent;
  }

  el.replaceWith(placeholder);
};

/** Restaure un élément bloqué (selon consentement) en script/iframe exécutable */
const restoreElement = (placeholder) => {
  if (placeholder.dataset.cookieBlocked !== 'true') return;

  const cat = placeholder.dataset.cookieCategory;
  const attrs = JSON.parse(placeholder.dataset.cookieOrigAttrs || '{}');
  const real = document.createElement(placeholder.tagName);

  // Réinjecte attributs
  for (const [k,v] of Object.entries(attrs)) {
    // Si c'était un <script> inline, on rétablira via textContent
    if (k === 'type') continue;
    real.setAttribute(k, v);
  }

  // Si on avait congelé un <script> inline, on remet le code
  if (!attrs.src && placeholder.textContent) {
    real.textContent = placeholder.textContent;
  }

  // Nettoie les marqueurs
  real.removeAttribute('data-cookie-blocked');
  real.removeAttribute('data-cookie-category');
  real.removeAttribute('data-cookie-orig-attrs');

  placeholder.replaceWith(real);

  // Cas inline sans src : forcer exécution en recréant un <script> "vrai"
  if (real.tagName === 'SCRIPT' && !real.src && real.textContent) {
    const exec = document.createElement('script');
    exec.textContent = real.textContent;
    // Copie quelques attributs utiles (async/defer/nomodule, etc.)
    ['async','defer','nomodule','crossorigin','integrity','referrerpolicy'].forEach(a=>{
      if (real.hasAttribute(a)) exec.setAttribute(a, real.getAttribute(a));
    });
    real.replaceWith(exec);
  }
};

/** Débloque tous les placeholders si la catégorie correspondante est consentie */
const releaseByConsent = (prefs) => {
  const allowed = {
    statistics: !!prefs?.statistics,
    marketing:  !!prefs?.marketing,
    cookies:    !!prefs?.cookies
  };
  document.querySelectorAll('[data-cookie-blocked="true"]').forEach(ph => {
    const c = ph.dataset.cookieCategory;
    if (c && allowed[c]) restoreElement(ph);
  });
};

/** Scanne la page et gèle <script src> et <iframe src> tierces non consenties */
const scanAndFreezeThirdParty = (prefs) => {
  const nodes = document.querySelectorAll('script[src], iframe[src]');
  nodes.forEach(el => {
    const src = el.getAttribute('src');
    if (!src) return;
    const cat = detectCategoryFromUrl(src);
    if (!cat) return;
    const hasConsent = !!(prefs && prefs[cat]);
    if (!hasConsent) freezeElement(el, cat);
  });
};

/** Observe les ajouts dynamiques (SPA / GTM) et bloque à la volée si non consenti */
let __cookieObserver = null;
const startObserver = (prefs) => {
  if (__cookieObserver) return;
  __cookieObserver = new MutationObserver(muts => {
    muts.forEach(mu => {
      mu.addedNodes && [...mu.addedNodes].forEach(node => {
        if (!(node instanceof Element)) return;
        // Si on injecte un <script> ou <iframe> on tente de bloquer
        if ((node.tagName === 'SCRIPT' || node.tagName === 'IFRAME') && node.getAttribute('src')) {
          const src = node.getAttribute('src');
          const cat = detectCategoryFromUrl(src);
          if (cat && !(prefs && prefs[cat])) freezeElement(node, cat);
        }
        // Et si un conteneur complet arrive, on rescane localement
        node.querySelectorAll && node.querySelectorAll('script[src],iframe[src]').forEach(child => {
          const s = child.getAttribute('src');
          const c = detectCategoryFromUrl(s || '');
          if (c && !(prefs && prefs[c])) freezeElement(child, c);
        });
      });
    });
  });
  __cookieObserver.observe(document.documentElement, { childList: true, subtree: true });
};



// ========== RÉCUPÉRATION DES SERVICES CONFIGURÉS ==========
const getConfiguredServices = () => {
  const services = {
    statistics: [],
    marketing: [],
    cookies: []
  };
  
  // Statistics
  if (CONFIG.statistics.google_analytics_key) services.statistics.push('Google Analytics');
  if (CONFIG.statistics.google_tag_manager_key) services.statistics.push('Google Tag Manager');
  if (CONFIG.statistics.matomo) services.statistics.push('Matomo');
  if (CONFIG.statistics.mixpanel_token) services.statistics.push('Mixpanel');
  if (CONFIG.statistics.amplitude_key) services.statistics.push('Amplitude');
  if (CONFIG.statistics.plausible) services.statistics.push('Plausible');
  if (CONFIG.statistics.hotjar_site_id) services.statistics.push('Hotjar');
  if (CONFIG.statistics.clarity_project_id) services.statistics.push('Microsoft Clarity');
  
  // Marketing
  if (CONFIG.marketing.google_adsense_key) services.marketing.push('Google AdSense');
  if (CONFIG.marketing.facebook_pixel) services.marketing.push('Facebook Pixel');
  if (CONFIG.marketing.tiktok_pixel_id) services.marketing.push('TikTok Pixel');
  if (CONFIG.marketing.linkedin_partner_id) services.marketing.push('LinkedIn Insight');
  
  // ✅ Functional (ex-Cookies)
  if (CONFIG.functional.intercom_app_id) services.cookies.push('Intercom');
  if (CONFIG.functional.crisp_website_id) services.cookies.push('Crisp');
  if (CONFIG.functional.hubspot_portal_id) services.cookies.push('HubSpot');
  if (CONFIG.functional.segment_write_key) services.cookies.push('Segment');
  
  return services;
};

// ========== LOGGING ==========
const logConsentToServer = async (preferences, action = 'accept', method = 'banner') => {
  if (!CONFIG.logger.enabled) return true;

  const payload = {
    consent_id: generateUUID(),
    device_id: getDeviceId(),
    site_path: location.pathname,
    
    consent_action: action,
    consent_method: method,
    
    pref_cookies: preferences?.cookies || false,
    pref_statistics: preferences?.statistics || false,
    pref_marketing: preferences?.marketing || false,
    
    banner_version: '2.4.0',
    locale: navigator.language || 'fr-FR',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    
    ...(CONFIG.logger.apiKey && { apiKey: CONFIG.logger.apiKey }),
  };

  const headers = {
    'Content-Type': 'application/json',
    ...CONFIG.logger.headers,
  };

  for (let attempt = 0; attempt < CONFIG.logger.retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.logger.timeout);
      
      const response = await fetch(CONFIG.logger.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log('[CookieConsent] ✅ Consentement loggé avec succès');
        return true;
      } else {
        console.warn(`[CookieConsent] ⚠️ Échec du log (HTTP ${response.status})`);
      }
    } catch (error) {
      console.warn('[CookieConsent] ⚠️ Erreur de logging:', error.message);
    }
    
    if (attempt < CONFIG.logger.retries - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
  
  console.error('[CookieConsent] ❌ Échec du logging après plusieurs tentatives');
  return false;
};

// ========== INTÉGRATION SERVICES STATISTICS ==========
const loadGoogleAnalytics = () => {
  if (!CONFIG.statistics.google_analytics_key) return;
  
  console.log('📊 Chargement Google Analytics...');
  
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.statistics.google_analytics_key}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ window.dataLayer.push(arguments); }

  gtag('js', new Date());
  gtag('config', CONFIG.statistics.google_analytics_key, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });

  console.log('✅ Google Analytics chargé');
};

const loadGoogleTagManager = () => {
  if (!CONFIG.statistics.google_tag_manager_key) return;
  
  console.log('📊 Chargement Google Tag Manager...');
  
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer',CONFIG.statistics.google_tag_manager_key);
  
  console.log('✅ Google Tag Manager chargé');
};

const loadMatomo = () => {
  if (!CONFIG.statistics.matomo) return;
  
  console.log('📊 Chargement Matomo...');
  
  const { url, siteId } = CONFIG.statistics.matomo;
  window._paq = window._paq || [];
  window._paq.push(['trackPageView']);
  window._paq.push(['enableLinkTracking']);
  
  const u = url.endsWith('/') ? url : url + '/';
  window._paq.push(['setTrackerUrl', u + 'matomo.php']);
  window._paq.push(['setSiteId', siteId]);
  
  const script = document.createElement('script');
  script.src = u + 'matomo.js';
  script.async = true;
  document.head.appendChild(script);
  
  console.log('✅ Matomo chargé');
};

const loadMixpanel = () => {
  if (!CONFIG.statistics.mixpanel_token) return;
  
  console.log('📊 Chargement Mixpanel...');
  
  (function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
  for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?
  MIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);
  
  mixpanel.init(CONFIG.statistics.mixpanel_token);
  
  console.log('✅ Mixpanel chargé');
};

const loadAmplitude = () => {
  if (!CONFIG.statistics.amplitude_key) return;
  
  console.log('📊 Chargement Amplitude...');
  
  (function(e,t){var n=e.amplitude||{_q:[],_iq:{}};var r=t.createElement("script")
  ;r.type="text/javascript"
  ;r.integrity="sha384-+EO59vL/X7v6VE2TJlBECHx/uaPlWB9hXD/WvJOg5BDSeG7RcKvvFhg2nLNdDhY+"
  ;r.crossOrigin="anonymous";r.async=true
  ;r.src="https://cdn.amplitude.com/libs/amplitude-8.21.4-min.gz.js"
  ;r.onload=function(){if(!e.amplitude.runQueuedFunctions){
  console.log("[Amplitude] Error: could not load SDK")}};var s=t.getElementsByTagName("script")[0]
  ;s.parentNode.insertBefore(r,s);function i(e,t){e.prototype[t]=function(){
  this._q.push([t].concat(Array.prototype.slice.call(arguments,0)));return this}}
  var o=function(){this._q=[];return this}
  ;var a=["add","append","clearAll","prepend","set","setOnce","unset","preInsert","postInsert","remove"]
  ;for(var c=0;c<a.length;c++){i(o,a[c])}n.Identify=o;var l=function(){this._q=[]
  ;return this}
  ;var u=["setProductId","setQuantity","setPrice","setRevenueType","setEventProperties"]
  ;for(var p=0;p<u.length;p++){i(l,u[p])}n.Revenue=l
  ;var d=["init","logEvent","logRevenue","setUserId","setUserProperties","setOptOut","setVersionName","setDomain","setDeviceId","enableTracking","setGlobalUserProperties","identify","clearUserProperties","setGroup","logRevenueV2","regenerateDeviceId","groupIdentify","onInit","onNewSessionStart","logEventWithTimestamp","logEventWithGroups","setSessionId","resetSessionId","getDeviceId","getUserId","setMinTimeBetweenSessionsMillis","setEventUploadThreshold","setUseDynamicConfig","setServerZone","setServerUrl","sendEvents","setLibrary","setTransport"]
  ;function v(e){function t(t){e[t]=function(){e._q.push([t].concat(Array.prototype.slice.call(arguments,0)))}}
  for(var n=0;n<d.length;n++){t(d[n])}}v(n);n.getInstance=function(e){
  e=(!e||e.length===0?"$default_instance":e).toLowerCase()
  ;if(!Object.prototype.hasOwnProperty.call(n._iq,e)){n._iq[e]={_q:[]};v(n._iq[e])}
  return n._iq[e]};e.amplitude=n})(window,document);
  
  amplitude.getInstance().init(CONFIG.statistics.amplitude_key);
  
  console.log('✅ Amplitude chargé');
};

const loadPlausible = () => {
  if (!CONFIG.statistics.plausible) return;
  
  console.log('📊 Chargement Plausible...');
  
  const script = document.createElement('script');
  script.defer = true;
  script.dataset.domain = CONFIG.statistics.plausible.domain;
  script.src = 'https://plausible.io/js/script.js';
  document.head.appendChild(script);
  
  console.log('✅ Plausible chargé');
};

const loadHotjar = () => {
  if (!CONFIG.statistics.hotjar_site_id) return;
  
  console.log('📊 Chargement Hotjar...');
  
  (function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:CONFIG.statistics.hotjar_site_id,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
  
  console.log('✅ Hotjar chargé');
};

const loadClarity = () => {
  if (!CONFIG.statistics.clarity_project_id) return;
  
  console.log('📊 Chargement Microsoft Clarity...');
  
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", CONFIG.statistics.clarity_project_id);
  
  console.log('✅ Microsoft Clarity chargé');
};

// ========== INTÉGRATION SERVICES MARKETING ==========
const loadFacebookPixel = () => {
  if (!CONFIG.marketing.facebook_pixel) return;
  
  console.log('📢 Chargement Facebook Pixel...');
  
  !function(f,b,e,v,n,t,s) {
    if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)
  }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  
  if (typeof window.fbq === 'function') {
    window.fbq('init', CONFIG.marketing.facebook_pixel.key);
    window.fbq('track', CONFIG.marketing.facebook_pixel.track || 'PageView');
  }
  
  console.log('✅ Facebook Pixel chargé');
};

const loadGoogleAdSense = () => {
  if (!CONFIG.marketing.google_adsense_key) return;
  
  console.log('📢 Chargement Google AdSense...');
  
  const script = document.createElement('script');
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CONFIG.marketing.google_adsense_key}`;
  script.async = true;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
  
  console.log('✅ Google AdSense chargé');
};

const loadTikTokPixel = () => {
  if (!CONFIG.marketing.tiktok_pixel_id) return;
  
  console.log('📢 Chargement TikTok Pixel...');
  
  !function (w, d, t) {
    w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
    ttq.load(CONFIG.marketing.tiktok_pixel_id);
    ttq.page();
  }(window, document, 'ttq');
  
  console.log('✅ TikTok Pixel chargé');
};

const loadLinkedInInsight = () => {
  if (!CONFIG.marketing.linkedin_partner_id) return;
  
  console.log('📢 Chargement LinkedIn Insight...');
  
  window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
  window._linkedin_data_partner_ids.push(CONFIG.marketing.linkedin_partner_id);
  
  (function(l) {
    if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
    window.lintrk.q=[]}
    var s = document.getElementsByTagName("script")[0];
    var b = document.createElement("script");
    b.type = "text/javascript";b.async = true;
    b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
    s.parentNode.insertBefore(b, s);
  })(window.lintrk);
  
  console.log('✅ LinkedIn Insight chargé');
};

// ========== INTÉGRATION SERVICES FUNCTIONAL (ex-Cookies/Chat/CRM) ==========
const loadIntercom = () => {
  if (!CONFIG.functional.intercom_app_id) return;  // ✅ MODIFIÉ
  
  console.log('💬 Chargement Intercom...');
  
  (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/' + CONFIG.functional.intercom_app_id;var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();  // ✅ MODIFIÉ
  
  window.Intercom('boot', {
    app_id: CONFIG.functional.intercom_app_id  // ✅ MODIFIÉ
});
  
  console.log('✅ Intercom chargé');
};

const loadCrisp = () => {
  if (!CONFIG.functional.crisp_website_id) return;  // ✅ MODIFIÉ
  
  console.log('💬 Chargement Crisp...');
  
  window.$crisp=[];window.CRISP_WEBSITE_ID=CONFIG.functional.crisp_website_id;  // ✅ MODIFIÉ
  (function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
  
  console.log('✅ Crisp chargé');
};

const loadHubSpot = () => {
  if (!CONFIG.functional.hubspot_portal_id) return;  // ✅ MODIFIÉ
  
  console.log('💬 Chargement HubSpot...');
  
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.id = 'hs-script-loader';
  script.async = true;
  script.defer = true;
  script.src = `//js.hs-scripts.com/${CONFIG.functional.hubspot_portal_id}.js`;  // ✅ MODIFIÉ
  document.head.appendChild(script);
  
  console.log('✅ HubSpot chargé');
};

const loadSegment = () => {
  if (!CONFIG.functional.segment_write_key) return;  // ✅ MODIFIÉ
  
  console.log('💬 Chargement Segment...');
  
  !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey=CONFIG.functional.segment_write_key;analytics.SNIPPET_VERSION="4.15.3";  // ✅ MODIFIÉ
  analytics.load(CONFIG.functional.segment_write_key);  // ✅ MODIFIÉ
  analytics.page();
  }}();
  
  console.log('✅ Segment chargé');
};

const enableFunctionalCookies = () => {
  console.log('🔧 Activation cookies fonctionnels...');
  console.log('✅ Cookies fonctionnels activés');
};

// ========== GESTION DES PRÉFÉRENCES ==========
const applyPreferences = (prefs) => {
  if (!prefs) return;
  
  console.log('🎯 Application des préférences:', prefs);
  releaseByConsent(prefs);
  
  if (prefs.statistics) {
    loadGoogleAnalytics();
    loadGoogleTagManager();
    loadMatomo();
    loadMixpanel();
    loadAmplitude();
    loadPlausible();
    loadHotjar();
    loadClarity();
  }

  if (prefs.marketing) {
    loadFacebookPixel();
    loadGoogleAdSense();
    loadTikTokPixel();
    loadLinkedInInsight();
  }

  if (prefs.cookies) {
    enableFunctionalCookies();
    loadIntercom();
    loadCrisp();
    loadHubSpot();
    loadSegment();
  }
};

const savePrefs = async (obj, action = 'customize', method = 'banner') => {
  const record = {
    data: obj,  // ✅ CORRIGÉ (était "obj" au lieu de "data: obj")
    timestamp: Date.now(),
    expiresAt: Date.now() + EXPIRATION_MS
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  
  const logSuccess = await logConsentToServer(obj, action, method);
  
  if (!logSuccess) {
    console.error('[CookieConsent] ❌ Échec du logging - Services tiers non chargés pour garantir la conformité RGPD');
    
    document.dispatchEvent(new CustomEvent('cookieConsentChanged', {
      detail: { preferences: obj, logged: false }
    }));
    
    return;
  }
  
  console.log('[CookieConsent] ✅ Consentement validé - Chargement des services');
  
  document.dispatchEvent(new CustomEvent('cookieConsentChanged', {
    detail: { preferences: obj, logged: true }
  }));
  
  applyPreferences(obj);
};

// ========== INTERFACE ==========
function renderOnce() {
  if (document.getElementById('politecookiebanner')) return;

  const services = getConfiguredServices();
  
  const statsServicesText = services.statistics.length > 0 
    ? `<div class="pmcpli-services">${t('statsServices', { services: services.statistics.join(', ') })}</div>`
    : '';
    
  const marketingServicesText = services.marketing.length > 0
    ? `<div class="pmcpli-services">${t('marketingServices', { services: services.marketing.join(', ') })}</div>`
    : '';
    
  const cookiesServicesText = services.cookies.length > 0
    ? `<div class="pmcpli-services">${t('cookiesServices', { services: services.cookies.join(', ') })}</div>`
    : '';

  const loggingCategory = CONFIG.logger.enabled 
    ? `<div class="pmcpli-category pmcpli-logging">
        <div class="pmcpli-category-header pmcpli-category-clickable" tabindex="0" role="button" aria-expanded="false">
          <span class="pmcpli-category-title">${t('loggingTitle')}</span>
          <span class="pmcpli-icon pmcpli-open">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="18"><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/></svg>
          </span>
        </div>
        <div class="pmcpli-description" style="display:none;">
          <span>${t('loggingNotice')}</span>
        </div>
      </div>`
    : '';

  const tpl = `<div id="politecookiebanner" class="pmcpli-cookiebanner pmcpli-show"
    aria-label="cookiebanner" title="cookiebanner" aria-modal="true" data-nosnippet="true"
    role="dialog" aria-live="polite" style="display:none;" lang="${t.getLocale()}">
  <div class="pmcpli-header">
    <div class="pmcpli-title">${t('title')}</div>
    <div class="pmcpli-close" tabindex="0" role="button" title="cookiebanner" aria-label="${t('closeAria')}" role-js="close">
      <svg aria-hidden="true" focusable="false" viewBox="0 0 352 512" class="pmcpli-close-icon"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg>
    </div>
  </div>
  <div class="pmcpli-divider pmcpli-divider-header"></div>
  <div class="pmcpli-body">
    <div class="pmcpli-message">${t('message')}</div>
    <div class="pmcpli-categories" style="display:none;">
      
      ${loggingCategory}
      
      <div class="pmcpli-category pmcpli-functional">
        <div class="pmcpli-category-header pmcpli-category-clickable" tabindex="0" role="button" aria-expanded="false">
          <span class="pmcpli-category-title">${t('functionalTitle')}</span>
          <span class="pmcpli-category-status">${t('alwaysActive')}</span>
          <span class="pmcpli-icon pmcpli-open">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="18"><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/></svg>
          </span>
        </div>
        <div class="pmcpli-description" style="display:none;">
          <span class="pmcpli-description-functional">${t('functionalDesc')}</span>
        </div>
      </div>

      <div class="pmcpli-category pmcpli-cookies">
        <div class="pmcpli-category-header pmcpli-category-clickable" tabindex="0" role="button" aria-expanded="false">
          <span class="pmcpli-category-title">${t('cookiesTitle')}</span>
          <div class="checkbox-wrapper">
            <input type="checkbox" id="politecookiecheckboxcookies" name="politecookie['cookies']">
            <label for="politecookiecheckboxcookies"></label>
          </div>
          <span class="pmcpli-icon pmcpli-open">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="18"><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/></svg>
          </span>
        </div>
        <div class="pmcpli-description" style="display:none;">
          <span class="pmcpli-description-cookies">${t('cookiesDesc')}</span>
          ${cookiesServicesText}
        </div>
      </div>

      <div class="pmcpli-category pmcpli-statistics">
        <div class="pmcpli-category-header pmcpli-category-clickable" tabindex="0" role="button" aria-expanded="false">
          <span class="pmcpli-category-title">${t('statsTitle')}</span>
          <div class="checkbox-wrapper">
            <input type="checkbox" id="politecookiecheckboxstatistics" name="politecookie['statistics']">
            <label for="politecookiecheckboxstatistics"></label>
          </div>
          <span class="pmcpli-icon pmcpli-open">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="18"><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/></svg>
          </span>
        </div>
        <div class="pmcpli-description" style="display:none;">
          <span class="pmcpli-description-statistics-anonymous">${t('statsDesc')}</span>
          ${statsServicesText}
        </div>
      </div>

      <div class="pmcpli-category pmcpli-marketing">
        <div class="pmcpli-category-header pmcpli-category-clickable" tabindex="0" role="button" aria-expanded="false">
          <span class="pmcpli-category-title">${t('marketingTitle')}</span>
          <div class="checkbox-wrapper">
            <input type="checkbox" id="politecookiecheckboxmarketing" name="politecookie['marketing']">
            <label for="politecookiecheckboxmarketing"></label>
          </div>
          <span class="pmcpli-icon pmcpli-open">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="18"><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/></svg>
          </span>
        </div>
        <div class="pmcpli-description" style="display:none;">
          <span class="pmcpli-description-marketing">${t('marketingDesc')}</span>
          ${marketingServicesText}
        </div>
      </div>
    </div>
  </div>
  <div class="pmcpli-links pmcpli-information p-2"></div>
  <div class="pmcpli-divider pmcpli-footer"></div>
  <div class="pmcpli-buttons">
    <button class="pmcpli-btn pmcpli-accept">${t('acceptAll')}</button>
    <button class="pmcpli-btn pmcpli-deny">${t('denyAll')}</button>
    <button class="pmcpli-btn pmcpli-view-preferences">${t('viewPrefs')}</button>
    <button class="pmcpli-btn pmcpli-save-preferences" style="display:none;">${t('savePrefs')}</button>
    <button class="pmcpli-btn pmcpli-del-preferences" style="display:none;">${t('delPrefs')}</button>
  </div>
  <div class="pmcpli-links pmcpli-documents"></div>
</div>`;
  document.body.insertAdjacentHTML('beforeend', tpl);
}

const openBanner = (showPrefs = false) => {
  renderOnce();
  const el = document.getElementById('politecookiebanner');
  if (!el) return;
  el.style.display = 'block';
  
  setTimeout(() => {
    const firstButton = el.querySelector('button');
    if (firstButton) firstButton.focus();
  }, 100);
  
  if (showPrefs) {
    const cats = el.querySelector('.pmcpli-categories');
    cats.style.display = 'block';
    el.querySelector('.pmcpli-save-preferences').style.display = 'inline-block';
    el.querySelector('.pmcpli-del-preferences').style.display = 'inline-block';
    el.querySelector('.pmcpli-view-preferences').style.display = 'none';
  }
};

function attachHandlers() {
  const el = document.getElementById('politecookiebanner');
  if (!el) return;

  const stored = loadPrefs();
  if (stored) {
    el.querySelectorAll('input[name^="politecookie["]').forEach(cb => {
      const m = cb.name.match(/^politecookie\['(.+)'\]$/);
      if (m) cb.checked = !!stored[m[1]];
    });
    applyPreferences(stored);
  } else {
    el.style.display = 'block';
    el.querySelector('.pmcpli-categories').style.display = 'none';
  }

  scanAndFreezeThirdParty(stored);
  startObserver(stored);

  const save = async (action = 'customize', method = 'settings') => {
    const prefs = {};
    el.querySelectorAll('input[name^="politecookie["]').forEach(cb => {
      const m = cb.name.match(/^politecookie\['(.+)'\]$/);
      if (m) prefs[m[1]] = cb.checked;
    });
    await savePrefs(prefs, action, method);
    el.style.display = 'none';
  };

  const deletePrefs = async () => {
    localStorage.removeItem(STORAGE_KEY);

    if (CONFIG.logger.enabled) {
      await logConsentToServer(null, 'revoke', 'settings');
    }

    scanAndFreezeThirdParty(null);

    document.dispatchEvent(new CustomEvent('cookieConsentChanged', {
      detail: { preferences: null, action: 'revoke', logged: !!CONFIG.logger.enabled }
    }));

    el.querySelectorAll('input[name^="politecookie["]').forEach(cb => cb.checked = false);
    el.style.display = 'none';
  };

  const togglePreferencesView = () => {
    const cats = el.querySelector('.pmcpli-categories');
    const [saveBtn, delBtn, viewBtn] = ['.pmcpli-save-preferences', '.pmcpli-del-preferences', '.pmcpli-view-preferences']
      .map(sel => el.querySelector(sel));
    
    const isHidden = cats.style.display === 'none' || !cats.style.display;
    cats.style.display = isHidden ? 'block' : 'none';
    saveBtn.style.display = delBtn.style.display = isHidden ? 'inline-block' : 'none';
    viewBtn.style.display = isHidden ? 'none' : 'inline-block';
  };

  const toggleCategoryContent = (categoryHeader) => {
    const category = categoryHeader.closest('.pmcpli-category');
    const description = category.querySelector('.pmcpli-description');
    const icon = categoryHeader.querySelector('.pmcpli-icon svg');
    
    const isExpanded = categoryHeader.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      description.style.display = 'none';
      categoryHeader.setAttribute('aria-expanded', 'false');
      icon.style.transform = 'rotate(0deg)';
    } else {
      description.style.display = 'block';
      categoryHeader.setAttribute('aria-expanded', 'true');
      icon.style.transform = 'rotate(180deg)';
    }
  };

  const handlers = {
    '.pmcpli-close': () => el.style.display = 'none',
    '.pmcpli-accept': async () => {
      el.querySelectorAll('input[name^="politecookie["]').forEach(cb => cb.checked = true);
      await save('accept', 'banner');
    },
    '.pmcpli-deny': async () => {
      el.querySelectorAll('input[name^="politecookie["]').forEach(cb => cb.checked = false);
      await save('reject', 'banner');
    },
    '.pmcpli-view-preferences': togglePreferencesView,
    '.pmcpli-save-preferences': () => save('customize', 'settings'),
    '.pmcpli-del-preferences': deletePrefs
  };

  Object.entries(handlers).forEach(([selector, handler]) => {
    el.querySelector(selector)?.addEventListener('click', handler);
  });

  el.querySelectorAll('.pmcpli-category-clickable').forEach(header => {
    header.addEventListener('click', (e) => {
      if (e.target.closest('.checkbox-wrapper')) return;
      toggleCategoryContent(header);
    });
    
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCategoryContent(header);
      }
    });
  });

  el.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      el.style.display = 'none';
    }
  });

  document.addEventListener('click', e => {
    if (e.target.closest('#openpolitecookie, #openpolitecookie a')) {
      e.preventDefault();
      openBanner(true);
    }
  });
}

// ========== API GLOBALE ==========
window.CookieConsent = {
  open: openBanner,
  reset: () => { 
    localStorage.removeItem(STORAGE_KEY);
    openBanner(true); 
  },
  getPreferences: loadPrefs,
  hasConsent: category => {
    const prefs = loadPrefs();
    return !!(prefs?.[category]);
  },
  
  init: (options = {}) => {
    // Logger
    if (options.logger) {
      Object.assign(CONFIG.logger, {
        enabled: true,
        ...options.logger,
        headers: { ...CONFIG.logger.headers, ...(options.logger.headers || {}) }
      });
    }
    
    if (options.endpoint || options.apiKey || options.anonymousId !== undefined || options.headers) {
      CONFIG.logger.enabled = true;
      if (options.endpoint) CONFIG.logger.endpoint = options.endpoint;
      if (options.apiKey) CONFIG.logger.apiKey = options.apiKey;
      if (options.anonymousId !== undefined) CONFIG.logger.anonymousId = options.anonymousId;
      if (options.headers) Object.assign(CONFIG.logger.headers, options.headers);
    }
    
    // Statistics
    if (options.statistics) {
      if (options.statistics.google_analytics_key) {
        CONFIG.statistics.google_analytics_key = options.statistics.google_analytics_key;
      }
      if (options.statistics.google_tag_manager_key) {
        CONFIG.statistics.google_tag_manager_key = options.statistics.google_tag_manager_key;
      }
      if (options.statistics.matomo) {
        CONFIG.statistics.matomo = options.statistics.matomo;
      }
      if (options.statistics.mixpanel_token) {
        CONFIG.statistics.mixpanel_token = options.statistics.mixpanel_token;
      }
      if (options.statistics.amplitude_key) {
        CONFIG.statistics.amplitude_key = options.statistics.amplitude_key;
      }
      if (options.statistics.plausible) {
        CONFIG.statistics.plausible = options.statistics.plausible;
      }
      if (options.statistics.hotjar_site_id) {
        CONFIG.statistics.hotjar_site_id = options.statistics.hotjar_site_id;
      }
      if (options.statistics.clarity_project_id) {
        CONFIG.statistics.clarity_project_id = options.statistics.clarity_project_id;
      }
    }
    
    // Marketing
    if (options.marketing) {
      if (options.marketing.google_adsense_key) {
        CONFIG.marketing.google_adsense_key = options.marketing.google_adsense_key;
      }
      if (options.marketing.facebook_pixel) {
        CONFIG.marketing.facebook_pixel = options.marketing.facebook_pixel;
      }
      if (options.marketing.tiktok_pixel_id) {
        CONFIG.marketing.tiktok_pixel_id = options.marketing.tiktok_pixel_id;
      }
      if (options.marketing.linkedin_partner_id) {
        CONFIG.marketing.linkedin_partner_id = options.marketing.linkedin_partner_id;
      }
    }
    
    // ✅ NOUVEAU : Support de "functional" avec rétrocompatibilité "cookies"
    if (options.cookies) {
      console.warn('[CookieConsent] ⚠️ "cookies" est déprécié, utilisez "functional" à la place');
      options.functional = options.cookies;
    }
    
    if (options.functional) {
      if (options.functional.intercom_app_id) {
        CONFIG.functional.intercom_app_id = options.functional.intercom_app_id;
      }
      if (options.functional.crisp_website_id) {
        CONFIG.functional.crisp_website_id = options.functional.crisp_website_id;
      }
      if (options.functional.hubspot_portal_id) {
        CONFIG.functional.hubspot_portal_id = options.functional.hubspot_portal_id;
      }
      if (options.functional.segment_write_key) {
        CONFIG.functional.segment_write_key = options.functional.segment_write_key;
      }
    }
    
    console.log('[CookieConsent] Configuration appliquée:', {
      logger: CONFIG.logger.enabled,
      statistics: Object.keys(CONFIG.statistics).filter(k => CONFIG.statistics[k]),
      marketing: Object.keys(CONFIG.marketing).filter(k => CONFIG.marketing[k]),
      functional: Object.keys(CONFIG.functional).filter(k => CONFIG.functional[k])  // ✅ MODIFIÉ
    });
  },
  
  disableLogging: () => {
    CONFIG.logger.enabled = false;
  },
  
  getConfig: () => ({ ...CONFIG })
};

document.addEventListener('DOMContentLoaded', () => {
  renderOnce();
  attachHandlers();
  scanAndFreezeThirdParty(loadPrefs());
  startObserver(loadPrefs());
});    