import '../scss/cookie.scss';

const STORAGE_KEY = 'politecookiebanner';

const loadPrefs = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || ''); } catch { return null; }
};
const savePrefs = (obj) => localStorage.setItem(STORAGE_KEY, JSON.stringify(obj || {}));

function renderOnce() {
  if (document.getElementById('politecookiebanner')) return;

  const tpl = `
<div id="politecookiebanner" class="pmcpli-cookiebanner pmcpli-show" aria-label="cookiebanner" title="cookiebanner" aria-modal="true" data-nosnippet="true" role="dialog" aria-live="polite" style="display:none;">
  <div class="pmcpli-header">
    <div class="pmcpli-title">Gérer le consentement aux cookies</div>
    <div class="pmcpli-close" tabindex="0" role="button" title="cookiebanner" aria-label="close-cookiebanner" role-js="close">
      <svg aria-hidden="true" focusable="false" viewBox="0 0 352 512" class="pmcpli-close-icon"><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"/></svg>
    </div>
  </div>

  <div class="pmcpli-divider pmcpli-divider-header"></div>

  <div class="pmcpli-body">
    <div class="pmcpli-message" id="pmcpli-message-1-optin">
      Pour vous offrir la meilleure expérience possible, on utilise des cookies (pas les gourmands, hélas) pour garder quelques infos sur votre appareil.
      En acceptant, vous nous aidez à mieux comprendre comment vous naviguez ici. Si vous refusez, certaines fonctionnalités pourraient ne pas marcher aussi bien.
    </div>

    <!-- CACHÉ PAR DÉFAUT : affiché uniquement après clic "Les préférences" -->
    <div class="pmcpli-categories" style="display:none;">
      <details class="pmcpli-category pmcpli-functional">
        <summary>
          <span class="pmcpli-category-header">
            <span class="pmcpli-category-title">Stockage strictement nécessaire</span> Toujours actif
            <span class="pmcpli-icon pmcpli-open">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="18"><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/></svg>
            </span>
          </span>
        </summary>
        <div class="pmcpli-description">
          <span class="pmcpli-description-functional">
            Le stockage ou l'accès aux informations est uniquement utilisé pour des finalités techniques indispensables, telles que :
            <ul>
              <li>le fonctionnement de la navigation ou de l’interface utilisateur,</li>
              <li>la gestion de session (ex : panier, connexion),</li>
              <li>ou la transmission sécurisée des données entre le client et le serveur.</li>
            </ul>
            Aucun appel vers des services tiers de mesure d’audience, de publicité ou de profilage (ex : Google Analytics, Pixel Meta, etc.) n’est effectué dans ce cadre.
          </span>
        </div>
      </details>

      <details class="pmcpli-category pmcpli-statistics">
        <summary>
          <span class="pmcpli-category-header">
            <span class="pmcpli-category-title">Cookies</span>
            <div class="checkbox-wrapper"><input type="checkbox" id="politecookiecheckboxcookies" name="politecookie['cookies']"><label for="politecookiecheckboxcookies"></label></div>
            <span class="pmcpli-icon pmcpli-open">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="18"><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/></svg>
            </span>
          </span>
        </summary>
        <div class="pmcpli-description">
          <span class="pmcpli-description-statistics-anonymous">
            Ces cookies ne sont pas utilisés à des fins publicitaires, mais ils jouent un rôle essentiel dans l’amélioration de votre expérience utilisateur.
            <br>Par exemple :
            <ul>
              <li>Ils permettent de garder votre session active plus de 10 minutes…</li>
              <li>Ils mémorisent vos préférences (langue, affichage, formulaires remplis),</li>
              <li>Ils facilitent certaines fonctionnalités comme le panier d’achat ou la navigation entre pages.</li>
            </ul>
            Ces cookies peuvent être désactivés, mais certaines fonctionnalités risquent alors de ne pas fonctionner correctement.
          </span>
        </div>
      </details>

      <details class="pmcpli-category pmcpli-statistics">
        <summary>
          <span class="pmcpli-category-header">
            <span class="pmcpli-category-title">Statistiques</span>
            <div class="checkbox-wrapper"><input type="checkbox" id="politecookiecheckboxstatistics" name="politecookie['statistics']"><label for="politecookiecheckboxstatistics"></label></div>
            <span class="pmcpli-icon pmcpli-open">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="18"><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/></svg>
            </span>
          </span>
        </summary>
        <div class="pmcpli-description">
          <span class="pmcpli-description-statistics-anonymous">
            Le stockage ou l'accès technique est utilisé exclusivement à des fins statistiques…
          </span><br>
          <ul>
            <li>Google Analytics…</li>
            <li>Google AdSense (composante analytique)…</li>
          </ul>
          Ces données sont agrégées… Vous pouvez les refuser à tout moment.
        </div>
      </details>

      <details class="pmcpli-category pmcpli-marketing">
        <summary>
          <span class="pmcpli-category-header">
            <span class="pmcpli-category-title">Marketing</span>
            <div class="checkbox-wrapper"><input type="checkbox" id="politecookiecheckboxmarketing" name="politecookie['marketing']"><label for="politecookiecheckboxmarketing"></label></div>
            <span class="pmcpli-icon pmcpli-open">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height="18"><path d="M224 416c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L224 338.8l169.4-169.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-192 192C240.4 412.9 232.2 416 224 416z"/></svg>
            </span>
          </span>
        </summary>
        <div class="pmcpli-description">
          <span class="pmcpli-description-marketing">
            Le stockage ou l'accès technique est nécessaire pour créer des profils d'utilisateurs afin d'envoyer de la publicité
            ou pour suivre l'utilisateur sur un site Web ou sur plusieurs sites Web à des fins de marketing similaires.
          </span>
        </div>
      </details>
    </div>
  </div>

  <div class="pmcpli-links pmcpli-information p-2"></div>
  <div class="pmcpli-divider pmcpli-footer"></div>
  <div class="pmcpli-buttons">
    <button class="pmcpli-btn pmcpli-accept">Accepter</button>
    <button class="pmcpli-btn pmcpli-deny">Refuser</button>
    <button class="pmcpli-btn pmcpli-view-preferences">Les préférences</button>
    <button class="pmcpli-btn pmcpli-save-preferences">Enregistrer</button>
  </div>
  <div class="pmcpli-links pmcpli-documents"></div>
</div>`;
  document.body.insertAdjacentHTML('beforeend', tpl);
}

