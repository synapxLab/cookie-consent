// --- I18N ---------------------------------------------------------

const DICT = {
  fr: {
    title: "Gérer le consentement aux cookies",
    message: "Pour vous offrir la meilleure expérience possible, on utilise des cookies (pas les gourmands, hélas) pour garder quelques infos sur votre appareil. En acceptant, vous nous aidez à mieux comprendre comment vous naviguez ici. Si vous refusez, certaines fonctionnalités pourraient ne pas marcher aussi bien.",
    closeAria: "Fermer la bannière cookies",
    alwaysActive: "Toujours actif",
    functionalTitle: "Stockage strictement nécessaire",
    functionalDesc: "Le stockage ou l'accès aux informations est uniquement utilisé pour des finalités techniques indispensables.",
    cookiesTitle: "Cookies",
    cookiesDesc: "Ces cookies ne sont pas utilisés à des fins publicitaires, mais ils jouent un rôle essentiel dans l'amélioration de votre expérience utilisateur.",
    statsTitle: "Statistiques",
    statsDesc: "Le stockage ou l'accès technique est utilisé exclusivement à des fins statistiques.",
    statsServices: "Services : {services}",
    marketingTitle: "Marketing",
    marketingDesc: "Le stockage ou l'accès technique est nécessaire pour créer des profils d'utilisateurs afin d'envoyer de la publicité.",
    marketingServices: "Services : {services}",
    acceptAll: "Tout Accepter",
    denyAll: "Refuser",
    viewPrefs: "Les préférences",
    savePrefs: "Enregistrer",
    delPrefs: "Supprimer"
  },
  en: {
    title: "Manage cookie consent",
    message: "To give you the best experience, we use cookies to store some information on your device. Accepting helps us understand how you use the site. If you refuse, some features may not work as well.",
    closeAria: "Close cookie banner",
    alwaysActive: "Always active",
    functionalTitle: "Strictly necessary storage",
    functionalDesc: "Storage or access strictly required for essential technical purposes.",
    cookiesTitle: "Cookies",
    cookiesDesc: "These cookies are not used for advertising but help improve your experience.",
    statsTitle: "Statistics",
    statsDesc: "Storage or access used exclusively for statistical purposes.",
    statsServices: "Services: {services}",
    marketingTitle: "Marketing",
    marketingDesc: "Storage or access required to build user profiles for advertising.",
    marketingServices: "Services: {services}",
    acceptAll: "Accept all",
    denyAll: "Deny",
    viewPrefs: "Preferences",
    savePrefs: "Save",
    delPrefs: "Delete"
  },
  es: {
    title: "Gestionar el consentimiento de cookies",
    message: "Para ofrecerte la mejor experiencia, usamos cookies para guardar información en tu dispositivo. Si aceptas, nos ayudas a mejorar el sitio. Si rechazas, algunas funciones podrían no funcionar tan bien.",
    closeAria: "Cerrar el banner de cookies",
    alwaysActive: "Siempre activo",
    functionalTitle: "Almacenamiento estrictamente necesario",
    functionalDesc: "Almacenamiento o acceso utilizado solo para fines técnicos indispensables.",
    cookiesTitle: "Cookies",
    cookiesDesc: "Estas cookies no se usan con fines publicitarios, pero mejoran tu experiencia.",
    statsTitle: "Estadísticas",
    statsDesc: "Almacenamiento o acceso utilizado exclusivamente con fines estadísticos.",
    statsServices: "Servicios: {services}",
    marketingTitle: "Marketing",
    marketingDesc: "Almacenamiento o acceso necesario para crear perfiles publicitarios.",
    marketingServices: "Servicios: {services}",
    acceptAll: "Aceptar todo",
    denyAll: "Rechazar",
    viewPrefs: "Preferencias",
    savePrefs: "Guardar",
    delPrefs: "Eliminar"
  },
  de: {
    title: "Cookie-Einwilligung verwalten",
    message: "Für das beste Erlebnis verwenden wir Cookies, um einige Informationen auf Ihrem Gerät zu speichern. Durch das Akzeptieren helfen Sie uns, die Nutzung zu verstehen. Bei Ablehnung funktionieren manche Features ggf. schlechter.",
    closeAria: "Cookie-Banner schließen",
    alwaysActive: "Immer aktiv",
    functionalTitle: "Strikt erforderlicher Speicher",
    functionalDesc: "Speicherung oder Zugriff ausschließlich für technisch notwendige Zwecke.",
    cookiesTitle: "Cookies",
    cookiesDesc: "Diese Cookies dienen nicht der Werbung, verbessern aber Ihre Erfahrung.",
    statsTitle: "Statistiken",
    statsDesc: "Speicherung oder Zugriff ausschließlich für statistische Zwecke.",
    statsServices: "Dienste: {services}",
    marketingTitle: "Marketing",
    marketingDesc: "Speicherung/ Zugriff zur Erstellung von Werbeprofilen.",
    marketingServices: "Dienste: {services}",
    acceptAll: "Alle akzeptieren",
    denyAll: "Ablehnen",
    viewPrefs: "Einstellungen",
    savePrefs: "Speichern",
    delPrefs: "Löschen"
  },
  it: {
    title: "Gestisci il consenso ai cookie",
    message: "Per offrirti la migliore esperienza possibile, utilizziamo i cookie per memorizzare alcune informazioni sul tuo dispositivo. Accettando, ci aiuti a capire meglio come navighi qui. Se rifiuti, alcune funzionalità potrebbero non funzionare altrettanto bene.",
    closeAria: "Chiudi il banner dei cookie",
    alwaysActive: "Sempre attivo",
    functionalTitle: "Archiviazione strettamente necessaria",
    functionalDesc: "L'archiviazione o l'accesso alle informazioni è utilizzato esclusivamente per finalità tecniche indispensabili.",
    cookiesTitle: "Cookie",
    cookiesDesc: "Questi cookie non sono utilizzati per scopi pubblicitari, ma svolgono un ruolo essenziale nel migliorare la tua esperienza utente.",
    statsTitle: "Statistiche",
    statsDesc: "L'archiviazione o l'accesso tecnico è utilizzato esclusivamente per scopi statistici.",
    statsServices: "Servizi: {services}",
    marketingTitle: "Marketing",
    marketingDesc: "L'archiviazione o l'accesso tecnico è necessario per creare profili utente al fine di inviare pubblicità.",
    marketingServices: "Servizi: {services}",
    acceptAll: "Accetta tutto",
    denyAll: "Rifiuta",
    viewPrefs: "Preferenze",
    savePrefs: "Salva",
    delPrefs: "Elimina"
  },
  nl: {
    title: "Cookietoestemming beheren",
    message: "Voor de beste ervaring gebruiken we cookies om informatie op je apparaat op te slaan. Door te accepteren help je ons te begrijpen hoe je hier navigeert. Als je weigert, werken sommige functies mogelijk minder goed.",
    closeAria: "Cookiebanner sluiten",
    alwaysActive: "Altijd actief",
    functionalTitle: "Strikt noodzakelijke opslag",
    functionalDesc: "Opslag of toegang tot informatie wordt uitsluitend gebruikt voor onmisbare technische doeleinden.",
    cookiesTitle: "Cookies",
    cookiesDesc: "Deze cookies worden niet gebruikt voor reclamedoeleinden, maar spelen een essentiële rol bij het verbeteren van je gebruikerservaring.",
    statsTitle: "Statistieken",
    statsDesc: "Opslag of technische toegang wordt uitsluitend gebruikt voor statistische doeleinden.",
    statsServices: "Diensten: {services}",
    marketingTitle: "Marketing",
    marketingDesc: "Opslag of technische toegang is noodzakelijk om gebruikersprofielen te creëren voor het versturen van advertenties.",
    marketingServices: "Diensten: {services}",
    acceptAll: "Alles accepteren",
    denyAll: "Weigeren",
    viewPrefs: "Voorkeuren",
    savePrefs: "Opslaan",
    delPrefs: "Verwijderen"
  },
  pt: {
    title: "Gerir o consentimento de cookies",
    message: "Para lhe oferecer a melhor experiência possível, utilizamos cookies para guardar algumas informações no seu dispositivo. Ao aceitar, ajuda-nos a compreender melhor como navega aqui. Se recusar, algumas funcionalidades podem não funcionar tão bem.",
    closeAria: "Fechar o banner de cookies",
    alwaysActive: "Sempre ativo",
    functionalTitle: "Armazenamento estritamente necessário",
    functionalDesc: "O armazenamento ou acesso à informação é utilizado exclusivamente para finalidades técnicas indispensáveis.",
    cookiesTitle: "Cookies",
    cookiesDesc: "Estes cookies não são utilizados para fins publicitários, mas desempenham um papel essencial na melhoria da sua experiência de utilizador.",
    statsTitle: "Estatísticas",
    statsDesc: "O armazenamento ou acesso técnico é utilizado exclusivamente para fins estatísticos.",
    statsServices: "Serviços: {services}",
    marketingTitle: "Marketing",
    marketingDesc: "O armazenamento ou acesso técnico é necessário para criar perfis de utilizador para enviar publicidade.",
    marketingServices: "Serviços: {services}",
    acceptAll: "Aceitar tudo",
    denyAll: "Recusar",
    viewPrefs: "Preferências",
    savePrefs: "Guardar",
    delPrefs: "Eliminar"
  }
};

let locale = null;
const detect = () => {
  if (locale) return locale;
  const raw  = (navigator.language || 'fr-FR').toLowerCase();
  const base = raw.split('-')[0];
  locale = DICT[raw] ? raw : (DICT[base] ? base : 'fr');
  return locale;
};

// interpolation basique: t('hello', {name:'Bob'}) => "Hello Bob"
const interpolate = (s, params) =>
  s && params ? s.replace(/\{(\w+)\}/g, (_, k) => (params[k] ?? `{${k}}`)) : s;

function t(key, params) {
  const l = detect();
  const dict = DICT[l] || DICT.fr;
  return interpolate(dict[key] ?? DICT.fr[key] ?? key, params);
}

// méthodes statiques
t.setLocale = (l) => { locale = l?.toLowerCase() || null; };
t.getLocale = () => detect();
t.add = (l, entries) => { DICT[l] = { ...(DICT[l]||{}), ...entries }; };
t.dict = DICT;

export default t;