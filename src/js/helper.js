/**
 * @synapxlab/cookie-consent - helper
 * Utilitaires pour le système de cookie consent
 * 
 * @version 2.5.1
 * @author SynapxLab <contact@synapxlab.com>
 * @license MIT
 */

/**
 * Remplace les variables dans un template
 * Supporte : [company.name], [company.website], etc.
 * 
 * @param {string} template - Chaîne contenant des variables entre crochets
 * @param {Object} variables - Objet contenant les valeurs de remplacement
 * @returns {string} - Chaîne avec variables remplacées
 * 
 * @example
 * replaceVariables("Bienvenue chez [company.name]", { company: { name: "Acme" }})
 * // => "Bienvenue chez Acme"
 */
export const replaceVariables = (template, variables = {}) => {
  if (!template || typeof template !== 'string') return template;
  
  // Regex pour capturer [path.to.variable]
  const regex = /\[([a-zA-Z0-9_.]+)\]/g;
  
  return template.replace(regex, (match, path) => {
    // Diviser le chemin (ex: "company.name" => ["company", "name"])
    const keys = path.split('.');
    
    // Naviguer dans l'objet variables
    let value = variables;
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        // Si la clé n'existe pas, retourner le placeholder original
        return match;
      }
    }
    
    // Retourner la valeur trouvée ou le placeholder si null/undefined
    return value != null ? String(value) : match;
  });
};

/**
 * Applique le templating sur un objet de traductions complet
 * 
 * @param {Object} translations - Objet de traductions
 * @param {Object} variables - Variables à remplacer
 * @returns {Object} - Objet avec variables remplacées
 * 
 * @example
 * applyTemplateToTranslations(
 *   { message: "Bienvenue chez [company.name]" },
 *   { company: { name: "Acme" }}
 * )
 * // => { message: "Bienvenue chez Acme" }
 */
export const applyTemplateToTranslations = (translations, variables) => {
  if (!translations || typeof translations !== 'object') return translations;
  
  const result = {};
  
  for (const [key, value] of Object.entries(translations)) {
    if (typeof value === 'string') {
      result[key] = replaceVariables(value, variables);
    } else if (typeof value === 'object' && value !== null) {
      // Récursif pour les objets imbriqués
      result[key] = applyTemplateToTranslations(value, variables);
    } else {
      result[key] = value;
    }
  }
  
  return result;
};

/**
 * Extrait les variables depuis un template
 * Utile pour le debugging
 * 
 * @param {string} template - Chaîne contenant des variables
 * @returns {Array<string>} - Liste des variables trouvées
 * 
 * @example
 * extractVariables("Bienvenue chez [company.name] sur [company.website]")
 * // => ["company.name", "company.website"]
 */
export const extractVariables = (template) => {
  if (!template || typeof template !== 'string') return [];
  
  const regex = /\[([a-zA-Z0-9_.]+)\]/g;
  const matches = [];
  let match;
  
  while ((match = regex.exec(template)) !== null) {
    matches.push(match[1]);
  }
  
  return matches;
};

/**
 * Valide qu'un objet de variables contient toutes les clés nécessaires
 * 
 * @param {string} template - Template à valider
 * @param {Object} variables - Variables disponibles
 * @returns {Object} - { valid: boolean, missing: Array<string> }
 * 
 * @example
 * validateVariables("Bienvenue [company.name]", { company: { name: "Acme" }})
 * // => { valid: true, missing: [] }
 * 
 * validateVariables("Bienvenue [company.name]", {})
 * // => { valid: false, missing: ["company.name"] }
 */
export const validateVariables = (template, variables) => {
  const required = extractVariables(template);
  const missing = [];
  
  for (const path of required) {
    const keys = path.split('.');
    let value = variables;
    let found = true;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        found = false;
        break;
      }
    }
    
    if (!found || value == null) {
      missing.push(path);
    }
  }
  
  return {
    valid: missing.length === 0,
    missing
  };
};

/**
 * Fonction de test (legacy)
 */
export const test = () => {
  console.log('[CookieConsent Helper] Module chargé');
};

// Export par défaut
export default {
  replaceVariables,
  applyTemplateToTranslations,
  extractVariables,
  validateVariables,
  test
};