const cookieBannerTemplate = `
<div 
  id="cookie-consent-banner" 
  class="cookie-banner cookie-banner--visible" 
  aria-label="Gestion du consentement aux cookies" 
  aria-modal="true" 
  data-nosnippet="true" 
  role="dialog" 
  aria-live="polite" 
  style="display: none;"
>
  <!-- En-tête de la bannière -->
  <header class="cookie-banner__header">
    <h2 class="cookie-banner__title">Gestion du consentement aux cookies</h2>
    <button 
      class="cookie-banner__close" 
      type="button"
      aria-label="Fermer la bannière de cookies"
      data-action="close"
    >
      <svg 
        aria-hidden="true" 
        focusable="false" 
        viewBox="0 0 24 24" 
        class="cookie-banner__close-icon"
      >
        <path 
          fill="currentColor" 
          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
        />
      </svg>
    </button>
  </header>

  <!-- Contenu principal -->
  <main class="cookie-banner__body">
    <p class="cookie-banner__message">
      Pour vous offrir la meilleure expérience possible, nous utilisons des cookies 
      pour analyser l'utilisation du site et personnaliser le contenu. En acceptant, 
      vous nous aidez à améliorer nos services. Vous pouvez personnaliser vos préférences 
      à tout moment.
    </p>

    <!-- Catégories de cookies (masquées par défaut) -->
    <div class="cookie-banner__categories" style="display: none;">
      
      <!-- Cookies strictement nécessaires -->
      <section class="cookie-category cookie-category--essential">
        <div class="cookie-category__header">
          <button 
            class="cookie-category__toggle" 
            type="button"
            aria-expanded="false"
            aria-controls="essential-cookies-details"
          >
            <span class="cookie-category__title">Cookies strictement nécessaires</span>
            <span class="cookie-category__status">Toujours actifs</span>
            <svg 
              class="cookie-category__icon" 
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
          </button>
        </div>
        <div 
          id="essential-cookies-details" 
          class="cookie-category__content"
          aria-hidden="true"
        >
          <p class="cookie-category__description">
            Ces cookies sont indispensables au fonctionnement du site web et 
            ne peuvent pas être désactivés dans nos systèmes.
          </p>
        </div>
      </section>

      <!-- Cookies fonctionnels -->
      <section class="cookie-category cookie-category--functional">
        <div class="cookie-category__header">
          <button 
            class="cookie-category__toggle" 
            type="button"
            aria-expanded="false"
            aria-controls="functional-cookies-details"
          >
            <span class="cookie-category__title">Cookies fonctionnels</span>
            <svg 
              class="cookie-category__icon" 
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
          </button>
          <div class="cookie-category__control">
            <input 
              type="checkbox" 
              id="functional-cookies-checkbox" 
              name="cookie-preferences[functional]"
              class="cookie-category__checkbox"
            >
            <label 
              for="functional-cookies-checkbox" 
              class="cookie-category__label"
              aria-label="Activer les cookies fonctionnels"
            ></label>
          </div>
        </div>
        <div 
          id="functional-cookies-details" 
          class="cookie-category__content"
          aria-hidden="true"
        >
          <p class="cookie-category__description">
            Ces cookies permettent d'améliorer les fonctionnalités du site web et 
            la personnalisation, mais ne sont pas utilisés à des fins publicitaires.
          </p>
        </div>
      </section>

      <!-- Cookies statistiques -->
      <section class="cookie-category cookie-category--analytics">
        <div class="cookie-category__header">
          <button 
            class="cookie-category__toggle" 
            type="button"
            aria-expanded="false"
            aria-controls="analytics-cookies-details"
          >
            <span class="cookie-category__title">Cookies analytiques</span>
            <svg 
              class="cookie-category__icon" 
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
          </button>
          <div class="cookie-category__control">
            <input 
              type="checkbox" 
              id="analytics-cookies-checkbox" 
              name="cookie-preferences[analytics]"
              class="cookie-category__checkbox"
            >
            <label 
              for="analytics-cookies-checkbox" 
              class="cookie-category__label"
              aria-label="Activer les cookies analytiques"
            ></label>
          </div>
        </div>
        <div 
          id="analytics-cookies-details" 
          class="cookie-category__content"
          aria-hidden="true"
        >
          <p class="cookie-category__description">
            Ces cookies nous permettent de mesurer et d'analyser la fréquentation 
            du site web afin de l'améliorer.
          </p>
        </div>
      </section>

      <!-- Cookies marketing -->
      <section class="cookie-category cookie-category--marketing">
        <div class="cookie-category__header">
          <button 
            class="cookie-category__toggle" 
            type="button"
            aria-expanded="false"
            aria-controls="marketing-cookies-details"
          >
            <span class="cookie-category__title">Cookies marketing</span>
            <svg 
              class="cookie-category__icon" 
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
            </svg>
          </button>
          <div class="cookie-category__control">
            <input 
              type="checkbox" 
              id="marketing-cookies-checkbox" 
              name="cookie-preferences[marketing]"
              class="cookie-category__checkbox"
            >
            <label 
              for="marketing-cookies-checkbox" 
              class="cookie-category__label"
              aria-label="Activer les cookies marketing"
            ></label>
          </div>
        </div>
        <div 
          id="marketing-cookies-details" 
          class="cookie-category__content"
          aria-hidden="true"
        >
          <p class="cookie-category__description">
            Ces cookies sont utilisés pour personnaliser les publicités en fonction 
            de vos centres d'intérêt et mesurer l'efficacité des campagnes publicitaires.
          </p>
        </div>
      </section>

    </div>
  </main>

  <!-- Section liens informatifs -->
  <div class="cookie-banner__info-links"></div>

  <!-- Actions principales -->
  <footer class="cookie-banner__actions">
    <button 
      class="cookie-banner__button cookie-banner__button--accept" 
      type="button"
      data-action="accept-all"
    >
      Tout accepter
    </button>
    
    <button 
      class="cookie-banner__button cookie-banner__button--deny" 
      type="button"
      data-action="deny-all"
    >
      Tout refuser
    </button>
    
    <button 
      class="cookie-banner__button cookie-banner__button--preferences" 
      type="button"
      data-action="show-preferences"
    >
      Personnaliser
    </button>
    
    <button 
      class="cookie-banner__button cookie-banner__button--save" 
      type="button"
      data-action="save-preferences"
      style="display: none;"
    >
      Enregistrer les préférences
    </button>
    
    <button 
      class="cookie-banner__button cookie-banner__button--reset" 
      type="button"
      data-action="reset-preferences"
      style="display: none;"
    >
      Réinitialiser
    </button>
  </footer>

  <!-- Section liens documentaires -->
  <div class="cookie-banner__legal-links"></div>
</div>`;

