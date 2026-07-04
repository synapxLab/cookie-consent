// --- I18N ---------------------------------------------------------

import { applyTemplateToTranslations } from './helper';

const DICT = {

  en: {
    code: 'en',
    label: 'English',    
    title: "Manage cookie consent",
    title_prefix: "uses cookies",
    description: "To provide you with the best experience, we use cookies. By accepting, you help us improve our services.",
    message: "To provide you with the best possible experience, at [company.name], we use cookies to store certain information on your device. By accepting, you help us improve our services and better understand how you navigate our site. If you refuse, some features may not work optimally.",
    accept: "Accept all",
    deny: "Deny all",
    preferences: "Customize",
    preferences_title: "Manage preferences",
    preferences_description: "Choose which cookies you want to accept",
    save: "Save",
    no_services: "No services configured",
    statistics: "Statistics",
    marketing: "Marketing",
    functional: "Functional",
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
    gcmBadge: "Google Consent Mode v2",
    gcmDesc: "Google Consent Mode v2 is enabled on this site. Even without cookies, aggregated and anonymized data is collected to improve our statistics (GDPR compliant).",    
    loggingTitle: "📋 Cookie consent proof",
    loggingNotice: "In accordance with our legal obligations (GDPR Article 7.1) and CNIL recommendations, we maintain a record of your consent preferences (functional, statistics, advertising cookies), the banner version presented, and a technical event identifier (UUID). To limit personal data processing, your IP address and browser information are transformed into <strong>pseudonymized</strong> fingerprints through an irreversible hashing process with server secret. These consent logs are <strong>retained for a maximum of 13 months</strong>, exclusively for proof of consent collection purposes. You can modify your choices at any time by clicking the \"Manage cookies\" link available at the bottom of the page.",
    consentDate: "Consent date",
    consentId: "Your consent identifier",
    openCookieSettings: "Manage cookies",
    acceptAll: "Accept all",
    denyAll: "Deny all",
    viewPrefs: "Customize preferences",
    savePrefs: "Save preferences",
    delPrefs: "Delete preferences"
  },
 es: {
    code: 'es',
    label: 'Español',    
    title: "Gestionar el consentimiento de cookies",
    message: "Para ofrecerte la mejor experiencia posible, en [company.name], utilizamos cookies para almacenar cierta información en tu dispositivo. Al aceptar, nos ayudas a mejorar nuestros servicios y a comprender mejor cómo navegas por nuestro sitio. Si rechazas, algunas funcionalidades podrían no funcionar de manera óptima.",
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
    gcmBadge: "Google Consent Mode v2",
    gcmDesc: "Google Consent Mode v2 está activo en este sitio. Incluso sin cookies, se recopilan datos agregados y anonimizados para mejorar nuestras estadísticas (conforme RGPD).",    
    loggingTitle: "📋 Prueba de consentimiento de cookies",
    loggingNotice: "De conformidad con nuestras obligaciones legales (artículo 7.1 del RGPD) y las recomendaciones de la CNIL, conservamos un registro de tus preferencias de consentimiento (cookies funcionales, estadísticas, publicitarias), la versión del banner presentado y un identificador técnico de evento (UUID). Para limitar el tratamiento de datos personales, tu dirección IP y la información de tu navegador se transforman en huellas <strong>seudonimizadas</strong> mediante un proceso de hash irreversible con secreto del servidor. Estos registros de consentimiento se <strong>conservan durante un máximo de 13 meses</strong>, exclusivamente con fines de prueba de la recogida de tu consentimiento. Puedes modificar tus opciones en cualquier momento haciendo clic en el enlace \"Gestionar cookies\" disponible al pie de la página.",
    consentDate: "Fecha de consentimiento",
    consentId: "Identificador de tu consentimiento",
    openCookieSettings: "Gestionar cookies",
    acceptAll: "Aceptar todo",
    denyAll: "Rechazar todo",
    viewPrefs: "Personalizar mis opciones",
    savePrefs: "Guardar mis preferencias",
    delPrefs: "Eliminar mis preferencias"
  },
  de: {
    code: 'de',
    label: 'Deutsch',    
    title: "Cookie-Einwilligung verwalten",
    message: "Um Ihnen das bestmögliche Erlebnis zu bieten, verwenden wir bei [company.name] Cookies, um bestimmte Informationen auf Ihrem Gerät zu speichern. Durch das Akzeptieren helfen Sie uns, unsere Dienste zu verbessern und besser zu verstehen, wie Sie auf unserer Website navigieren. Bei Ablehnung funktionieren einige Funktionen möglicherweise nicht optimal.",
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
    gcmBadge: "Google Consent Mode v2",
    gcmDesc: "Google Consent Mode v2 ist auf dieser Website aktiv. Auch ohne Cookies werden aggregierte und anonymisierte Daten erfasst, um unsere Statistiken zu verbessern (DSGVO-konform).",    
    loggingTitle: "📋 Nachweis der Cookie-Einwilligung",
    loggingNotice: "Gemäß unseren gesetzlichen Verpflichtungen (DSGVO Artikel 7.1) und CNIL-Empfehlungen führen wir eine Aufzeichnung Ihrer Einwilligungspräferenzen (funktionale, Statistik-, Werbe-Cookies), der präsentierten Banner-Version und einer technischen Ereigniskennung (UUID). Um die Verarbeitung personenbezogener Daten zu begrenzen, werden Ihre IP-Adresse und Browser-Informationen durch einen irreversiblen Hashing-Prozess mit Server-Geheimnis in <strong>pseudonymisierte</strong> Fingerabdrücke umgewandelt. Diese Einwilligungsprotokolle werden <strong>maximal 13 Monate</strong> aufbewahrt, ausschließlich zum Nachweis der Einwilligungserhebung. Sie können Ihre Auswahl jederzeit ändern, indem Sie auf den Link \"Cookies verwalten\" am Seitenende klicken.",
    consentDate: "Einwilligungsdatum",
    consentId: "Ihre Einwilligungskennung",
    openCookieSettings: "Cookies verwalten",
    acceptAll: "Alle akzeptieren",
    denyAll: "Alle ablehnen",
    viewPrefs: "Einstellungen anpassen",
    savePrefs: "Einstellungen speichern",
    delPrefs: "Einstellungen löschen"
  },  
  fr: {
    code: 'fr',
    label: 'Français',    
    title: "Gérer le consentement aux cookies",
    title_prefix: "utilise des cookies",
    description: "Pour vous offrir la meilleure expérience possible, chez [company.name], nous utilisons des cookies. En acceptant, vous nous aidez à améliorer nos services.",
    message: "Pour vous offrir la meilleure expérience possible, chez [company.name], nous utilisons des cookies pour stocker certaines informations sur votre appareil. En acceptant, vous nous aidez à améliorer nos services et à mieux comprendre comment vous naviguez sur notre site. Si vous refusez, certaines fonctionnalités pourraient ne pas fonctionner de manière optimale.",
    accept: "Tout Accepter",
    deny: "Tout Refuser",
    preferences: "Personnaliser",
    preferences_title: "Gérer mes préférences",
    preferences_description: "Choisissez les cookies que vous souhaitez accepter",
    save: "Enregistrer",
    no_services: "Aucun service configuré",
    statistics: "Statistiques",
    marketing: "Marketing",
    functional: "Fonctionnels",
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
    gcmBadge: "Google Consent Mode v2",
    gcmDesc: "Google Consent Mode v2 est actif sur ce site. Même sans cookies, des données agrégées et anonymisées sont collectées pour améliorer nos statistiques (conforme RGPD).",    
    loggingTitle: "📋 Preuve de consentement aux cookies",
    loggingNotice: "Conformément à nos obligations légales (article 7.1 du RGPD) et aux recommandations de la CNIL, nous conservons une trace de vos préférences de consentement (cookies de fonctionnalité, statistiques, publicité), la version du bandeau présenté et un identifiant technique d'événement (UUID). Afin de limiter le traitement de données personnelles, votre adresse IP et les informations relatives à votre navigateur sont transformées en empreintes <strong>pseudonymisées</strong> par un processus de hachage irréversible avec secret serveur. Ces journaux de consentement sont <strong>conservés pour une durée maximale de 13 mois</strong>, exclusivement à des fins de preuve du recueil de votre consentement. Vous pouvez modifier vos choix à tout moment en cliquant sur le lien \"Gérer mes cookies\" accessible en bas de page.",
    consentDate: "Date de consentement",
    consentId: "Identifiant de votre consentement",
    openCookieSettings: "Gérer les cookies",
    acceptAll: "Tout Accepter",
    denyAll: "Tout Refuser",
    viewPrefs: "Personnaliser mes choix",
    savePrefs: "Enregistrer mes préférences",
    delPrefs: "Supprimer mes préférences"
  },  

  it: {
    code: 'it',
    label: 'Italiano',    
    title: "Gestisci il consenso ai cookie",
    description: "Pour vous offrir la meilleure expérience possible, chez [company.name], nous utilisons des cookies. En acceptant, vous nous aidez à améliorer nos services.",

    message: "Per offrirti la migliore esperienza possibile, presso [company.name], utilizziamo cookie per memorizzare alcune informazioni sul tuo dispositivo. Accettando, ci aiuti a migliorare i nostri servizi e a comprendere meglio come navighi sul nostro sito. Se rifiuti, alcune funzionalità potrebbero non funzionare in modo ottimale.",
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
    gcmBadge: "Google Consent Mode v2",
    gcmDesc: "Google Consent Mode v2 è attivo su questo sito. Anche senza cookie, vengono raccolti dati aggregati e anonimizzati per migliorare le nostre statistiche (conforme GDPR).",    
    loggingTitle: "📋 Prova del consenso ai cookie",
    loggingNotice: "In conformità con i nostri obblighi legali (articolo 7.1 del GDPR) e le raccomandazioni della CNIL, conserviamo una traccia delle tue preferenze di consenso (cookie funzionali, statistiche, pubblicitari), la versione del banner presentato e un identificatore tecnico dell'evento (UUID). Per limitare il trattamento dei dati personali, il tuo indirizzo IP e le informazioni relative al tuo browser vengono trasformati in impronte <strong>pseudonimizzate</strong> tramite un processo di hash irreversibile con segreto del server. Questi log di consenso vengono <strong>conservati per un massimo di 13 mesi</strong>, esclusivamente ai fini della prova della raccolta del tuo consenso. Puoi modificare le tue scelte in qualsiasi momento cliccando sul link \"Gestisci cookie\" disponibile in fondo alla pagina.",
    acceptAll: "Accetta tutto",
    denyAll: "Rifiuta tutto",
    viewPrefs: "Personalizza le mie scelte",
    savePrefs: "Salva le mie preferenze",
    delPrefs: "Elimina le mie preferenze"
  },
  nl: {
    code: 'nl',
    label: 'Nederlands',    
    title: "Cookietoestemming beheren",
    description: "Pour vous offrir la meilleure expérience possible, chez [company.name], nous utilisons des cookies. En acceptant, vous nous aidez à améliorer nos services.",

    message: "Om u de best mogelijke ervaring te bieden, bij [company.name], gebruiken we cookies om bepaalde informatie op uw apparaat op te slaan. Door te accepteren helpt u ons onze diensten te verbeteren en beter te begrijpen hoe u op onze site navigeert. Bij weigering werken sommige functies mogelijk niet optimaal.",
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
    gcmBadge: "Google Consent Mode v2",
    gcmDesc: "Google Consent Mode v2 is actief op deze site. Zelfs zonder cookies worden geaggregeerde en geanonimiseerde gegevens verzameld om onze statistieken te verbeteren (AVG-conform).",    
    loggingTitle: "📋 Bewijs van cookietoestemming",
    loggingNotice: "In overeenstemming met onze wettelijke verplichtingen (AVG artikel 7.1) en CNIL-aanbevelingen houden we een registratie bij van uw toestemmingsvoorkeuren (functionele, statistiek-, reclame-cookies), de gepresenteerde bannerversie en een technische gebeurtenis-ID (UUID). Om de verwerking van persoonsgegevens te beperken, worden uw IP-adres en browserinformatie getransformeerd in <strong>gepseudonimiseerde</strong> vingerafdrukken via een onomkeerbaar hashing-proces met servergeheim. Deze toestemmingslogs worden <strong>maximaal 13 maanden</strong> bewaard, uitsluitend voor het bewijs van toestemmingsverzameling. U kunt uw keuzes op elk moment wijzigen door op de link \"Cookies beheren\" onderaan de pagina te klikken.",
    acceptAll: "Alles accepteren",
    denyAll: "Alles weigeren",
    viewPrefs: "Voorkeuren aanpassen",
    savePrefs: "Voorkeuren opslaan",
    delPrefs: "Voorkeuren verwijderen"
  },
  pt: {
    code: 'pt',
    label: 'Português',    
    title: "Gerir o consentimento de cookies",
    description: "Pour vous offrir la meilleure expérience possible, chez [company.name], nous utilisons des cookies. En acceptant, vous nous aidez à améliorer nos services.",

    message: "Para lhe oferecer a melhor experiência possível, na [company.name], utilizamos cookies para armazenar certas informações no seu dispositivo. Ao aceitar, ajuda-nos a melhorar os nossos serviços e a compreender melhor como navega no nosso site. Se recusar, algumas funcionalidades podem não funcionar de forma ideal.",
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
    gcmBadge: "Google Consent Mode v2",
    gcmDesc: "O Google Consent Mode v2 está ativo neste site. Mesmo sem cookies, dados agregados e anonimizados são coletados para melhorar nossas estatísticas (conforme RGPD).",    
    loggingTitle: "📋 Prova de consentimento de cookies",
    loggingNotice: "Em conformidade com as nossas obrigações legais (artigo 7.1 do RGPD) e recomendações da CNIL, conservamos um registo das suas preferências de consentimento (cookies funcionais, estatísticas, publicitários), a versão do banner apresentado e um identificador técnico de evento (UUID). Para limitar o tratamento de dados pessoais, o seu endereço IP e informações do navegador são transformados em impressões digitais <strong>pseudonimizadas</strong> através de um processo de hash irreversível com segredo do servidor. Estes registos de consentimento são <strong>conservados por um período máximo de 13 meses</strong>, exclusivamente para fins de prova da recolha do seu consentimento. Pode modificar as suas escolhas a qualquer momento clicando no link \"Gerir cookies\" disponível no rodapé da página.",
    acceptAll: "Aceitar tudo",
    denyAll: "Recusar tudo",
    viewPrefs: "Personalizar as minhas escolhas",
    savePrefs: "Guardar as minhas preferências",
    delPrefs: "Eliminar as minhas preferências"
  },
 pl: {
    code: 'pl',
    label: 'Polski',
    title: "Zarządzaj zgodą na pliki cookie",
    title_prefix: "używa plików cookie",
    description: "Aby zapewnić najlepsze wrażenia, korzystamy z plików cookie. Akceptując, pomagasz nam ulepszać nasze usługi.",
    message: "Aby zapewnić Ci jak najlepsze doświadczenie, w firmie [company.name], używamy plików cookie do przechowywania niektórych informacji na Twoim urządzeniu. Akceptując, pomagasz nam ulepszać nasze usługi i lepiej rozumieć, jak korzystasz z naszej witryny. Jeśli odmówisz, niektóre funkcje mogą nie działać prawidłowo.",
    accept: "Akceptuj wszystkie",
    deny: "Odrzuć wszystkie",
    preferences: "Dostosuj",
    preferences_title: "Zarządzaj preferencjami",
    preferences_description: "Wybierz, które pliki cookie chcesz zaakceptować",
    save: "Zapisz",
    no_services: "Brak skonfigurowanych usług",
    statistics: "Statystyki",
    marketing: "Marketing",
    functional: "Funkcjonalne",
    closeAria: "Zamknij baner plików cookie",
    alwaysActive: "Zawsze aktywne",
    functionalTitle: "Ściśle niezbędne pliki cookie",
    functionalDesc: "Te pliki cookie są niezbędne do działania witryny i nie można ich wyłączyć w naszych systemach. Zazwyczaj są ustawiane w odpowiedzi na Twoje działania, takie jak logowanie, ustawienia prywatności lub wypełnianie formularzy.",
    cookiesTitle: "Funkcjonalne pliki cookie",
    cookiesDesc: "Te pliki cookie umożliwiają ulepszone i spersonalizowane funkcje witryny. Mogą być ustawiane przez nas lub przez osoby trzecie. Jeśli ich nie zaakceptujesz, niektóre usługi mogą nie działać prawidłowo.",
    statsTitle: "Analityczne pliki cookie (statystyki)",
    statsDesc: "Te pliki cookie pozwalają nam mierzyć ruch na stronie, analizować wizyty i poprawiać wydajność. Dane są agregowane i anonimizowane. Odmowa nie wpływa na korzystanie z witryny.",
    statsServices: "Usługi: {services}",
    marketingTitle: "Reklamowe i personalizacyjne pliki cookie",
    marketingDesc: "Te pliki cookie personalizują reklamy na podstawie Twoich zainteresowań i pomagają mierzyć skuteczność kampanii. Odmowa nie uniemożliwia korzystania z witryny, ale reklamy będą mniej dopasowane.",
    marketingServices: "Usługi: {services}",
    gcmBadge: "Google Consent Mode v2",
    gcmDesc: "Google Consent Mode v2 jest aktywny na tej stronie. Nawet bez plików cookie zbierane są zagregowane i anonimowe dane w celu ulepszenia statystyk (zgodne z RODO).",
    loggingTitle: "📋 Dowód zgody na pliki cookie",
    loggingNotice: "Zgodnie z RODO (art. 7.1) przechowujemy zapis Twoich preferencji dotyczących plików cookie (funkcjonalne, statystyczne, reklamowe), wersję banera i identyfikator techniczny (UUID). Adres IP i dane przeglądarki są <strong>pseudonimizowane</strong> przez nieodwracalne hashowanie. Dane są przechowywane maksymalnie 13 miesięcy wyłącznie w celach dowodowych.",
    acceptAll: "Akceptuj wszystkie",
    denyAll: "Odrzuć wszystkie",
    viewPrefs: "Dostosuj preferencje",
    savePrefs: "Zapisz preferencje",
    delPrefs: "Usuń preferencje"
  },

  sv: {
    code: 'sv',
    label: 'Svenska',
    title: "Hantera samtycke till cookies",
    title_prefix: "använder cookies",
    description: "För att ge dig den bästa upplevelsen använder vi cookies. Genom att acceptera hjälper du oss att förbättra våra tjänster.",
    message: "För att ge dig bästa möjliga upplevelse använder vi hos [company.name] cookies för att lagra viss information på din enhet. Genom att acceptera hjälper du oss att förbättra våra tjänster och förstå hur du använder vår webbplats. Om du nekar kan vissa funktioner fungera sämre.",
    accept: "Acceptera alla",
    deny: "Neka alla",
    preferences: "Anpassa",
    preferences_title: "Hantera inställningar",
    preferences_description: "Välj vilka cookies du vill acceptera",
    save: "Spara",
    no_services: "Inga tjänster konfigurerade",
    statistics: "Statistik",
    marketing: "Marknadsföring",
    functional: "Funktionella",
    closeAria: "Stäng cookie-banderoll",
    alwaysActive: "Alltid aktiv",
    functionalTitle: "Strikt nödvändiga cookies",
    functionalDesc: "Dessa cookies är nödvändiga för att webbplatsen ska fungera och kan inte stängas av i våra system. De ställs in som svar på dina handlingar, t.ex. integritetsinställningar, inloggning eller formulär.",
    cookiesTitle: "Funktionella cookies",
    cookiesDesc: "Dessa cookies gör det möjligt att förbättra och anpassa webbplatsens funktioner. De kan ställas in av oss eller av tredje part. Om du inte accepterar kan vissa funktioner sluta fungera korrekt.",
    statsTitle: "Analyscookies (statistik)",
    statsDesc: "Dessa cookies hjälper oss att mäta trafik, analysera användning och förbättra prestanda. Uppgifter samlas in anonymt och används endast i aggregerad form.",
    statsServices: "Tjänster: {services}",
    marketingTitle: "Reklam- och personaliseringscookies",
    marketingDesc: "Dessa cookies används för att visa relevanta annonser och mäta kampanjernas effektivitet. Att neka påverkar inte webbplatsens användning men annonser blir mindre relevanta.",
    marketingServices: "Tjänster: {services}",
    gcmBadge: "Google Consent Mode v2",
    gcmDesc: "Google Consent Mode v2 är aktiv på denna webbplats. Även utan cookies samlas anonymiserad data in för statistik (GDPR-kompatibel).",
    loggingTitle: "📋 Bevis på samtycke till cookies",
    loggingNotice: "Enligt GDPR (artikel 7.1) lagrar vi bevis på dina val (funktionella, statistiska, marknadsföringscookies), banderollversion och teknisk ID (UUID). IP och webbläsardata <strong>pseudonymiseras</strong> med irreversibel hash. Loggar sparas i högst 13 månader endast för verifiering.",
    acceptAll: "Acceptera alla",
    denyAll: "Neka alla",
    viewPrefs: "Anpassa inställningar",
    savePrefs: "Spara inställningar",
    delPrefs: "Ta bort inställningar"
  },

  ro: {
    code: 'ro',
    label: 'Română',
    title: "Gestionează consimțământul pentru cookie-uri",
    title_prefix: "folosește cookie-uri",
    description: "Pentru a-ți oferi cea mai bună experiență, folosim cookie-uri. Acceptând, ne ajuți să ne îmbunătățim serviciile.",
    message: "Pentru a-ți oferi cea mai bună experiență posibilă, la [company.name], folosim cookie-uri pentru a stoca informații pe dispozitivul tău. Acceptând, ne ajuți să înțelegem mai bine modul în care navighezi pe site. Dacă refuzi, unele funcții pot să nu funcționeze optim.",
    accept: "Acceptă tot",
    deny: "Refuză tot",
    preferences: "Personalizează",
    preferences_title: "Gestionează preferințele",
    preferences_description: "Alege ce cookie-uri dorești să accepți",
    save: "Salvează",
    no_services: "Niciun serviciu configurat",
    statistics: "Statistici",
    marketing: "Marketing",
    functional: "Funcționale",
    closeAria: "Închide bannerul cookie",
    alwaysActive: "Întotdeauna activ",
    functionalTitle: "Cookie-uri strict necesare",
    functionalDesc: "Aceste cookie-uri sunt necesare pentru funcționarea site-ului și nu pot fi dezactivate. Sunt setate ca răspuns la acțiunile tale, cum ar fi conectarea sau completarea formularelor.",
    cookiesTitle: "Cookie-uri funcționale",
    cookiesDesc: "Aceste cookie-uri permit funcționalități îmbunătățite și personalizate. Pot fi setate de noi sau de terți. Dacă nu le accepți, unele servicii pot să nu funcționeze corect.",
    statsTitle: "Cookie-uri de analiză (statistici)",
    statsDesc: "Aceste cookie-uri ne permit să măsurăm traficul, să analizăm utilizarea și să îmbunătățim performanța site-ului. Datele colectate sunt anonime și agregate.",
    statsServices: "Servicii: {services}",
    marketingTitle: "Cookie-uri publicitare și de personalizare",
    marketingDesc: "Aceste cookie-uri personalizează reclamele și ne ajută să măsurăm eficiența campaniilor. Refuzul nu împiedică navigarea, dar reclamele vor fi mai puțin relevante.",
    marketingServices: "Servicii: {services}",
    gcmBadge: "Google Consent Mode v2",
    gcmDesc: "Google Consent Mode v2 este activ pe acest site. Chiar și fără cookie-uri, se colectează date anonime pentru statistici (conform GDPR).",
    loggingTitle: "📋 Dovadă de consimțământ pentru cookie-uri",
    loggingNotice: "Conform GDPR (art. 7.1), păstrăm un jurnal al preferințelor tale (cookie-uri funcționale, statistice, publicitare), versiunea bannerului și un ID tehnic (UUID). IP-ul și datele browserului sunt <strong>pseudonimizate</strong>. Jurnalele se păstrează maximum 13 luni doar pentru dovadă.",
    acceptAll: "Acceptă tot",
    denyAll: "Refuză tot",
    viewPrefs: "Personalizează preferințele",
    savePrefs: "Salvează preferințele",
    delPrefs: "Șterge preferințele"
  },
  ar: {
    code: 'ar',
    label: 'العربية',
    dir: 'rtl',
    title: "إدارة موافقة ملفات تعريف الارتباط",
    title_prefix: "يستخدم ملفات تعريف الارتباط",
    description: "لتحسين تجربتك، نستخدم ملفات تعريف الارتباط. من خلال القبول، تساعدنا في تحسين خدماتنا.",
    message: "لمنحك أفضل تجربة ممكنة، نستخدم في ‎[company.name]‎ ملفات تعريف الارتباط لتخزين بعض المعلومات على جهازك. بقبولك، تساعدنا على تحسين خدماتنا وفهم كيفية استخدامك لموقعنا. في حال الرفض، قد لا تعمل بعض الميزات بشكل مثالي.",
    accept: "قبول الكل",
    deny: "رفض الكل",
    preferences: "تخصيص",
    preferences_title: "إدارة التفضيلات",
    preferences_description: "اختر ملفات تعريف الارتباط التي ترغب في قبولها",
    save: "حفظ",
    no_services: "لا توجد خدمات مهيأة",
    statistics: "الإحصائيات",
    marketing: "التسويق",
    functional: "الوظيفية",
    closeAria: "إغلاق شريط ملفات تعريف الارتباط",
    alwaysActive: "نشط دائمًا",
    functionalTitle: "ملفات تعريف الارتباط الضرورية للغاية",
    functionalDesc: "هذه الملفات ضرورية لعمل الموقع ولا يمكن إيقافها. يتم تعيينها عادةً استجابةً لإجراءاتك مثل تسجيل الدخول أو إعداد الخصوصية.",
    cookiesTitle: "ملفات تعريف الارتباط الوظيفية",
    cookiesDesc: "تمكن هذه الملفات من تحسين وظائف الموقع وتخصيصها. قد يتم تعيينها من قبلنا أو من قبل أطراف ثالثة. إذا لم توافق، قد لا تعمل بعض الخدمات بشكل صحيح.",
    statsTitle: "ملفات تعريف الارتباط التحليلية (الإحصائيات)",
    statsDesc: "تسمح لنا هذه الملفات بقياس عدد الزوار وتحليل استخدام الموقع لتحسين الأداء. يتم جمع البيانات بشكل مجهول ومجمع.",
    statsServices: "الخدمات: {services}",
    marketingTitle: "ملفات تعريف الارتباط الإعلانية والتخصيصية",
    marketingDesc: "تُستخدم هذه الملفات لعرض إعلانات مخصصة بناءً على اهتماماتك. رفضها لا يمنعك من التصفح، ولكن الإعلانات ستكون أقل ملاءمة.",
    marketingServices: "الخدمات: {services}",
    gcmBadge: "وضع موافقة Google الإصدار 2",
    gcmDesc: "وضع موافقة Google الإصدار 2 مفعل على هذا الموقع. حتى بدون ملفات تعريف الارتباط، يتم جمع بيانات مجهولة ومحسوبة لتحسين الإحصاءات (متوافق مع GDPR).",
    loggingTitle: "📋 دليل الموافقة على ملفات تعريف الارتباط",
    loggingNotice: "وفقًا لـ GDPR (المادة 7.1)، نحتفظ بسجل لتفضيلاتك (ملفات تعريف الارتباط الوظيفية، الإحصائية، الإعلانية)، إصدار الشريط ومعرّف تقني (UUID). يتم <strong>إخفاء هوية</strong> عنوان IP وبيانات المتصفح. تُحفظ السجلات لمدة أقصاها 13 شهرًا لأغراض التوثيق فقط.",
    acceptAll: "قبول الكل",
    denyAll: "رفض الكل",
    viewPrefs: "تخصيص التفضيلات",
    savePrefs: "حفظ التفضيلات",
    delPrefs: "حذف التفضيلات"
  } ,
// À AJOUTER DANS DICT :

zh: {
  code: 'zh',
  label: '简体中文',
  title: "管理 Cookie 同意",
  title_prefix: "使用 Cookie",
  description: "为向你提供最佳体验，我们会使用 Cookie。接受后可帮助我们改进服务。",
  message: "为提供尽可能好的体验，我们在 [company.name] 会在你的设备上存储部分信息（Cookie）。接受后可帮助我们改进服务并更好地理解你在本站的使用情况。若拒绝，部分功能可能无法最佳运行。",
  accept: "全部接受",
  deny: "全部拒绝",
  preferences: "自定义",
  preferences_title: "管理偏好",
  preferences_description: "选择你希望接受的 Cookie",
  save: "保存",
  no_services: "未配置任何服务",
  statistics: "统计",
  marketing: "营销",
  functional: "必要功能",
  closeAria: "关闭 Cookie 横幅",
  alwaysActive: "始终启用",
  functionalTitle: "严格必要的 Cookie",
  functionalDesc: "这些 Cookie 对网站运行必不可少，无法在我们的系统中禁用。通常因你的操作而设置，如隐私偏好、登录或填写表单。它们用于保护你的浏览并管理会话，不会收集可识别你的个人信息。",
  cookiesTitle: "功能性 Cookie",
  cookiesDesc: "这些 Cookie 可改进并个性化网站功能。可能由我们或使用于本站的第三方服务设置。若不接受，部分服务可能无法正常工作。",
  statsTitle: "分析类 Cookie（统计）",
  statsDesc: "这些 Cookie 使我们能够衡量流量、汇总访问统计并分析使用情况（访问页面、路径）以改进性能与服务质量。收集的数据为汇总与匿名形式，不会识别你的个人身份。拒绝不会影响你对网站的使用。",
  statsServices: "服务：{services}",
  marketingTitle: "广告与个性化 Cookie",
  marketingDesc: "这些 Cookie 会基于你的兴趣个性化展示的广告，也可用于衡量广告活动效果、提供相关内容并限制同一广告的展示次数。拒绝并不影响浏览，但广告将较少匹配你的偏好。",
  marketingServices: "服务：{services}",
  gcmBadge: "Google Consent Mode v2",
  gcmDesc: "本站已启用 Google Consent Mode v2。即使在无 Cookie 情况下，也会收集汇总且匿名的数据以改进统计（符合 GDPR）。",
  loggingTitle: "📋 Cookie 同意证明",
  loggingNotice: "根据法律义务（GDPR 第 7.1 条）与 CNIL 建议，我们会保存你的同意偏好（功能、统计、广告 Cookie）、横幅版本及事件技术标识（UUID）。为减少个人数据处理，你的 IP 与浏览器信息会通过带服务器密钥的不可逆哈希进行<strong>假名化</strong>。这些同意日志<strong>最多保留 13 个月</strong>，仅用于证明收集同意。你可随时点击页面底部“管理 Cookie”链接修改选择。",
  acceptAll: "全部接受",
  denyAll: "全部拒绝",
  viewPrefs: "自定义偏好",
  savePrefs: "保存偏好",
  delPrefs: "删除偏好"
},

ru: {
  code: 'ru',
  label: 'Русский',
  title: "Управление согласием на cookies",
  title_prefix: "использует cookies",
  description: "Чтобы предоставить лучший опыт, мы используем cookies. Приняв их, вы помогаете нам улучшать сервис.",
  message: "Чтобы обеспечить наилучший опыт, мы в [company.name] используем cookies для хранения части информации на вашем устройстве. Приняв их, вы помогаете нам улучшать сервис и лучше понимать, как вы пользуетесь сайтом. При отказе некоторые функции могут работать не оптимально.",
  accept: "Принять все",
  deny: "Отклонить все",
  preferences: "Настроить",
  preferences_title: "Управление настройками",
  preferences_description: "Выберите, какие cookies вы хотите принять",
  save: "Сохранить",
  no_services: "Сервисы не настроены",
  statistics: "Статистика",
  marketing: "Маркетинг",
  functional: "Функциональные",
  closeAria: "Закрыть баннер cookies",
  alwaysActive: "Всегда активно",
  functionalTitle: "Строго необходимые cookies",
  functionalDesc: "Эти cookies необходимы для работы сайта и не могут быть отключены в наших системах. Обычно они устанавливаются в ответ на ваши действия, например, вход в систему, настройку конфиденциальности или заполнение форм. Они не собирают персонально идентифицируемую информацию.",
  cookiesTitle: "Функциональные cookies",
  cookiesDesc: "Эти cookies улучшают и персонализируют функциональность сайта. Их могут устанавливать мы или сторонние сервисы, используемые на сайте. Если вы их не примете, некоторые сервисы могут работать некорректно.",
  statsTitle: "Аналитические cookies (статистика)",
  statsDesc: "Эти cookies позволяют измерять трафик, формировать статистику посещений и анализировать использование (посещённые страницы, пути навигации), чтобы повышать производительность и качество сервиса. Собранные данные агрегируются и анонимизируются и не идентифицируют вас лично. Отказ не влияет на возможность пользоваться сайтом.",
  statsServices: "Сервисы: {services}",
  marketingTitle: "Рекламные и персонализационные cookies",
  marketingDesc: "Эти cookies персонализируют показываемую рекламу с учётом ваших интересов, а также помогают измерять эффективность рекламных кампаний, предлагать релевантный контент и ограничивать частоту показов. Отказ не мешает пользоваться сайтом, но реклама будет менее релевантной.",
  marketingServices: "Сервисы: {services}",
  gcmBadge: "Google Consent Mode v2",
  gcmDesc: "На этом сайте включён Google Consent Mode v2. Даже без cookies собираются агрегированные и анонимизированные данные для улучшения статистики (соответствует GDPR).",
  loggingTitle: "📋 Подтверждение согласия на cookies",
  loggingNotice: "В соответствии с нашими юридическими обязанностями (GDPR ст. 7.1) и рекомендациями CNIL мы храним запись о ваших предпочтениях (функциональные, статистические, рекламные cookies), версии баннера и техническом идентификаторе события (UUID). Чтобы ограничить обработку персональных данных, ваш IP и сведения о браузере <strong>псевдонимизируются</strong> посредством необратимого хеширования с серверным секретом. Эти журналы хранятся <strong>не более 13 месяцев</strong> и используются исключительно в целях доказательства получения согласия. Вы можете изменить выбор в любое время по ссылке «Управление cookies» внизу страницы.",
  acceptAll: "Принять все",
  denyAll: "Отклонить все",
  viewPrefs: "Настроить предпочтения",
  savePrefs: "Сохранить предпочтения",
  delPrefs: "Удалить предпочтения"
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

// Variables globales pour le templating
let TEMPLATE_VARIABLES = {};

function t(key, params) {
  const l = detect();
  const dict = DICT[l] || DICT.fr;
  let value = dict[key] ?? DICT.fr[key] ?? key;
  
  // Appliquer le templating avec les variables globales
  if (typeof value === 'string' && Object.keys(TEMPLATE_VARIABLES).length > 0) {
    value = value.replace(/\[([a-zA-Z0-9_.]+)\]/g, (match, path) => {
      const keys = path.split('.');
      let result = TEMPLATE_VARIABLES;
      
      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k];
        } else {
          return match; // Variable non trouvée, garder le placeholder
        }
      }
      
      return result != null ? String(result) : match;
    });
  }
  
  // Appliquer l'interpolation classique {key}
  return interpolate(value, params);
}

// méthodes statiques
t.setLocale = (l) => { locale = l?.toLowerCase() || null; };
t.getLocale = () => detect();
t.add = (l, entries) => { DICT[l] = { ...(DICT[l]||{}), ...entries }; };
t.dict = DICT;

// Nouvelle méthode pour définir les variables de templating
t.setVariables = (variables) => { 
  TEMPLATE_VARIABLES = variables || {}; 
};

// Récupérer les variables actuelles
t.getVariables = () => ({ ...TEMPLATE_VARIABLES });

// Appliquer le templating sur un dictionnaire complet (utilitaire)
t.applyTemplate = (translations, variables) => 
  applyTemplateToTranslations(translations, variables || TEMPLATE_VARIABLES);

export default t;