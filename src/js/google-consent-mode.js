/**
 * @synapxlab/cookie-consent - Google Consent Mode v2
 * Module d'intégration Google Consent Mode v2
 * 
 * @version 2.5.0
 * @author SynapxLab <contact@synapxlab.com>
 * @license MIT
 */

/**
 * Configuration par défaut Google Consent Mode v2
 * À fusionner avec CONFIG dans cookie.js
 */
export const GCM_DEFAULT_CONFIG = {
  enabled: true,
  wait_for_update: 500, // ms avant timeout
  ads_data_redaction: true,
  url_passthrough: false,
  region: [] // ['US-CA', 'EU'] pour ciblage régional
};

/**
 * Initialise Google Consent Mode v2 avec les valeurs par défaut (denied)
 * À appeler AVANT le chargement de Google Analytics/GTM
 * 
 * @param {Object} config - Configuration GCM
 */
export const initGoogleConsentMode = (config = GCM_DEFAULT_CONFIG) => {
  try {
    if (!config || !config.enabled) {
      console.log('[CookieConsent] Google Consent Mode v2 désactivé');
      return false;
    }
    
    // Vérifier que l'environnement est compatible
    if (typeof window === 'undefined') {
      console.warn('[CookieConsent] Environnement non compatible (pas de window)');
      return false;
    }
    
    // Créer window.dataLayer si n'existe pas
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = window.gtag || gtag;
    
    // Définir les valeurs par défaut (mode "denied")
    gtag('consent', 'default', {
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'analytics_storage': 'denied',
      'functionality_storage': 'denied',
      'personalization_storage': 'denied',
      'security_storage': 'granted', // Toujours autorisé (cookies techniques)
      'wait_for_update': config.wait_for_update || 500
    });

    // Options avancées
    if (config.ads_data_redaction) {
      gtag('set', 'ads_data_redaction', true);
    }
    
    if (config.url_passthrough) {
      gtag('set', 'url_passthrough', true);
    }
    
    if (config.region && Array.isArray(config.region) && config.region.length > 0) {
      gtag('consent', 'default', {
        'region': config.region
      });
    }
    
    console.log('[CookieConsent] ✅ Google Consent Mode v2 initialisé');
    return true;
    
  } catch (error) {
    console.error('[CookieConsent] ❌ Erreur initialisation Google Consent Mode:', error);
    return false;
  }
};

/**
 * Met à jour Google Consent Mode selon les préférences utilisateur
 * 
 * @param {Object} preferences - Préférences Cookie Consent {statistics, marketing, cookies}
 * @param {Object} config - Configuration GCM
 */
export const updateGoogleConsent = (preferences, config = GCM_DEFAULT_CONFIG) => {
  if (!config.enabled) return;
  
  // Créer gtag si n'existe pas encore
  if (typeof window.gtag !== 'function') {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
  }
  
  // Mapping des catégories Cookie Consent → Google Consent Mode
  const consentMap = {
    ad_storage: preferences?.marketing || false,
    ad_user_data: preferences?.marketing || false,
    ad_personalization: preferences?.marketing || false,
    analytics_storage: preferences?.statistics || false,
    functionality_storage: preferences?.cookies || false,
    personalization_storage: preferences?.cookies || false,
    security_storage: true // Toujours granted
  };
  
  // Convertir boolean → 'granted'/'denied'
  const consentUpdate = {};
  for (const [key, value] of Object.entries(consentMap)) {
    consentUpdate[key] = value ? 'granted' : 'denied';
  }
  
  // Envoyer la mise à jour à Google
  window.gtag('consent', 'update', consentUpdate);
  
  console.log('[CookieConsent] ✅ Google Consent Mode v2 mis à jour:', consentUpdate);
  
  // Dispatch event pour intégrations tierces
  document.dispatchEvent(new CustomEvent('googleConsentUpdated', {
    detail: { 
      consent: consentUpdate, 
      preferences,
      timestamp: Date.now()
    }
  }));
};

/**
 * Récupère l'état actuel du consentement Google
 * 
 * @param {Object} preferences - Préférences Cookie Consent
 * @returns {Object} État des consentements Google
 */
export const getGoogleConsentState = (preferences) => {
  return {
    ad_storage: preferences?.marketing ? 'granted' : 'denied',
    ad_user_data: preferences?.marketing ? 'granted' : 'denied',
    ad_personalization: preferences?.marketing ? 'granted' : 'denied',
    analytics_storage: preferences?.statistics ? 'granted' : 'denied',
    functionality_storage: preferences?.cookies ? 'granted' : 'denied',
    personalization_storage: preferences?.cookies ? 'granted' : 'denied',
    security_storage: 'granted'
  };
};

/**
 * Mise à jour manuelle du consentement Google
 * Utile pour des cas d'usage avancés
 * 
 * @param {Object} customConsent - Objet de consentement personnalisé
 */
export const forceUpdateGoogleConsent = (customConsent) => {
  if (typeof window.gtag !== 'function') {
    console.warn('[CookieConsent] gtag() non disponible, impossible de mettre à jour le consentement');
    return false;
  }
  
  window.gtag('consent', 'update', customConsent);
  console.log('[CookieConsent] ✅ Google Consent Mode mis à jour manuellement:', customConsent);
  
  return true;
};

/**
 * Vérifie si Google Consent Mode est disponible
 * 
 * @returns {boolean} True si gtag() est disponible
 */
export const isGoogleConsentModeAvailable = () => {
  return typeof window.gtag === 'function' && Array.isArray(window.dataLayer);
};

/**
 * Récupère l'historique complet des événements Consent Mode
 * Utile pour le debugging
 * 
 * @returns {Array} Événements dataLayer
 */
export const getConsentHistory = () => {
  if (!Array.isArray(window.dataLayer)) return [];
  
  return window.dataLayer.filter(event => {
    return event[0] === 'consent' || event.event === 'consent';
  });
};

/**
 * Réinitialise Google Consent Mode (pour testing)
 * ⚠️ À utiliser uniquement en développement
 */
export const resetGoogleConsentMode = () => {
  if (window.dataLayer) {
    window.dataLayer.length = 0;
  }
  delete window.gtag;
  console.log('[CookieConsent] ⚠️ Google Consent Mode réinitialisé');
};

/**
 * Helper pour créer une configuration GCM personnalisée
 * 
 * @param {Object} options - Options personnalisées
 * @returns {Object} Configuration GCM fusionnée
 */
export const createGCMConfig = (options = {}) => {
  return {
    ...GCM_DEFAULT_CONFIG,
    ...options
  };
};

/**
 * Écoute les changements de consentement Google
 * 
 * @param {Function} callback - Fonction appelée lors des mises à jour
 * @returns {Function} Fonction de nettoyage
 */
export const onGoogleConsentChange = (callback) => {
  const handler = (event) => {
    callback(event.detail);
  };
  
  document.addEventListener('googleConsentUpdated', handler);
  
  // Retourne une fonction pour se désabonner
  return () => {
    document.removeEventListener('googleConsentUpdated', handler);
  };
};

// Export par défaut pour import simple
export default {
  GCM_DEFAULT_CONFIG,
  initGoogleConsentMode,
  updateGoogleConsent,
  getGoogleConsentState,
  forceUpdateGoogleConsent,
  isGoogleConsentModeAvailable,
  getConsentHistory,
  resetGoogleConsentMode,
  createGCMConfig,
  onGoogleConsentChange
};