function openBanner(showPrefs = false) {
  renderOnce();
  const el = document.getElementById('politecookiebanner');
  if (!el) return;
  el.style.display = 'block';
  const cats = el.querySelector('.pmcpli-categories');
  // cats.style.display = showPrefs ? 'block' : 'none'; // uniquement si demandé
}

function attachHandlers() {
  const el = document.getElementById('politecookiebanner');
  if (!el) return;

  // Restaure états si déjà enregistrés
  const stored = loadPrefs();
  if (stored) {
    el.querySelectorAll('input[name^="politecookie["]').forEach(cb => {
      const m = cb.name.match(/^politecookie\['(.+)'\]$/);
      if (m) cb.checked = !!stored[m[1]];
    });
  } else {
    el.style.display = 'block';             // montre la bannière
    el.querySelector('.pmcpli-categories').style.display = 'none'; // cache préférences
  }

  const save = () => {
    const prefs = {};
    el.querySelectorAll('input[name^="politecookie["]').forEach(cb => {
      const m = cb.name.match(/^politecookie\['(.+)'\]$/);
      if (m) prefs[m[1]] = cb.checked;
    });
    savePrefs(prefs);
    el.style.display = 'none';
  };

  // Boutons
  el.querySelector('.pmcpli-close')?.addEventListener('click', () => el.style.display = 'none');
  el.querySelector('.pmcpli-accept')?.addEventListener('click', () => {
    el.querySelectorAll('input[name^="politecookie["]').forEach(cb => cb.checked = true);
    save();
  });
  el.querySelector('.pmcpli-deny')?.addEventListener('click', () => {
    el.querySelectorAll('input[name^="politecookie["]').forEach(cb => cb.checked = false);
    save();
  });
  el.querySelector('.pmcpli-view-preferences')?.addEventListener('click', () => {
    const cats = el.querySelector('.pmcpli-categories');
    cats.style.display = cats.style.display === 'block' ? 'none' : 'block';
    // cats.style.display = (cats.style.display === 'none' || !cats.style.display) ? 'block' : 'none';
  });
  el.querySelector('.pmcpli-save-preferences')?.addEventListener('click', save);

  // Lien site
  document.addEventListener('click', (e) => {
    const t = e.target.closest('#openpolitecookie, #openpolitecookie a');
    if (!t) return;
    e.preventDefault();
    openBanner(true); // ouvre directement avec préférences visibles
  });
}




// // API globale si besoin
// window.CookieConsent = {
//   open: (showPrefs=false) => openBanner(showPrefs),
//   reset: () => { localStorage.removeItem(STORAGE_KEY); openBanner(true); }
// };

document.addEventListener('DOMContentLoaded', () => {
  renderOnce();
  attachHandlers();
});
