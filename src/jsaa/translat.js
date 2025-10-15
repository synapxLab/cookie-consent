// --- I18N ---------------------------------------------------------

const DICT = {
  fr: {
    title: "Gérer le consentement aux cookies",
    message: "Pour vous offrir la meilleure expérience possible, nous utilisons des cookies pour stocker certaines informations sur votre appareil. En acceptant, vous nous aidez à améliorer nos services et à mieux comprendre comment vous naviguez sur notre site. Si vous refusez, certaines fonctionnalités pourraient ne pas fonctionner de manière optimale.",
    closeAria: "Fermer la bannière cookies",
    alwaysActive: "Toujours actif",
    functionalTitle: "Cookies strictement nécessaires",
    functionalDesc: "Ces cookies sont nécessaires au fonctionnement du site et ne peuvent pas être désactivés dans nos systèmes. Ils sont généralement établis en réponse à des actions que vous avez effectuées, telles que la définition de vos préférences de confidentialité, la connexion ou le remplissage de formulaires. Ils permettent de sécuriser votre navigation et de gérer votre session. Ces cookies ne collectent aucune information permettant de vous identifier personnellement.",
    cookiesTitle: "Cookies de fonctionnalité",
    cookiesDesc: "Ces cookies permettent d'améliorer et de personnaliser les fonctionnalités du site. Ils peuvent être activés par nos équipes ou par des tiers dont les services sont utilisés sur notre site. Si vous n'acceptez pas ces cookies, certains services risquent de ne pas fonctionner correctement.",
    statsTitle: "Cookies de mesure d'audience (statistiques)",
    statsDesc: "Ces cookies nous permettent de mesurer l'audience du site, de réaliser des statistiques de visite et d'analyser son utilisation (pages visitées, parcours de navigation) afin d'en améliorer les performances et la qualité de nos services. Les données collectées sont agrégées et anonymisées, et ne permettent pas de vous identifier personnellement. Le refus de ces cookies n'a pas d'impact sur votre utilisation du site.",
    statsServices: "Services : {services}",
    marketingTitle: "Cookies publicitaires et de personnalisation",
    marketingDesc: "Ces cookies permettent de personnaliser les publicités affichées en fonction de vos centres d'intérêt observés lors de votre navigation sur notre site. Ils peuvent également être utilisés pour mesurer l'efficacité de nos campagnes publicitaires, vous proposer des contenus pertinents et limiter le nombre de fois qu'une publicité vous est présentée. Le refus de ces cookies n'empêche pas la navigation sur notre site, mais les publicités affichées seront moins adaptées à vos préférences.",
    marketingServices: "Services : {services}",
    loggingTitle: "📋 Preuve de consentement aux cookies",
    loggingNotice: "Conformément à nos obligations légales (article 7.1 du RGPD) et aux recommandations de la CNIL, nous conservons une trace de vos préférences de consentement (cookies de fonctionnalité, statistiques, publicité), la version du bandeau présenté et un identifiant technique d'événement (UUID). Afin de limiter le traitement de données personnelles, votre adresse IP et les informations relatives à votre navigateur sont transformées en empreintes <strong>pseudonymisées</strong> par un processus de hachage irréversible avec secret serveur. Ces journaux de consentement sont <strong>conservés pour une durée maximale de 13 mois</strong>, exclusivement à des fins de preuve du recueil de votre consentement. Vous pouvez modifier vos choix à tout moment en cliquant sur le lien \"Gérer mes cookies\" accessible en bas de page.",
    acceptAll: "Tout Accepter",
    denyAll: "Tout Refuser",
    viewPrefs: "Personnaliser mes choix",
    savePrefs: "Enregistrer mes préférences",
    delPrefs: "Supprimer mes préférences"
  },
  en: {
    title: "Manage cookie consent",
    message: "To provide you with the best possible experience, we use cookies to store certain information on your device. By accepting, you help us improve our services and better understand how you navigate our site. If you refuse, some features may not work optimally.",
    closeAria: "Close cookie banner",
    alwaysActive: "Always active",
    functionalTitle: "Strictly necessary cookies",
    functionalDesc: "These cookies are necessary for the website to function and cannot be disabled in our systems. They are usually set in response to actions you have taken, such as setting your privacy preferences, logging in, or filling out forms. They help secure your browsing and manage your session. These cookies do not collect any personally identifiable information.",
    cookiesTitle: "Functional cookies",
    cookiesDesc: "These cookies enable improved and personalized site functionality. They may be set by our teams or by third parties whose services are used on our site. If you do not accept these cookies, some services may not function properly.",
    statsTitle: "Analytics cookies (statistics)",
    statsDesc: "These cookies allow us to measure site traffic, compile visit statistics, and analyze usage (pages visited, navigation paths) to improve performance and service quality. Collected data is aggregated and anonymized, and does not personally identify you. Refusing these cookies does not impact your site usage.",
    statsServices: "Services: {services}",
    marketingTitle: "Advertising and personalization cookies",
    marketingDesc: "These cookies personalize displayed advertisements based on your interests observed during your navigation on our site. They may also be used to measure the effectiveness of our advertising campaigns, offer relevant content, and limit how many times an ad is shown to you. Refusing these cookies does not prevent site navigation, but displayed advertisements will be less tailored to your preferences.",
    marketingServices: "Services: {services}",
    loggingTitle: "📋 Cookie consent proof",
    loggingNotice: "In accordance with our legal obligations (GDPR Article 7.1) and CNIL recommendations, we maintain a record of your consent preferences (functional, statistics, advertising cookies), the banner version presented, and a technical event identifier (UUID). To limit personal data processing, your IP address and browser information are transformed into <strong>pseudonymized</strong> fingerprints through an irreversible hashing process with server secret. These consent logs are <strong>retained for a maximum of 13 months</strong>, exclusively for proof of consent collection purposes. You can modify your choices at any time by clicking the \"Manage cookies\" link available at the bottom of the page.",
    acceptAll: "Accept all",
    denyAll: "Deny all",
    viewPrefs: "Customize preferences",
    savePrefs: "Save preferences",
    delPrefs: "Delete preferences"
  },
  es: {
    title: "Gestionar el consentimiento de cookies",
    message: "Para ofrecerte la mejor experiencia posible, utilizamos cookies para almacenar cierta información en tu dispositivo. Al aceptar, nos ayudas a mejorar nuestros servicios y a comprender mejor cómo navegas por nuestro sitio. Si rechazas, algunas funcionalidades podrían no funcionar de manera óptima.",
    closeAria: "Cerrar el banner de cookies",
    alwaysActive: "Siempre activo",
    functionalTitle: "Cookies estrictamente necesarias",
    functionalDesc: "Estas cookies son necesarias para el funcionamiento del sitio web y no se pueden desactivar en nuestros sistemas. Generalmente se establecen en respuesta a acciones que has realizado, como establecer tus preferencias de privacidad, iniciar sesión o rellenar formularios. Ayudan a proteger tu navegación y gestionar tu sesión. Estas cookies no recopilan información que permita identificarte personalmente.",
    cookiesTitle: "Cookies de funcionalidad",
    cookiesDesc: "Estas cookies permiten mejorar y personalizar las funcionalidades del sitio. Pueden ser activadas por nuestros equipos o por terceros cuyos servicios se utilizan en nuestro sitio. Si no aceptas estas cookies, algunos servicios podrían no funcionar correctamente.",
    statsTitle: "Cookies de medición de audiencia (estadísticas)",
    statsDesc: "Estas cookies nos permiten medir la audiencia del sitio, realizar estadísticas de visita y analizar su uso (páginas visitadas, rutas de navegación) para mejorar el rendimiento y la calidad de nuestros servicios. Los datos recopilados se agregan y anonimizan, y no permiten identificarte personalmente. El rechazo de estas cookies no afecta tu uso del sitio.",
    statsServices: "Servicios: {services}",
    marketingTitle: "Cookies publicitarias y de personalización",
    marketingDesc: "Estas cookies permiten personalizar los anuncios mostrados según tus intereses observados durante tu navegación por nuestro sitio. También pueden utilizarse para medir la eficacia de nuestras campañas publicitarias, ofrecerte contenido relevante y limitar el número de veces que se te muestra un anuncio. Rechazar estas cookies no impide la navegación en nuestro sitio, pero los anuncios mostrados estarán menos adaptados a tus preferencias.",
    marketingServices: "Servicios: {services}",
    loggingTitle: "📋 Prueba de consentimiento de cookies",
    loggingNotice: "De conformidad con nuestras obligaciones legales (artículo 7.1 del RGPD) y las recomendaciones de la CNIL, conservamos un registro de tus preferencias de consentimiento (cookies funcionales, estadísticas, publicitarias), la versión del banner presentado y un identificador técnico de evento (UUID). Para limitar el tratamiento de datos personales, tu dirección IP y la información de tu navegador se transforman en huellas <strong>seudonimizadas</strong> mediante un proceso de hash irreversible con secreto del servidor. Estos registros de consentimiento se <strong>conservan durante un máximo de 13 meses</strong>, exclusivamente con fines de prueba de la recogida de tu consentimiento. Puedes modificar tus opciones en cualquier momento haciendo clic en el enlace \"Gestionar cookies\" disponible al pie de la página.",
    acceptAll: "Aceptar todo",
    denyAll: "Rechazar todo",
    viewPrefs: "Personalizar mis opciones",
    savePrefs: "Guardar mis preferencias",
    delPrefs: "Eliminar mis preferencias"
  },
  de: {
    title: "Cookie-Einwilligung verwalten",
    message: "Um Ihnen das bestmögliche Erlebnis zu bieten, verwenden wir Cookies, um bestimmte Informationen auf Ihrem Gerät zu speichern. Durch das Akzeptieren helfen Sie uns, unsere Dienste zu verbessern und besser zu verstehen, wie Sie auf unserer Website navigieren. Bei Ablehnung funktionieren einige Funktionen möglicherweise nicht optimal.",
    closeAria: "Cookie-Banner schließen",
    alwaysActive: "Immer aktiv",
    functionalTitle: "Strikt erforderliche Cookies",
    functionalDesc: "Diese Cookies sind für die Funktion der Website erforderlich und können in unseren Systemen nicht deaktiviert werden. Sie werden normalerweise als Reaktion auf von Ihnen durchgeführte Aktionen gesetzt, wie z.B. das Festlegen Ihrer Datenschutzeinstellungen, das Anmelden oder das Ausfüllen von Formularen. Sie helfen, Ihr Surfen zu sichern und Ihre Sitzung zu verwalten. Diese Cookies sammeln keine persönlich identifizierbaren Informationen.",
    cookiesTitle: "Funktionale Cookies",
    cookiesDesc: "Diese Cookies ermöglichen verbesserte und personalisierte Website-Funktionen. Sie können von unseren Teams oder von Drittanbietern gesetzt werden, deren Dienste auf unserer Website verwendet werden. Wenn Sie diese Cookies nicht akzeptieren, funktionieren einige Dienste möglicherweise nicht ordnungsgemäß.",
    statsTitle: "Analyse-Cookies (Statistiken)",
    statsDesc: "Diese Cookies ermöglichen es uns, den Website-Traffic zu messen, Besuchsstatistiken zu erstellen und die Nutzung zu analysieren (besuchte Seiten, Navigationspfade), um Leistung und Servicequalität zu verbessern. Gesammelte Daten werden aggregiert und anonymisiert und identifizieren Sie nicht persönlich. Die Ablehnung dieser Cookies beeinträchtigt Ihre Website-Nutzung nicht.",
    statsServices: "Dienste: {services}",
    marketingTitle: "Werbe- und Personalisierungs-Cookies",
    marketingDesc: "Diese Cookies personalisieren angezeigte Werbung basierend auf Ihren während Ihrer Navigation auf unserer Website beobachteten Interessen. Sie können auch verwendet werden, um die Wirksamkeit unserer Werbekampagnen zu messen, relevante Inhalte anzubieten und die Häufigkeit zu begrenzen, mit der Ihnen eine Anzeige gezeigt wird. Die Ablehnung dieser Cookies verhindert nicht die Navigation auf unserer Website, aber angezeigte Werbung wird weniger auf Ihre Präferenzen zugeschnitten sein.",
    marketingServices: "Dienste: {services}",
    loggingTitle: "📋 Nachweis der Cookie-Einwilligung",
    loggingNotice: "Gemäß unseren gesetzlichen Verpflichtungen (DSGVO Artikel 7.1) und CNIL-Empfehlungen führen wir eine Aufzeichnung Ihrer Einwilligungspräferenzen (funktionale, Statistik-, Werbe-Cookies), der präsentierten Banner-Version und einer technischen Ereigniskennung (UUID). Um die Verarbeitung personenbezogener Daten zu begrenzen, werden Ihre IP-Adresse und Browser-Informationen durch einen irreversiblen Hashing-Prozess mit Server-Geheimnis in <strong>pseudonymisierte</strong> Fingerabdrücke umgewandelt. Diese Einwilligungsprotokolle werden <strong>maximal 13 Monate</strong> aufbewahrt, ausschließlich zum Nachweis der Einwilligungserhebung. Sie können Ihre Auswahl jederzeit ändern, indem Sie auf den Link \"Cookies verwalten\" am Seitenende klicken.",
    acceptAll: "Alle akzeptieren",
    denyAll: "Alle ablehnen",
    viewPrefs: "Einstellungen anpassen",
    savePrefs: "Einstellungen speichern",
    delPrefs: "Einstellungen löschen"
  },
  it: {
    title: "Gestisci il consenso ai cookie",
    message: "Per offrirti la migliore esperienza possibile, utilizziamo cookie per memorizzare alcune informazioni sul tuo dispositivo. Accettando, ci aiuti a migliorare i nostri servizi e a comprendere meglio come navighi sul nostro sito. Se rifiuti, alcune funzionalità potrebbero non funzionare in modo ottimale.",
    closeAria: "Chiudi il banner dei cookie",
    alwaysActive: "Sempre attivo",
    functionalTitle: "Cookie strettamente necessari",
    functionalDesc: "Questi cookie sono necessari per il funzionamento del sito web e non possono essere disattivati nei nostri sistemi. Vengono generalmente impostati in risposta ad azioni da te effettuate, come l'impostazione delle tue preferenze sulla privacy, l'accesso o la compilazione di moduli. Aiutano a proteggere la tua navigazione e a gestire la tua sessione. Questi cookie non raccolgono informazioni che permettono di identificarti personalmente.",
    cookiesTitle: "Cookie di funzionalità",
    cookiesDesc: "Questi cookie consentono di migliorare e personalizzare le funzionalità del sito. Possono essere attivati dai nostri team o da terze parti i cui servizi sono utilizzati sul nostro sito. Se non accetti questi cookie, alcuni servizi potrebbero non funzionare correttamente.",
    statsTitle: "Cookie di misurazione dell'audience (statistiche)",
    statsDesc: "Questi cookie ci permettono di misurare l'audience del sito, realizzare statistiche di visita e analizzarne l'utilizzo (pagine visitate, percorsi di navigazione) per migliorare le prestazioni e la qualità dei nostri servizi. I dati raccolti vengono aggregati e anonimizzati e non permettono di identificarti personalmente. Il rifiuto di questi cookie non ha impatto sul tuo utilizzo del sito.",
    statsServices: "Servizi: {services}",
    marketingTitle: "Cookie pubblicitari e di personalizzazione",
    marketingDesc: "Questi cookie permettono di personalizzare gli annunci visualizzati in base ai tuoi interessi osservati durante la tua navigazione sul nostro sito. Possono anche essere utilizzati per misurare l'efficacia delle nostre campagne pubblicitarie, offrirti contenuti pertinenti e limitare il numero di volte in cui ti viene mostrato un annuncio. Il rifiuto di questi cookie non impedisce la navigazione sul nostro sito, ma gli annunci visualizzati saranno meno adattati alle tue preferenze.",
    marketingServices: "Servizi: {services}",
    loggingTitle: "📋 Prova del consenso ai cookie",
    loggingNotice: "In conformità con i nostri obblighi legali (articolo 7.1 del GDPR) e le raccomandazioni della CNIL, conserviamo una traccia delle tue preferenze di consenso (cookie funzionali, statistiche, pubblicitari), la versione del banner presentato e un identificatore tecnico dell'evento (UUID). Per limitare il trattamento dei dati personali, il tuo indirizzo IP e le informazioni relative al tuo browser vengono trasformati in impronte <strong>pseudonimizzate</strong> tramite un processo di hash irreversibile con segreto del server. Questi log di consenso vengono <strong>conservati per un massimo di 13 mesi</strong>, esclusivamente ai fini della prova della raccolta del tuo consenso. Puoi modificare le tue scelte in qualsiasi momento cliccando sul link \"Gestisci cookie\" disponibile in fondo alla pagina.",
    acceptAll: "Accetta tutto",
    denyAll: "Rifiuta tutto",
    viewPrefs: "Personalizza le mie scelte",
    savePrefs: "Salva le mie preferenze",
    delPrefs: "Elimina le mie preferenze"
  },
  nl: {
    title: "Cookietoestemming beheren",
    message: "Om u de best mogelijke ervaring te bieden, gebruiken we cookies om bepaalde informatie op uw apparaat op te slaan. Door te accepteren helpt u ons onze diensten te verbeteren en beter te begrijpen hoe u op onze site navigeert. Bij weigering werken sommige functies mogelijk niet optimaal.",
    closeAria: "Cookiebanner sluiten",
    alwaysActive: "Altijd actief",
    functionalTitle: "Strikt noodzakelijke cookies",
    functionalDesc: "Deze cookies zijn noodzakelijk voor de werking van de website en kunnen niet worden uitgeschakeld in onze systemen. Ze worden meestal ingesteld als reactie op acties die u hebt uitgevoerd, zoals het instellen van uw privacyvoorkeuren, inloggen of het invullen van formulieren. Ze helpen uw browsen te beveiligen en uw sessie te beheren. Deze cookies verzamelen geen persoonlijk identificeerbare informatie.",
    cookiesTitle: "Functionele cookies",
    cookiesDesc: "Deze cookies maken verbeterde en gepersonaliseerde sitefunctionaliteit mogelijk. Ze kunnen worden ingesteld door onze teams of door derden wier diensten op onze site worden gebruikt. Als u deze cookies niet accepteert, werken sommige diensten mogelijk niet goed.",
    statsTitle: "Publieksmeting cookies (statistieken)",
    statsDesc: "Deze cookies stellen ons in staat om het websiteverkeer te meten, bezoekstatistieken samen te stellen en het gebruik te analyseren (bezochte pagina's, navigatiepaden) om prestaties en servicekwaliteit te verbeteren. Verzamelde gegevens worden geaggregeerd en geanonimiseerd en identificeren u niet persoonlijk. Weigeren van deze cookies heeft geen invloed op uw site-gebruik.",
    statsServices: "Diensten: {services}",
    marketingTitle: "Reclame- en personalisatiecookies",
    marketingDesc: "Deze cookies personaliseren weergegeven advertenties op basis van uw interesses die tijdens uw navigatie op onze site zijn waargenomen. Ze kunnen ook worden gebruikt om de effectiviteit van onze reclamecampagnes te meten, relevante inhoud aan te bieden en te beperken hoe vaak een advertentie aan u wordt getoond. Weigeren van deze cookies verhindert niet de navigatie op onze site, maar weergegeven advertenties zullen minder zijn afgestemd op uw voorkeuren.",
    marketingServices: "Diensten: {services}",
    loggingTitle: "📋 Bewijs van cookietoestemming",
    loggingNotice: "In overeenstemming met onze wettelijke verplichtingen (AVG artikel 7.1) en CNIL-aanbevelingen houden we een registratie bij van uw toestemmingsvoorkeuren (functionele, statistiek-, reclame-cookies), de gepresenteerde bannerversie en een technische gebeurtenis-ID (UUID). Om de verwerking van persoonsgegevens te beperken, worden uw IP-adres en browserinformatie getransformeerd in <strong>gepseudonimiseerde</strong> vingerafdrukken via een onomkeerbaar hashing-proces met servergeheim. Deze toestemmingslogs worden <strong>maximaal 13 maanden</strong> bewaard, uitsluitend voor het bewijs van toestemmingsverzameling. U kunt uw keuzes op elk moment wijzigen door op de link \"Cookies beheren\" onderaan de pagina te klikken.",
    acceptAll: "Alles accepteren",
    denyAll: "Alles weigeren",
    viewPrefs: "Voorkeuren aanpassen",
    savePrefs: "Voorkeuren opslaan",
    delPrefs: "Voorkeuren verwijderen"
  },
  pt: {
    title: "Gerir o consentimento de cookies",
    message: "Para lhe oferecer a melhor experiência possível, utilizamos cookies para armazenar certas informações no seu dispositivo. Ao aceitar, ajuda-nos a melhorar os nossos serviços e a compreender melhor como navega no nosso site. Se recusar, algumas funcionalidades podem não funcionar de forma ideal.",
    closeAria: "Fechar o banner de cookies",
    alwaysActive: "Sempre ativo",
    functionalTitle: "Cookies estritamente necessários",
    functionalDesc: "Estes cookies são necessários para o funcionamento do website e não podem ser desativados nos nossos sistemas. São geralmente estabelecidos em resposta a ações que efetuou, como definir as suas preferências de privacidade, iniciar sessão ou preencher formulários. Ajudam a proteger a sua navegação e a gerir a sua sessão. Estes cookies não recolhem informações que permitam identificá-lo pessoalmente.",
    cookiesTitle: "Cookies de funcionalidade",
    cookiesDesc: "Estes cookies permitem melhorar e personalizar as funcionalidades do site. Podem ser ativados pelas nossas equipas ou por terceiros cujos serviços são utilizados no nosso site. Se não aceitar estes cookies, alguns serviços podem não funcionar corretamente.",
    statsTitle: "Cookies de medição de audiência (estatísticas)",
    statsDesc: "Estes cookies permitem-nos medir a audiência do site, realizar estatísticas de visita e analisar a sua utilização (páginas visitadas, percursos de navegação) para melhorar o desempenho e a qualidade dos nossos serviços. Os dados recolhidos são agregados e anonimizados, e não permitem identificá-lo pessoalmente. A recusa destes cookies não tem impacto na sua utilização do site.",
    statsServices: "Serviços: {services}",
    marketingTitle: "Cookies publicitários e de personalização",
    marketingDesc: "Estes cookies permitem personalizar os anúncios apresentados de acordo com os seus interesses observados durante a sua navegação no nosso site. Podem também ser utilizados para medir a eficácia das nossas campanhas publicitárias, oferecer-lhe conteúdo relevante e limitar o número de vezes que um anúncio lhe é apresentado. A recusa destes cookies não impede a navegação no nosso site, mas os anúncios apresentados estarão menos adaptados às suas preferências.",
    marketingServices: "Serviços: {services}",
    loggingTitle: "📋 Prova de consentimento de cookies",
    loggingNotice: "Em conformidade com as nossas obrigações legais (artigo 7.1 do RGPD) e recomendações da CNIL, conservamos um registo das suas preferências de consentimento (cookies funcionais, estatísticas, publicitários), a versão do banner apresentado e um identificador técnico de evento (UUID). Para limitar o tratamento de dados pessoais, o seu endereço IP e informações do navegador são transformados em impressões digitais <strong>pseudonimizadas</strong> através de um processo de hash irreversível com segredo do servidor. Estes registos de consentimento são <strong>conservados por um período máximo de 13 meses</strong>, exclusivamente para fins de prova da recolha do seu consentimento. Pode modificar as suas escolhas a qualquer momento clicando no link \"Gerir cookies\" disponível no rodapé da página.",
    acceptAll: "Aceitar tudo",
    denyAll: "Recusar tudo",
    viewPrefs: "Personalizar as minhas escolhas",
    savePrefs: "Guardar as minhas preferências",
    delPrefs: "Eliminar as minhas preferências"
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