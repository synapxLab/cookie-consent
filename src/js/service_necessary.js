/**
 * @synapxlab/cookie-consent - service_necessary
 * Services nécessaires au fonctionnement du site (toujours activés)
 * 
 * ✅ v3.0.0: Nouvelle catégorie pour conformité RGPD
 * Les cookies nécessaires sont indispensables au fonctionnement du site
 * et ne nécessitent pas de consentement explicite
 * 
 * Exemples: Session, CSRF, équilibrage de charge, authentification
 * 
 * @version 3.0.0
 * @author SynapxLab <contact@synapxlab.com>
 * @license MIT
 */

// ——— Loaders "internes" protégés ———
// NOTE: Les services nécessaires sont généralement gérés côté serveur
// ou directement dans le HTML. Ce fichier est principalement documentaire.

const loaders = {
  // Exemple: Si vous avez un système de session custom
  sessionManager: (cfg) => {
    // Ce type de service est généralement déjà chargé
    // avant le cookie consent
    if (cfg.custom_session_handler) {
      // Logique personnalisée ici
    }
  }
};

// ——— Meta pour détection d'URL (bloqueur/observateur) ———
// Les cookies nécessaires ne sont JAMAIS bloqués
// Cette liste est documentaire pour la transparence
const patterns = [
  // Exemples de patterns nécessaires (ne pas bloquer):
  // 'sessionid',
  // 'csrf',
  // '_auth',
  // 'load_balancer'
];

// ——— Liste des services nécessaires (pour affichage) ———
const NECESSARY_SERVICES = [
  'Session utilisateur',
  'Protection CSRF',
  'Équilibrage de charge',
  'Authentification'
];

// ——— API exportée ———
export const service_necessary = {
  /** motifs d'URL (documentaire uniquement, jamais bloqués) */
  patterns,

  /** retourne la liste des services nécessaires configurés */
  getConfigured(cfg) {
    // Pour l'instant, retourne une liste statique
    // À personnaliser selon vos besoins
    return NECESSARY_SERVICES;
  },

  /** 
   * Charge tous les services nécessaires
   * Note: Ces services sont généralement déjà actifs
   * Cette fonction existe pour la cohérence de l'API
   */
  loadAll(cfg) {
    // Les services nécessaires sont généralement déjà chargés
    // avant le cookie consent
    try { 
      loaders.sessionManager(cfg); 
    } catch (e) { 
      console.error('Error loading necessary services:', e); 
    }
  }
};