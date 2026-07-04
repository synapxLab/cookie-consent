/**
 * @synapxlab/cookie-consent - Google Consent Mode v2
 * Module d'intégration Google Consent Mode v2
 *
 * 4 catégories supportées : necessary, functional, statistics, marketing
 * (alias `preferences` accepté en entrée pour future migration v3.x)
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
  region: ['US-CA', 'EU'] // ['US-CA', 'EU'] pour ciblage régional
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
      return false;
    }
    
    // Vérifier que l'environnement est compatible
    if (typeof window === 'undefined') {
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
      'security_storage': 'granted', // ✅ Toujours autorisé (cookies nécessaires)
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
    
    return true;
    
  } catch (error) {
    console.error('[CookieConsent] Erreur initialisation Google Consent Mode:', error);
    return false;
  }
};

/**
 * Met à jour Google Consent Mode selon les préférences utilisateur
 * 
 * ✅ v3.0.0: Support des 4 catégories
 * 
 * @param {Object} preferences - Préférences Cookie Consent 
 *                               {necessary, preferences, statistics, marketing}
 * @param {Object} config - Configuration GCM
 */
export const updateGoogleConsent = (preferences, config = GCM_DEFAULT_CONFIG) => {
  if (!config.enabled) return;
  
  // Créer gtag si n'existe pas encore
  if (typeof window.gtag !== 'function') {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
  }
  
  // Compat v2.x: le storage utilise encore la clé `functional`
  // (alias `preferences` accepté pour la future v3.x)
  const functionalConsent = preferences?.functional ?? preferences?.preferences ?? false;

  const consentMap = {
    // Marketing
    ad_storage: preferences?.marketing || false,
    ad_user_data: preferences?.marketing || false,
    ad_personalization: preferences?.marketing || false,

    // Statistics
    analytics_storage: preferences?.statistics || false,

    // Functional / Preferences
    functionality_storage: functionalConsent,
    personalization_storage: functionalConsent,

    // Necessary (toujours granted)
    security_storage: true
  };
  
  // Convertir boolean → 'granted'/'denied'
  const consentUpdate = {};
  for (const [key, value] of Object.entries(consentMap)) {
    consentUpdate[key] = value ? 'granted' : 'denied';
  }
  
  // Envoyer la mise à jour à Google
  window.gtag('consent', 'update', consentUpdate);
  
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
 * ✅ v3.0.0: Support des 4 catégories
 * 
 * @param {Object} preferences - Préférences Cookie Consent
 * @returns {Object} État des consentements Google
 */
export const getGoogleConsentState = (preferences) => {
  const functionalConsent = preferences?.functional ?? preferences?.preferences ?? false;
  return {
    ad_storage: preferences?.marketing ? 'granted' : 'denied',
    ad_user_data: preferences?.marketing ? 'granted' : 'denied',
    ad_personalization: preferences?.marketing ? 'granted' : 'denied',
    analytics_storage: preferences?.statistics ? 'granted' : 'denied',
    functionality_storage: functionalConsent ? 'granted' : 'denied',
    personalization_storage: functionalConsent ? 'granted' : 'denied',
    security_storage: 'granted' // Toujours granted (necessary)
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