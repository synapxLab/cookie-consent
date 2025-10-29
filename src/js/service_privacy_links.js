/**
 * @synapxlab/cookie-consent - service_privacy_links
 * Liens vers les politiques de confidentialité des services tiers
 * 
 * @version 3.0.0
 * @author SynapxLab <contact@synapxlab.com>
 * @license MIT
 */

/**
 * Mapping des services vers leurs politiques de confidentialité
 */
export const PRIVACY_LINKS = {
  // ========== STATISTICS ==========
  'Google Analytics': {
    url: 'https://business.safety.google/privacy/',
    name: 'Google Analytics'
  },
  'Google Tag Manager': {
    url: 'https://business.safety.google/privacy/',
    name: 'Google Tag Manager'
  },
  'Matomo': {
    url: 'https://matomo.org/privacy-policy/',
    name: 'Matomo'
  },
  'Mixpanel': {
    url: 'https://mixpanel.com/legal/privacy-policy/',
    name: 'Mixpanel'
  },
  'Amplitude': {
    url: 'https://amplitude.com/privacy',
    name: 'Amplitude'
  },
  'Plausible': {
    url: 'https://plausible.io/privacy',
    name: 'Plausible'
  },
  'Hotjar': {
    url: 'https://www.hotjar.com/legal/policies/privacy/',
    name: 'Hotjar'
  },
  'Microsoft Clarity': {
    url: 'https://privacy.microsoft.com/privacystatement',
    name: 'Microsoft Clarity'
  },

  // ========== MARKETING ==========
  'Google AdSense': {
    url: 'https://business.safety.google/privacy/',
    name: 'Google AdSense'
  },
  'Facebook Pixel': {
    url: 'https://www.facebook.com/privacy/policy/',
    name: 'Facebook Pixel'
  },
  'TikTok Pixel': {
    url: 'https://www.tiktok.com/legal/page/row/privacy-policy/en',
    name: 'TikTok Pixel'
  },
  'LinkedIn Insight': {
    url: 'https://www.linkedin.com/legal/privacy-policy',
    name: 'LinkedIn Insight'
  },

  // ========== PREFERENCES (anciennement FUNCTIONAL) ==========
  'Intercom': {
    url: 'https://www.intercom.com/legal/privacy',
    name: 'Intercom'
  },
  'Crisp': {
    url: 'https://crisp.chat/en/privacy/',
    name: 'Crisp'
  },
  'HubSpot': {
    url: 'https://legal.hubspot.com/privacy-policy',
    name: 'HubSpot'
  },
  'Segment': {
    url: 'https://www.twilio.com/legal/privacy',
    name: 'Segment'
  }
};

/**
 * Génère un lien HTML vers la politique de confidentialité d'un service
 * 
 * @param {string} serviceName - Nom du service
 * @returns {string} - HTML du lien ou nom du service si pas de lien
 */
export const generatePrivacyLink = (serviceName) => {
  const privacyInfo = PRIVACY_LINKS[serviceName];
  
  if (!privacyInfo) {
    return serviceName;
  }
  
  return `<a href="${privacyInfo.url}" target="_blank" rel="noopener noreferrer" class="pmcpli-privacy-link">${serviceName}</a>`;
};

/**
 * Génère une liste de services avec leurs liens de confidentialité
 * 
 * @param {Array<string>} services - Liste des noms de services
 * @returns {string} - HTML formaté avec les liens
 */
export const generateServicesListWithLinks = (services) => {
  if (!services || services.length === 0) {
    return '';
  }
  
  const linksHtml = services
    .map(service => generatePrivacyLink(service))
    .join(', ');
  
  return linksHtml;
};

/**
 * Vérifie si un service a un lien de confidentialité
 * 
 * @param {string} serviceName - Nom du service
 * @returns {boolean}
 */
export const hasPrivacyLink = (serviceName) => {
  return !!PRIVACY_LINKS[serviceName];
};

/**
 * Récupère l'URL de confidentialité d'un service
 * 
 * @param {string} serviceName - Nom du service
 * @returns {string|null} - URL ou null si pas disponible
 */
export const getPrivacyUrl = (serviceName) => {
  return PRIVACY_LINKS[serviceName]?.url || null;
};

/**
 * Ajoute un nouveau service et son lien de confidentialité
 * (Utile pour les services personnalisés)
 * 
 * @param {string} serviceName - Nom du service
 * @param {string} privacyUrl - URL de la politique de confidentialité
 */
export const addCustomPrivacyLink = (serviceName, privacyUrl) => {
  PRIVACY_LINKS[serviceName] = {
    url: privacyUrl,
    name: serviceName
  };
};

// Export par défaut
export default {
  PRIVACY_LINKS,
  generatePrivacyLink,
  generateServicesListWithLinks,
  hasPrivacyLink,
  getPrivacyUrl,
  addCustomPrivacyLink
};