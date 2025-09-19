# Contribuer à @synapxlab/cookie-consent

Merci de votre intérêt ! Ce projet vise une **bannière cookies RGPD/CNIL**, **sans dépendance**, **accessible (WCAG 2.1 AA)**, légère et facile à intégrer.

> TL;DR : Fork → branche `feat/…` → commits **Conventional Commits** → PR propre (lint + build + demo) → revue.

---

## 📌 Règles d’or

- **Aucune dépendance externe** (pas de jQuery, pas de framework).
- **Accessibilité** prioritaire : navigation clavier, focus visible, ARIA correcte, pas d’éléments interactifs dans `<summary>`.
- **Aucune écriture de cookie/LS** hors consentement explicite.
- **Poids minimal** : garder le bundle **compact** (code clair mais sobre).
- **API stable** : ne pas casser `open/reset/getPreferences/hasConsent` ni l’événement `cookieConsentChanged` sans version majeure.

---

## 🧱 Prérequis & Setup

- **Node.js 18+**, **npm 9+** (ou plus récent).
- Cloner et installer :

```bash
git clone https://github.com/synapxLab/cookie-consent.git
cd cookie-consent
npm install
```

- Lancer en développement :

```bash
npm run dev
```

- Build de production :

```bash
npm run build
```

> Conseillé : activer un **linter** (ESLint) et un **formatter** (Prettier). Si vous proposez une config, faites-le dans une PR dédiée.

---

## 🐞 Bugs & 🔮 Features

### Signaler un bug
Ouvrez une *Issue* avec :
- Version du paquet (`window.CookieConsent.VERSION` = '2.2.0').
- Environnement (navigateur, OS).
- Étapes pour reproduire (idéalement un CodePen/StackBlitz).
- Résultat observé vs attendu, logs éventuels.

### Proposer une fonctionnalité
- Expliquez le **problème** (use‑case), pas seulement la solution.
- Précisez l’**impact** sur l’API publique et l’accessibilité.
- Mentionnez le **coût** (complexité, taille, maintenance).

---

## 🌿 Workflow Git

1. **Fork** puis créez une branche depuis `main` :
   - `feat/<courte-description>`
   - `fix/<courte-description>`
   - `docs/<courte-description>`

2. **Commits** au format **Conventional Commits** :
   - `feat: …`, `fix: …`, `docs: …`, `refactor: …`, `perf: …`, `test: …`, `build: …`, `ci: …`, `chore: …`, `revert: …`
   - Exemple : `feat: add keyboard navigation for category headers`

3. **Tests manuels** :
   - Vérifiez la navigation clavier (Tab/Shift+Tab/Enter/Espace/Escape).
   - Vérifiez que **rien n’est stocké** avant consentement.
   - Vérifiez les événements : `cookieConsentChanged` (`detail: { preferences, action }`).

4. **Build** avant PR :
   - Assurez-vous que `npm run build` passe sans erreur.
   - Mettez à jour **README.md** si l’API/usage change.
   - Mettez à jour **CHANGELOG.md** (section *Unreleased* ou version cible).

5. **Pull Request** :
   - Titre clair (Conventional Commit si possible).
   - Description : *motivation*, *modifs majeures*, *impact API*, *tests faits*.
   - Cochez la checklist ci‑dessous.

**Checklist PR** :
- [ ] Aucune dépendance externe ajoutée
- [ ] Accessibilité revalidée (clavier, ARIA, focus)
- [ ] Pas d’écriture cookie/LS sans consentement
- [ ] README/CHANGELOG mis à jour (si nécessaire)
- [ ] `npm run build` OK
- [ ] Démo/steps de repro fournis (si bug)

---

## 🔐 Sécurité / Disclosure

Si vous pensez avoir trouvé une **faille de sécurité**, **ne** créez **pas** d’issue publique.  
Écrivez à **contact@synapx.fr** avec un maximum de détails (POC, version, environnement).

---

## 📦 Versionnage & Release

- **SemVer** : `MAJEUR.MINOR.PATCH`
- Documenter dans **CHANGELOG.md** (Keep a Changelog).
- Processus standard (mainteneurs) :
  1. Revue & merge → `main`
  2. Bump version (et bannière/version si exposée)
  3. `npm run build`
  4. Tag `vX.Y.Z` + **GitHub Release** (notes)
  5. `npm publish --access public`

---

## 🧩 Style de code (recommandé)

- JavaScript **vanilla** (ES2019+), modules quand pertinent.
- **Nommer** clairement, commenter avec parcimonie (priorité à la lisibilité).
- Éviter `eval`, `with`, API instables.
- Utiliser `addEventListener`, jamais des attributs inline.
- Préserver les **hooks publics** existants :
  - `window.CookieConsent.open(reset?)`
  - `window.CookieConsent.reset()`
  - `window.CookieConsent.getPreferences()`
  - `window.CookieConsent.hasConsent(cat)`
  - `window.CookieConsent.enableLogging(config)` / `disableLogging()` / `getLoggingConfig()`
  - Événement `cookieConsentChanged`

---

## 🌍 Internationalisation

La lib reste *agnostique* côté textes. Si vous proposez i18n :
- Privilégiez une **API de configuration** plutôt que des textes codés en dur.
- Ne pas alourdir le bundle par défaut (lazy‑load possible).

---

## 🤝 Code of Conduct

Ce projet adhère à un comportement professionnel et respectueux.  
En contribuant, vous acceptez d’agir avec bienveillance et courtoisie. (Vous pouvez proposer un `CODE_OF_CONDUCT.md` basé sur le *Contributor Covenant*).

---

Merci 🙌 et bonne contribution !
