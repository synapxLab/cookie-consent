/**
 * @synapxlab/cookie-consent
 * Bannière de consentement + Logger + Intégration services
 * 
 * @version 2.4.0
 * @author SynapxLab <contact@synapxlab.com>
 * @license MIT
 */

import '../scss/cookie.scss';
import t from './translat';
import v from './version';
import { 
  initGoogleConsentMode, 
  updateGoogleConsent, 
  getGoogleConsentState,
  GCM_DEFAULT_CONFIG 
} from './google-consent-mode';

const STORAGE_KEY = 'politecookiebanner';

// Configuration centralisée
const CONFIG = {
  logger: {
    enabled: false,
    endpoint: 'https://cookie.synapx.fr/',
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
  functional: {
    intercom_app_id: null,
    crisp_website_id: null,
    hubspot_portal_id: null,
    segment_write_key: null
  },
  storage: {
    expiration_months: 6,
    auto_renew: false
  },
  google_consent_mode: GCM_DEFAULT_CONFIG
};

const EXPIRATION_MS = Math.max(1,Number(CONFIG.storage.expiration_months || 6)) * 30 * 24 * 60 * 60 * 1000;

// ✅ Protection globale contre les erreurs GCM
const safeGCM = {
  init: (config) => {
    try {
      return initGoogleConsentMode(config);
    } catch (e) {
      console.error('[CookieConsent] GCM init failed:', e);
      return false;
    }
  },
  update: (prefs, config) => {
    try {
      return updateGoogleConsent(prefs, config);
    } catch (e) {
      console.error('[CookieConsent] GCM update failed:', e);
      return false;
    }
  },
  getState: (prefs) => {
    try {
      return getGoogleConsentState(prefs);
    } catch (e) {
      console.error('[CookieConsent] GCM getState failed:', e);
      return null;
    }
  }
};

// ========== UTILITAIRES ==========
const loadPrefs = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw || '{}');
    if (!parsed || typeof parsed !== 'object') return null;

    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed.data || parsed;
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

// ========== BLOQUEUR TIERS ==========
const CATEGORY_MATCHERS = [
  { cat: 'statistics', kw: ['google-analytics','gtag','tagmanager','matomo','plausible','hotjar','clarity','mixpanel','amplitude'] },
  { cat: 'marketing',  kw: ['adsense','doubleclick','facebook','fbq','tiktok','linkedin','snap.licdn','googlesyndication'] },
  { cat: 'cookies',    kw: ['intercom','crisp.chat','hubspot','hs-scripts.com','segment.com/analytics'] }
];

const detectCategoryFromUrl = (url='') => {
  const u = url.toLowerCase();
  for (const {cat, kw} of CATEGORY_MATCHERS) {
    if (kw.some(k => u.includes(k))) return cat;
  }
  return null;
};

const freezeElement = (el, cat) => {
  if (!cat || el.dataset.cookieBlocked === 'true') return;

  el.dataset.cookieBlocked = 'true';
  el.dataset.cookieCategory = cat;

  const placeholder = document.createElement(el.tagName);
  placeholder.setAttribute('type', 'text/plain');
  placeholder.dataset.cookieBlocked = 'true';
  placeholder.dataset.cookieCategory = cat;

  const attrs = {};
  for (const {name, value} of [...el.attributes]) {
    attrs[name] = value;
  }
  placeholder.dataset.cookieOrigAttrs = JSON.stringify(attrs);

  if (el.textContent && el.textContent.trim()) {
    placeholder.textContent = el.textContent;
  }

  el.replaceWith(placeholder);
};

