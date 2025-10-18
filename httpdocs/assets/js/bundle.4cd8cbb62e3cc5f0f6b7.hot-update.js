"use strict";
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_synapxlab_cookie_consent"]("bundle",{

/***/ "./src/js/script.js":
/*!**************************!*\
  !*** ./src/js/script.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _scss_style_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scss/style.scss */ \"./src/scss/style.scss\");\n/* harmony import */ var _cookie__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./cookie */ \"./src/js/cookie.js\");\n\r\n\r\n\r\n/*********************************************************************************************************/\r\n\r\nconst js = () => {\r\n  const resetBtn = document.getElementById('btn-reset-consent');\r\n  const openBtn = document.getElementById('btn-open-consent');\r\n  \r\n  resetBtn?.addEventListener('click', () => {\r\n    if (window.CookieConsent?.reset) {\r\n      window.CookieConsent.reset();\r\n    } else {\r\n      try {\r\n        localStorage.removeItem('politecookiebanner');\r\n      } catch {\r\n        // ignore error\r\n      }\r\n      alert('Consentement effacé. Rechargez la page avec F5 pour voir la bannière.');\r\n    }\r\n  });\r\n\r\n  openBtn?.addEventListener('click', () => {\r\n    if (window.CookieConsent?.open) {\r\n      window.CookieConsent.open(true);\r\n    } else {\r\n      const link = document.querySelector('#openpolitecookie a');\r\n      if (link) { \r\n        link.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })); \r\n      }\r\n    }\r\n  });\r\n  \r\n  // Gestion des thèmes\r\n  const THEMES = ['default', 'brown', 'dark', 'blue'];\r\n  const root = document.body;\r\n  \r\n  function applyTheme(name) {\r\n    THEMES.forEach(t => root.classList.remove('cookie-theme-' + t));\r\n    root.classList.add('cookie-theme-' + name);\r\n  }\r\n  \r\n  if (!THEMES.some(t => root.classList.contains('cookie-theme-' + t))) {\r\n    root.classList.add('cookie-theme-default');\r\n  }\r\n  \r\n  document.querySelector('.theme-switch')?.addEventListener('click', (e) => {\r\n    const btn = e.target.closest('button[data-theme]');\r\n    if (!btn) return;\r\n    applyTheme(btn.dataset.theme);\r\n  });\r\n};\r\n\r\n// API pour les développeurs\r\nwindow.addEventListener('load', () => {\r\n  console.log('🚀 API Cookie Consent disponible:');\r\n  console.log('- window.CookieConsent.init(options)');\r\n  console.log('- window.CookieConsent.open()');\r\n  console.log('- window.CookieConsent.reset()');\r\n  console.log('- window.CookieConsent.getPreferences()');\r\n  console.log('- window.CookieConsent.hasConsent(\"statistics\")');\r\n  console.log('- window.CookieConsent.getConfig()');\r\n});\r\n\r\n\r\n\r\nwindow.CookieConsent.init({\r\n  logger: {\r\n    enabled: true,\r\n    apiKey: 'fd429de86f2e3cd71c4b18',\r\n    anonymousId: true,\r\n    includeUserAgent: true,\r\n    headers: {\r\n      'Authorization': 'Bearer apk_e62933f5cb8e1',\r\n          // 'X-Request-Id': crypto.randomUUID()\r\n    }\r\n  },\r\n  statistics: {\r\n    google_analytics_key: 'G-ABC123XYZ',\r\n    google_tag_manager_key: 'GTM-XXX',       // ✅\r\n    matomo: { url: '...', siteId: 1 },       // ✅\r\n    mixpanel_token: 'xxx',                   // ✅\r\n    amplitude_key: 'xxx',                    // ✅\r\n    plausible: { domain: 'example.com' },    // ✅\r\n    hotjar_site_id: 123456,                  // ✅\r\n    clarity_project_id: 'xxx'                // ✅    \r\n  },\r\n  marketing: {\r\n    google_adsense_key: 'ca-pub-1234567890123456',\r\n    facebook_pixel: {\r\n      key: '123456789012345',\r\n      track: 'PageView'\r\n    },\r\n    functional: {\r\n  intercom_app_id: 'xxx',                  // ✅\r\n  crisp_website_id: 'xxx',                 // ✅\r\n  hubspot_portal_id: 'xxx',                // ✅\r\n  segment_write_key: 'xxx'                 // ✅\r\n}    \r\n  // tiktok_pixel_id: 'xxx',                  \r\n  // linkedin_partner_id: 'xxx'                   \r\n\r\n}\r\n});\r\ndocument.addEventListener('DOMContentLoaded', () => {\r\n\r\n  console.log(window.CookieConsent.getConfig());\r\n  js();\r\n});\r\n\n\n//# sourceURL=webpack://@synapxlab/cookie-consent/./src/js/script.js?\n}");

/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("6b023d66e72252beb4c8")
/******/ })();
/******/ 
/******/ }
);