// Classe pour gérer la bannière de cookies
class CookieBannerManager {
  constructor() {
    this.banner = null;
    this.isInitialized = false;
    this.preferences = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false
    };
    
    this.init();
  }

  init() {
    if (this.isInitialized) return;
    
    // Injecter le HTML
    document.body.insertAdjacentHTML('beforeend', cookieBannerTemplate);
    this.banner = document.getElementById('cookie-consent-banner');
    
    // Attacher les événements
    this.attachEvents();
    
    // Charger les préférences sauvegardées
    this.loadSavedPreferences();
    
    this.isInitialized = true;
  }

  attachEvents() {
    if (!this.banner) return;

    // Gestion des boutons principaux
    this.banner.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      
      switch (action) {
        case 'close':
          this.hideBanner();
          break;
        case 'accept-all':
          this.acceptAll();
          break;
        case 'deny-all':
          this.denyAll();
          break;
        case 'show-preferences':
          this.showPreferences();
          break;
        case 'save-preferences':
          this.savePreferences();
          break;
        case 'reset-preferences':
          this.resetPreferences();
          break;
      }
    });

    // Gestion des catégories extensibles
    this.banner.querySelectorAll('.cookie-category__toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        this.toggleCategory(e.target.closest('.cookie-category'));
      });
    });

    // Gestion du clavier
    this.banner.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideBanner();
      }
    });
  }

  toggleCategory(categoryElement) {
    const toggle = categoryElement.querySelector('.cookie-category__toggle');
    const content = categoryElement.querySelector('.cookie-category__content');
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

    toggle.setAttribute('aria-expanded', !isExpanded);
    content.setAttribute('aria-hidden', isExpanded);
    categoryElement.classList.toggle('cookie-category--expanded', !isExpanded);
  }

  showBanner() {
    if (this.banner) {
      this.banner.style.display = 'block';
      // Focus sur le premier élément interactif
      setTimeout(() => {
        const firstButton = this.banner.querySelector('button');
        if (firstButton) firstButton.focus();
      }, 100);
    }
  }

  hideBanner() {
    if (this.banner) {
      this.banner.style.display = 'none';
    }
  }

  showPreferences() {
    const categoriesSection = this.banner.querySelector('.cookie-banner__categories');
    const saveButton = this.banner.querySelector('[data-action="save-preferences"]');
    const resetButton = this.banner.querySelector('[data-action="reset-preferences"]');
    const preferencesButton = this.banner.querySelector('[data-action="show-preferences"]');

    if (categoriesSection) {
      categoriesSection.style.display = 'block';
      saveButton.style.display = 'inline-block';
      resetButton.style.display = 'inline-block';
      preferencesButton.style.display = 'none';
    }
  }

  acceptAll() {
    this.preferences = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true
    };
    this.saveToStorage();
    this.hideBanner();
    this.triggerConsentEvent('accept-all');
  }

  denyAll() {
    this.preferences = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false
    };
    this.saveToStorage();
    this.hideBanner();
    this.triggerConsentEvent('deny-all');
  }

  savePreferences() {
    // Récupérer les valeurs des checkboxes
    const checkboxes = this.banner.querySelectorAll('.cookie-category__checkbox');
    
    checkboxes.forEach(checkbox => {
      const category = checkbox.name.match(/\[(\w+)\]/)?.[1];
      if (category && category !== 'essential') {
        this.preferences[category] = checkbox.checked;
      }
    });

    this.saveToStorage();
    this.hideBanner();
    this.triggerConsentEvent('custom');
  }

  resetPreferences() {
    this.preferences = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false
    };
    this.updateCheckboxes();
  }

  updateCheckboxes() {
    Object.keys(this.preferences).forEach(category => {
      if (category !== 'essential') {
        const checkbox = this.banner.querySelector(`[name="cookie-preferences[${category}]"]`);
        if (checkbox) {
          checkbox.checked = this.preferences[category];
        }
      }
    });
  }

  saveToStorage() {
    try {
      localStorage.setItem('cookie-preferences', JSON.stringify({
        ...this.preferences,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('Impossible de sauvegarder les préférences cookies:', e);
    }
  }

  loadSavedPreferences() {
    try {
      const saved = localStorage.getItem('cookie-preferences');
      if (saved) {
        const data = JSON.parse(saved);
        this.preferences = { ...this.preferences, ...data };
        this.updateCheckboxes();
        return true;
      }
    } catch (e) {
      console.warn('Impossible de charger les préférences cookies:', e);
    }
    return false;
  }

  triggerConsentEvent(type) {
    const event = new CustomEvent('cookieConsent', {
      detail: {
        type,
        preferences: this.preferences,
        timestamp: Date.now()
      }
    });
    document.dispatchEvent(event);
  }

  // API publique
  getPreferences() {
    return { ...this.preferences };
  }

  hasConsent(category) {
    return this.preferences[category] === true;
  }

  show() {
    this.showBanner();
  }

  reset() {
    localStorage.removeItem('cookie-preferences');
    this.preferences = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false
    };
    this.updateCheckboxes();
  }
}

// Export pour utilisation
const cookieManager = new CookieBannerManager();

// Vérifier si l'utilisateur doit voir la bannière
document.addEventListener('DOMContentLoaded', () => {
  if (!cookieManager.loadSavedPreferences()) {
    cookieManager.show();
  }
});

// API globale pour interaction externe
window.CookieManager = cookieManager;  // 48303