const restoreElement = (placeholder) => {
  if (placeholder.dataset.cookieBlocked !== 'true') return;

  const cat = placeholder.dataset.cookieCategory;
  const attrs = JSON.parse(placeholder.dataset.cookieOrigAttrs || '{}');
  const real = document.createElement(placeholder.tagName);

  for (const [k,v] of Object.entries(attrs)) {
    if (k === 'type') continue;
    real.setAttribute(k, v);
  }

  if (!attrs.src && placeholder.textContent) {
    real.textContent = placeholder.textContent;
  }

  real.removeAttribute('data-cookie-blocked');
  real.removeAttribute('data-cookie-category');
  real.removeAttribute('data-cookie-orig-attrs');

  placeholder.replaceWith(real);

  if (real.tagName === 'SCRIPT' && !real.src && real.textContent) {
    const exec = document.createElement('script');
    exec.textContent = real.textContent;
    ['async','defer','nomodule','crossorigin','integrity','referrerpolicy'].forEach(a=>{
      if (real.hasAttribute(a)) exec.setAttribute(a, real.getAttribute(a));
    });
    real.replaceWith(exec);
  }
};

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

let __cookieObserver = null;
const startObserver = (prefs) => {
  if (__cookieObserver) return;
  __cookieObserver = new MutationObserver(muts => {
    muts.forEach(mu => {
      mu.addedNodes && [...mu.addedNodes].forEach(node => {
        if (!(node instanceof Element)) return;
        if ((node.tagName === 'SCRIPT' || node.tagName === 'IFRAME') && node.getAttribute('src')) {
          const src = node.getAttribute('src');
          const cat = detectCategoryFromUrl(src);
          if (cat && !(prefs && prefs[cat])) freezeElement(node, cat);
        }
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
  
  if (CONFIG.statistics.google_analytics_key) services.statistics.push('Google Analytics');
  if (CONFIG.statistics.google_tag_manager_key) services.statistics.push('Google Tag Manager');
  if (CONFIG.statistics.matomo) services.statistics.push('Matomo');
  if (CONFIG.statistics.mixpanel_token) services.statistics.push('Mixpanel');
  if (CONFIG.statistics.amplitude_key) services.statistics.push('Amplitude');
  if (CONFIG.statistics.plausible) services.statistics.push('Plausible');
  if (CONFIG.statistics.hotjar_site_id) services.statistics.push('Hotjar');
  if (CONFIG.statistics.clarity_project_id) services.statistics.push('Microsoft Clarity');
  
  if (CONFIG.marketing.google_adsense_key) services.marketing.push('Google AdSense');
  if (CONFIG.marketing.facebook_pixel) services.marketing.push('Facebook Pixel');
  if (CONFIG.marketing.tiktok_pixel_id) services.marketing.push('TikTok Pixel');
  if (CONFIG.marketing.linkedin_partner_id) services.marketing.push('LinkedIn Insight');
  
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
      
      if (response.ok) return true;
    } catch (error) {
      // Silent fail
    }
    
    if (attempt < CONFIG.logger.retries - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
    }
  }
  
  return false;
};

// ========== INTÉGRATION SERVICES ==========
const loadGoogleAnalytics = () => {
  if (!CONFIG.statistics.google_analytics_key) return;
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
};

const loadGoogleTagManager = () => {
  if (!CONFIG.statistics.google_tag_manager_key) return;
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer',CONFIG.statistics.google_tag_manager_key);
};

const loadMatomo = () => {
  if (!CONFIG.statistics.matomo) return;
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
};

const loadMixpanel = () => {
  if (!CONFIG.statistics.mixpanel_token) return;
  (function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");
  for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?
  MIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);
  mixpanel.init(CONFIG.statistics.mixpanel_token);
};

const loadAmplitude = () => {
  if (!CONFIG.statistics.amplitude_key) return;
  (function(e,t){var n=e.amplitude||{_q:[],_iq:{}};var r=t.createElement("script")
  ;r.type="text/javascript"
  ;r.integrity="sha384-+EO59vL/X7v6VE2TJlBECHx/uaPlWB9hXD/WvJOg5BDSeG7RcKvvFhg2nLNdDhY+"
  ;r.crossOrigin="anonymous";r.async=true
  ;r.src="https://cdn.amplitude.com/libs/amplitude-8.21.4-min.gz.js"
  ;r.onload=function(){if(!e.amplitude.runQueuedFunctions){}};
  var s=t.getElementsByTagName("script")[0]
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
};

const loadPlausible = () => {
  if (!CONFIG.statistics.plausible) return;
  const script = document.createElement('script');
  script.defer = true;
  script.dataset.domain = CONFIG.statistics.plausible.domain;
  script.src = 'https://plausible.io/js/script.js';
  document.head.appendChild(script);
};

const loadHotjar = () => {
  if (!CONFIG.statistics.hotjar_site_id) return;
  (function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:CONFIG.statistics.hotjar_site_id,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
};

const loadClarity = () => {
  if (!CONFIG.statistics.clarity_project_id) return;
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", CONFIG.statistics.clarity_project_id);
};

const loadFacebookPixel = () => {
  if (!CONFIG.marketing.facebook_pixel) return;
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
};

const loadGoogleAdSense = () => {
  if (!CONFIG.marketing.google_adsense_key) return;
  const script = document.createElement('script');
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CONFIG.marketing.google_adsense_key}`;
  script.async = true;
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
};

const loadTikTokPixel = () => {
  if (!CONFIG.marketing.tiktok_pixel_id) return;  
  !function (w, d, t) {
    w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
    ttq.load(CONFIG.marketing.tiktok_pixel_id);
    ttq.page();
  }(window, document, 'ttq');
};

const loadLinkedInInsight = () => {
  if (!CONFIG.marketing.linkedin_partner_id) return;
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
};

const loadIntercom = () => {
  if (!CONFIG.functional.intercom_app_id) return;
  (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/' + CONFIG.functional.intercom_app_id;var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s,x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
  window.Intercom('boot', { app_id: CONFIG.functional.intercom_app_id });
};

const loadCrisp = () => {
  if (!CONFIG.functional.crisp_website_id) return;
  window.$crisp=[];window.CRISP_WEBSITE_ID=CONFIG.functional.crisp_website_id;
  (function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
};

const loadHubSpot = () => {
  if (!CONFIG.functional.hubspot_portal_id) return;
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.id = 'hs-script-loader';
  script.async = true;
  script.defer = true;
  script.src = `//js.hs-scripts.com/${CONFIG.functional.hubspot_portal_id}.js`;
  document.head.appendChild(script);
};

const loadSegment = () => {
  if (!CONFIG.functional.segment_write_key) return;
  !function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey=CONFIG.functional.segment_write_key;analytics.SNIPPET_VERSION="4.15.3";
  analytics.load(CONFIG.functional.segment_write_key);
  analytics.page();
  }}();
};

const enableFunctionalCookies = () => {};

// ========== GESTION DES PRÉFÉRENCES ==========
const applyPreferences = (prefs) => {
  if (!prefs) return;
  updateGoogleConsent(prefs, CONFIG.google_consent_mode);
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
    data: obj,
    timestamp: Date.now(),
    expiresAt: Date.now() + EXPIRATION_MS
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  
  const logSuccess = await logConsentToServer(obj, action, method);
  
  if (!logSuccess) {
    console.error('[CookieConsent] ⚠ Échec du logging - Services tiers non chargés pour garantir la conformité RGPD');
    document.dispatchEvent(new CustomEvent('cookieConsentChanged', {
      detail: { preferences: obj, logged: false }
    }));
    return;
  }
  
  document.dispatchEvent(new CustomEvent('cookieConsentChanged', {
    detail: { preferences: obj, logged: true }
  }));
  
  applyPreferences(obj);
};

// ========== GÉNÉRATION DU SÉLECTEUR DE LANGUE ==========
const generateLanguageSelector = () => {
  const languages = t.dict;
  const currentLang = t.getLocale();
  
  let options = '';
  for (const [code, data] of Object.entries(languages)) {
    const selected = code === currentLang ? 'selected' : '';
    options += `<option value="${code}" ${selected}>${data.label}</option>`;
  }
  
  return `
    <div class="pmcpli-lang-selector">
      <select id="pmcpli-lang-select" aria-label="Choisir la langue">${options}</select>
      <svg class="pmcpli-lang-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16">
        <path fill="currentColor" d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z"/>
      </svg>
    </div>
  `;
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
    ${generateLanguageSelector()}
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

// ========== FONCTION DE RAFRAÎCHISSEMENT DU CONTENU ==========
const refreshBannerContent = () => {
  const el = document.getElementById('politecookiebanner');
  if (!el) return;

  // Sauvegarder l'état des checkboxes
  const checkboxStates = {};
  el.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    checkboxStates[cb.id] = cb.checked;
  });

  // Sauvegarder l'état des catégories (ouvertes/fermées)
  const categoryStates = {};
  el.querySelectorAll('.pmcpli-category-clickable').forEach(header => {
    const category = header.closest('.pmcpli-category');
    const className = Array.from(category.classList).find(c => c.startsWith('pmcpli-'));
    categoryStates[className] = header.getAttribute('aria-expanded') === 'true';
  });

  // Mettre à jour l'attribut lang
  el.setAttribute('lang', t.getLocale());

  // Mettre à jour les textes
  el.querySelector('.pmcpli-title').textContent = t('title');
  el.querySelector('.pmcpli-message').textContent = t('message');

  // Mettre à jour les catégories
  const categories = [
    { selector: '.pmcpli-functional .pmcpli-category-title', key: 'functionalTitle' },
    { selector: '.pmcpli-functional .pmcpli-category-status', key: 'alwaysActive' },
    { selector: '.pmcpli-functional .pmcpli-description-functional', key: 'functionalDesc' },
    { selector: '.pmcpli-cookies .pmcpli-category-title', key: 'cookiesTitle' },
    { selector: '.pmcpli-cookies .pmcpli-description-cookies', key: 'cookiesDesc' },
    { selector: '.pmcpli-statistics .pmcpli-category-title', key: 'statsTitle' },
    { selector: '.pmcpli-statistics .pmcpli-description-statistics-anonymous', key: 'statsDesc' },
    { selector: '.pmcpli-marketing .pmcpli-category-title', key: 'marketingTitle' },
    { selector: '.pmcpli-marketing .pmcpli-description-marketing', key: 'marketingDesc' }
  ];

  categories.forEach(({ selector, key }) => {
    const elem = el.querySelector(selector);
    if (elem) elem.textContent = t(key);
  });

  // Mettre à jour les boutons
  const buttons = [
    { selector: '.pmcpli-accept', key: 'acceptAll' },
    { selector: '.pmcpli-deny', key: 'denyAll' },
    { selector: '.pmcpli-view-preferences', key: 'viewPrefs' },
    { selector: '.pmcpli-save-preferences', key: 'savePrefs' },
    { selector: '.pmcpli-del-preferences', key: 'delPrefs' }
  ];

  buttons.forEach(({ selector, key }) => {
    const btn = el.querySelector(selector);
    if (btn) btn.textContent = t(key);
  });

  // Mettre à jour le logging si présent
  const loggingTitle = el.querySelector('.pmcpli-logging .pmcpli-category-title');
  if (loggingTitle) loggingTitle.textContent = t('loggingTitle');
  
  const loggingDesc = el.querySelector('.pmcpli-logging .pmcpli-description span');
  if (loggingDesc) loggingDesc.innerHTML = t('loggingNotice');

  // Restaurer l'état des checkboxes
  Object.entries(checkboxStates).forEach(([id, checked]) => {
    const cb = el.querySelector(`#${id}`);
    if (cb) cb.checked = checked;
  });

  // Restaurer l'état des catégories
  Object.entries(categoryStates).forEach(([className, isExpanded]) => {
    const category = el.querySelector(`.${className}`);
    if (category) {
      const header = category.querySelector('.pmcpli-category-clickable');
      const description = category.querySelector('.pmcpli-description');
      const icon = header.querySelector('.pmcpli-icon svg');
      
      if (isExpanded) {
        description.style.display = 'block';
        header.setAttribute('aria-expanded', 'true');
        icon.style.transform = 'rotate(180deg)';
      } else {
        description.style.display = 'none';
        header.setAttribute('aria-expanded', 'false');
        icon.style.transform = 'rotate(0deg)';
      }
    }
  });
};

function attachHandlers() {
  const el = document.getElementById('politecookiebanner');
  if (!el) return;

  try {
    initGoogleConsentMode(CONFIG.google_consent_mode);
  } catch (error) {
    console.error('[CookieConsent] Erreur initialisation Google Consent Mode:', error);
  }

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

  // ========== GESTIONNAIRE DE CHANGEMENT DE LANGUE ==========
  const langSelect = el.querySelector('#pmcpli-lang-select');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => {
      const newLang = e.target.value;
      t.setLocale(newLang);
      refreshBannerContent();
    });
  }

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

    try {
      if (options.google_consent_mode !== undefined) {
        if (typeof options.google_consent_mode === 'boolean') {
          CONFIG.google_consent_mode.enabled = options.google_consent_mode;
        } else if (typeof options.google_consent_mode === 'object' && options.google_consent_mode !== null) {
          const validConfig = {};
          
          if (typeof options.google_consent_mode.enabled === 'boolean') {
            validConfig.enabled = options.google_consent_mode.enabled;
          }
          
          if (typeof options.google_consent_mode.wait_for_update === 'number' && 
              options.google_consent_mode.wait_for_update >= 0) {
            validConfig.wait_for_update = options.google_consent_mode.wait_for_update;
          }
          
          if (typeof options.google_consent_mode.ads_data_redaction === 'boolean') {
            validConfig.ads_data_redaction = options.google_consent_mode.ads_data_redaction;
          }
          
          if (typeof options.google_consent_mode.url_passthrough === 'boolean') {
            validConfig.url_passthrough = options.google_consent_mode.url_passthrough;
          }
          
          if (Array.isArray(options.google_consent_mode.region)) {
            validConfig.region = options.google_consent_mode.region.filter(r => typeof r === 'string');
          }
          
          Object.assign(CONFIG.google_consent_mode, validConfig);
        }
      }
    } catch (error) {
      console.error('[CookieConsent] Erreur configuration Google Consent Mode:', error);
    }
    
    console.log('[CookieConsent] Configuration appliquée:', {
      logger: CONFIG.logger.enabled,
      google_consent_mode: CONFIG.google_consent_mode?.enabled || false,
      statistics: Object.keys(CONFIG.statistics).filter(k => CONFIG.statistics[k]),
      marketing: Object.keys(CONFIG.marketing).filter(k => CONFIG.marketing[k]),
      functional: Object.keys(CONFIG.functional).filter(k => CONFIG.functional[k])
    });
  },
  
  disableLogging: () => {
    CONFIG.logger.enabled = false;
  },
  
  getConfig: () => ({ ...CONFIG }),

  getGoogleConsent: () => {
    try {
      const prefs = loadPrefs();
      const state = getGoogleConsentState(prefs);
      
      if (!state) {
        console.warn('[CookieConsent] Impossible de récupérer l\'état Google Consent');
        return null;
      }
      
      return state;
    } catch (error) {
      console.error('[CookieConsent] Erreur getGoogleConsent:', error);
      return null;
    }
  },
  
  updateGoogleConsent: (customConsent) => {
    try {
      if (!customConsent || typeof customConsent !== 'object') {
        console.warn('[CookieConsent] Consentement invalide');
        return false;
      }
      
      if (typeof window.gtag !== 'function') {
        console.warn('[CookieConsent] gtag() non disponible');
        return false;
      }
      
      window.gtag('consent', 'update', customConsent);
      console.log('[CookieConsent] Google Consent Mode mis à jour manuellement');
      return true;
    } catch (error) {
      console.error('[CookieConsent] Erreur updateGoogleConsent:', error);
      return false;
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  try {
    initGoogleConsentMode(CONFIG.google_consent_mode);
  } catch (error) {
    console.error('[CookieConsent] Erreur initialisation Google Consent Mode au chargement:', error);
  }
  renderOnce();
  attachHandlers();
  scanAndFreezeThirdParty(loadPrefs());
  startObserver(loadPrefs());
});