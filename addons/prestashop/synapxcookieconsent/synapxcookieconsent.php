<?php
/**
 * SynapxLab Cookie Consent
 *
 * Bannière de consentement aux cookies conforme RGPD/CNIL.
 * Fonctionne en mode 100 % autonome (aucune donnée sortante) ou,
 * en option, avec une clé API SynapxLab pour la preuve de consentement.
 *
 * @author    SynapxLab <contact@synapx.fr>
 * @copyright 2026 SynapxLab
 * @license   https://opensource.org/licenses/MIT MIT License
 */
if (!defined('_PS_VERSION_')) {
    exit;
}

class SynapxCookieConsent extends Module
{
    /**
     * Endpoint SynapxLab utilisé uniquement lorsqu'une clé API est renseignée.
     */
    const LOGGER_ENDPOINT = 'https://cookie.synapx.fr/';

    /**
     * Langues embarquées dans la bannière (dist/cookie.js).
     *
     * @var array
     */
    private static $supportedLocales = array('ar', 'de', 'en', 'es', 'fr', 'it', 'nl', 'pl', 'pt', 'ro', 'ru', 'sv', 'zh');

    /**
     * Clés de configuration gérées par le module.
     *
     * @var array
     */
    private static $configKeys = array(
        'SYNAPXCC_ENABLED',
        'SYNAPXCC_API_KEY',
        'SYNAPXCC_LANGUAGE',
        'SYNAPXCC_GCM',
        'SYNAPXCC_PRIVACY_URL',
        'SYNAPXCC_GA4',
        'SYNAPXCC_GTM',
        'SYNAPXCC_MATOMO_URL',
        'SYNAPXCC_MATOMO_SITE_ID',
        'SYNAPXCC_FB_PIXEL',
        'SYNAPXCC_ADSENSE',
        'SYNAPXCC_CRISP',
        'SYNAPXCC_HUBSPOT',
    );

    public function __construct()
    {
        $this->name = 'synapxcookieconsent';
        $this->tab = 'administration';
        $this->version = '1.0.1';
        $this->author = 'SynapxLab';
        $this->need_instance = 0;
        $this->bootstrap = true;

        parent::__construct();

        $this->displayName = $this->l('SynapxLab Cookie Consent');
        $this->description = $this->l('Bannière de consentement aux cookies conforme au RGPD et aux recommandations de la CNIL. Elle bloque les scripts tiers avant le consentement, prend en charge Google Consent Mode v2 et propose 13 langues. Le module fonctionne sans compte ni service externe ; une clé API SynapxLab facultative active la preuve de consentement centralisée.');
        $this->confirmUninstall = $this->l('La bannière de consentement ne sera plus affichée sur la boutique. Voulez-vous désinstaller le module ?');

        $this->ps_versions_compliancy = array('min' => '1.7.0.0', 'max' => _PS_VERSION_);
    }

    /**
     * @return bool
     */
    public function install()
    {
        return parent::install()
            && $this->registerHook('displayHeader')
            && $this->registerHook('actionFrontControllerSetMedia')
            && $this->installDefaultValues();
    }

    /**
     * @return bool
     */
    public function uninstall()
    {
        foreach (self::$configKeys as $key) {
            Configuration::deleteByName($key);
        }

        return parent::uninstall();
    }

    /**
     * Valeurs par défaut : bannière active, langue de la boutique,
     * Google Consent Mode v2 actif, page CMS de confidentialité si détectée.
     *
     * @return bool
     */
    private function installDefaultValues()
    {
        return Configuration::updateValue('SYNAPXCC_ENABLED', 1)
            && Configuration::updateValue('SYNAPXCC_API_KEY', '')
            && Configuration::updateValue('SYNAPXCC_LANGUAGE', 'shop')
            && Configuration::updateValue('SYNAPXCC_GCM', 1)
            && Configuration::updateValue('SYNAPXCC_PRIVACY_URL', $this->detectPrivacyCmsUrl())
            && Configuration::updateValue('SYNAPXCC_GA4', '')
            && Configuration::updateValue('SYNAPXCC_GTM', '')
            && Configuration::updateValue('SYNAPXCC_MATOMO_URL', '')
            && Configuration::updateValue('SYNAPXCC_MATOMO_SITE_ID', '')
            && Configuration::updateValue('SYNAPXCC_FB_PIXEL', '')
            && Configuration::updateValue('SYNAPXCC_ADSENSE', '')
            && Configuration::updateValue('SYNAPXCC_CRISP', '')
            && Configuration::updateValue('SYNAPXCC_HUBSPOT', '');
    }

    /**
     * Recherche la page CMS "Politique de confidentialité" de la boutique.
     *
     * @return string URL de la page CMS ou chaîne vide
     */
    private function detectPrivacyCmsUrl()
    {
        $idLang = (int) Configuration::get('PS_LANG_DEFAULT');

        $idCms = Db::getInstance()->getValue(
            'SELECT c.`id_cms`
             FROM `' . _DB_PREFIX_ . 'cms` c
             INNER JOIN `' . _DB_PREFIX_ . 'cms_lang` cl
                ON cl.`id_cms` = c.`id_cms` AND cl.`id_lang` = ' . $idLang . '
             WHERE c.`active` = 1
               AND (cl.`link_rewrite` LIKE \'%confidentialite%\'
                    OR cl.`link_rewrite` LIKE \'%privacy%\'
                    OR cl.`meta_title` LIKE \'%confidentialit%\'
                    OR cl.`meta_title` LIKE \'%privacy%\')
             ORDER BY c.`id_cms` ASC'
        );

        if ($idCms && isset($this->context->link) && $this->context->link) {
            return $this->context->link->getCMSLink((int) $idCms);
        }

        return '';
    }

    /* ==================== FRONT OFFICE ==================== */

    /**
     * Conservé pour compatibilité : le bundle est désormais chargé depuis
     * header.tpl (hook displayHeader) afin de maîtriser l'ordre exact entre
     * l'attribut data-no-telemetry et l'exécution du bundle.
     *
     * @param array $params
     */
    public function hookActionFrontControllerSetMedia($params)
    {
        // Rien à enregistrer ici : voir hookDisplayHeader().
    }

    /**
     * Injecte le bundle puis le script d'initialisation dans le <head>.
     *
     * @param array $params
     *
     * @return string
     */
    public function hookDisplayHeader($params)
    {
        if (!Configuration::get('SYNAPXCC_ENABLED')) {
            return '';
        }

        $jsonFlags = JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_SLASHES;

        // Mode sans clé API : bannière strictement sans donnée sortante, on
        // désactive la télémétrie de version du SDK via data-no-telemetry.
        $apiKey = trim((string) Configuration::get('SYNAPXCC_API_KEY'));

        $this->context->smarty->assign(array(
            'synapxcc_config' => json_encode($this->buildBannerConfig(), $jsonFlags),
            'synapxcc_locale' => json_encode($this->resolveForcedLocale(), $jsonFlags),
            'synapxcc_js_url' => $this->_path . 'views/js/cookie.js?v=' . $this->version,
            'synapxcc_no_telemetry' => ($apiKey === ''),
        ));

        return $this->fetch('module:' . $this->name . '/views/templates/hook/header.tpl');
    }

    /**
     * Construit l'objet de configuration passé à window.CookieConsent.init().
     *
     * @return array
     */
    private function buildBannerConfig()
    {
        $config = array(
            'google_consent_mode' => array(
                'enabled' => (bool) Configuration::get('SYNAPXCC_GCM'),
            ),
        );

        // Mode AVEC clé API : preuve de consentement SynapxLab.
        // Sans clé, le logger reste désactivé : aucune donnée sortante.
        $apiKey = trim((string) Configuration::get('SYNAPXCC_API_KEY'));
        if ($apiKey !== '') {
            $config['logger'] = array(
                'enabled' => true,
                'endpoint' => self::LOGGER_ENDPOINT,
                'apiKey' => $apiKey,
                'anonymousId' => true,
            );
        }

        // Nom de la boutique : sans lui, la bannière retombe sur son titre
        // générique (« chez Gérer le consentement aux cookies »).
        $shopName = trim((string) Configuration::get('PS_SHOP_NAME'));
        $config['company'] = $shopName !== ''
            ? array('name' => $shopName)
            : array('auto' => true);

        $privacyUrl = trim((string) Configuration::get('SYNAPXCC_PRIVACY_URL'));
        if ($privacyUrl !== '') {
            $config['company']['privacypolicy'] = $privacyUrl;
        }

        // Catégorie statistiques
        $statistics = array();
        $ga4 = trim((string) Configuration::get('SYNAPXCC_GA4'));
        if ($ga4 !== '') {
            $statistics['google_analytics_key'] = $ga4;
        }
        $gtm = trim((string) Configuration::get('SYNAPXCC_GTM'));
        if ($gtm !== '') {
            $statistics['google_tag_manager_key'] = $gtm;
        }
        $matomoUrl = trim((string) Configuration::get('SYNAPXCC_MATOMO_URL'));
        $matomoSiteId = trim((string) Configuration::get('SYNAPXCC_MATOMO_SITE_ID'));
        if ($matomoUrl !== '' && $matomoSiteId !== '') {
            $statistics['matomo'] = array(
                'url' => $matomoUrl,
                'siteId' => $matomoSiteId,
            );
        }
        if ($statistics) {
            $config['statistics'] = $statistics;
        }

        // Catégorie marketing
        $marketing = array();
        $fbPixel = trim((string) Configuration::get('SYNAPXCC_FB_PIXEL'));
        if ($fbPixel !== '') {
            $marketing['facebook_pixel'] = array(
                'key' => $fbPixel,
                'track' => 'PageView',
            );
        }
        $adsense = trim((string) Configuration::get('SYNAPXCC_ADSENSE'));
        if ($adsense !== '') {
            $marketing['google_adsense_key'] = $adsense;
        }
        if ($marketing) {
            $config['marketing'] = $marketing;
        }

        // Catégorie fonctionnelle
        $functional = array();
        $crisp = trim((string) Configuration::get('SYNAPXCC_CRISP'));
        if ($crisp !== '') {
            $functional['crisp_website_id'] = $crisp;
        }
        $hubspot = trim((string) Configuration::get('SYNAPXCC_HUBSPOT'));
        if ($hubspot !== '') {
            $functional['hubspot_portal_id'] = $hubspot;
        }
        if ($functional) {
            $config['functional'] = $functional;
        }

        return $config;
    }

    /**
     * Détermine la langue à forcer dans la bannière.
     *
     * - 'shop'    : langue du contexte PrestaShop (défaut)
     * - 'browser' : détection navigateur (aucun forçage)
     * - code ISO  : langue fixe (13 codes ISO pris en charge par le SDK)
     *
     * @return string Code ISO à forcer, ou chaîne vide (détection navigateur)
     */
    private function resolveForcedLocale()
    {
        $mode = (string) Configuration::get('SYNAPXCC_LANGUAGE');

        if ($mode === 'browser') {
            return '';
        }

        if (in_array($mode, self::$supportedLocales, true)) {
            return $mode;
        }

        // Mode 'shop' (défaut) : langue du contexte PrestaShop
        $iso = '';
        if (isset($this->context->language) && Validate::isLoadedObject($this->context->language)) {
            $iso = Tools::strtolower((string) $this->context->language->iso_code);
        }

        return in_array($iso, self::$supportedLocales, true) ? $iso : '';
    }

    /* ==================== BACK OFFICE ==================== */

    /**
     * Page de configuration du module.
     *
     * @return string
     */
    public function getContent()
    {
        $output = '';

        if (Tools::isSubmit('submitSynapxcookieconsent')) {
            $errors = $this->postProcess();
            if ($errors) {
                foreach ($errors as $error) {
                    $output .= $this->displayError($error);
                }
            } else {
                $output .= $this->displayConfirmation($this->l('Les paramètres ont été enregistrés.'));
            }
        }

        $this->context->smarty->assign(array(
            'synapxcc_module_version' => $this->version,
            'synapxcc_api_key_set' => trim((string) Configuration::get('SYNAPXCC_API_KEY')) !== '',
        ));

        $output .= $this->context->smarty->fetch(
            $this->local_path . 'views/templates/admin/configure.tpl'
        );

        return $output . $this->renderForm();
    }

    /**
     * Validation et enregistrement du formulaire.
     *
     * @return array Liste des erreurs (vide si succès)
     */
    private function postProcess()
    {
        $errors = array();

        $enabled = (int) (bool) Tools::getValue('SYNAPXCC_ENABLED');
        $gcm = (int) (bool) Tools::getValue('SYNAPXCC_GCM');

        // Clé API : optionnelle, format contrôlé
        $apiKey = trim((string) Tools::getValue('SYNAPXCC_API_KEY'));
        if ($apiKey !== '' && !preg_match('/^[A-Za-z0-9_\-]{16,128}$/', $apiKey)) {
            $errors[] = $this->l('Le format de la clé API est invalide (16 à 128 caractères alphanumériques, tirets et tirets bas).');
        }

        // Langue : liste blanche
        $language = (string) Tools::getValue('SYNAPXCC_LANGUAGE');
        $allowedLanguages = array_merge(array('shop', 'browser'), self::$supportedLocales);
        if (!in_array($language, $allowedLanguages, true)) {
            $errors[] = $this->l('La langue sélectionnée est invalide.');
        }

        // Lien politique de confidentialité : URL absolue ou chemin relatif
        $privacyUrl = trim((string) Tools::getValue('SYNAPXCC_PRIVACY_URL'));
        if ($privacyUrl !== ''
            && strpos($privacyUrl, '/') !== 0
            && !Validate::isAbsoluteUrl($privacyUrl)
        ) {
            $errors[] = $this->l('Le lien vers la politique de confidentialité doit être une URL absolue (https://...) ou un chemin relatif commençant par « / ».');
        }

        // Services : formats contrôlés, tous optionnels
        $ga4 = trim((string) Tools::getValue('SYNAPXCC_GA4'));
        if ($ga4 !== '' && !preg_match('/^G-[A-Z0-9]{4,20}$/i', $ga4)) {
            $errors[] = $this->l('L\'identifiant Google Analytics 4 doit être au format G-XXXXXXXXXX.');
        }

        $gtm = trim((string) Tools::getValue('SYNAPXCC_GTM'));
        if ($gtm !== '' && !preg_match('/^GTM-[A-Z0-9]{4,12}$/i', $gtm)) {
            $errors[] = $this->l('L\'identifiant Google Tag Manager doit être au format GTM-XXXXXXX.');
        }

        $matomoUrl = trim((string) Tools::getValue('SYNAPXCC_MATOMO_URL'));
        if ($matomoUrl !== '' && !Validate::isAbsoluteUrl($matomoUrl)) {
            $errors[] = $this->l('L\'URL Matomo doit être absolue (https://...).');
        }

        $matomoSiteId = trim((string) Tools::getValue('SYNAPXCC_MATOMO_SITE_ID'));
        if ($matomoSiteId !== '' && !Validate::isUnsignedInt($matomoSiteId)) {
            $errors[] = $this->l('L\'identifiant de site Matomo doit être un nombre entier.');
        }

        if (($matomoUrl === '') !== ($matomoSiteId === '')) {
            $errors[] = $this->l('Matomo nécessite à la fois l\'URL du serveur et l\'identifiant de site : renseignez les deux champs ou laissez-les vides.');
        }

        $fbPixel = trim((string) Tools::getValue('SYNAPXCC_FB_PIXEL'));
        if ($fbPixel !== '' && !preg_match('/^[0-9]{5,20}$/', $fbPixel)) {
            $errors[] = $this->l('L\'identifiant Facebook Pixel doit être numérique.');
        }

        $adsense = trim((string) Tools::getValue('SYNAPXCC_ADSENSE'));
        if ($adsense !== '' && !preg_match('/^ca-pub-[0-9]{10,20}$/', $adsense)) {
            $errors[] = $this->l('L\'identifiant AdSense doit être au format ca-pub-XXXXXXXXXXXXXXXX.');
        }

        $crisp = trim((string) Tools::getValue('SYNAPXCC_CRISP'));
        if ($crisp !== '' && !preg_match('/^[A-Za-z0-9\-]{8,64}$/', $crisp)) {
            $errors[] = $this->l('L\'identifiant Crisp est invalide.');
        }

        $hubspot = trim((string) Tools::getValue('SYNAPXCC_HUBSPOT'));
        if ($hubspot !== '' && !preg_match('/^[0-9]{4,20}$/', $hubspot)) {
            $errors[] = $this->l('L\'identifiant de portail HubSpot doit être numérique.');
        }

        if ($errors) {
            return $errors;
        }

        Configuration::updateValue('SYNAPXCC_ENABLED', $enabled);
        Configuration::updateValue('SYNAPXCC_API_KEY', $apiKey);
        Configuration::updateValue('SYNAPXCC_LANGUAGE', $language);
        Configuration::updateValue('SYNAPXCC_GCM', $gcm);
        Configuration::updateValue('SYNAPXCC_PRIVACY_URL', $privacyUrl);
        Configuration::updateValue('SYNAPXCC_GA4', $ga4);
        Configuration::updateValue('SYNAPXCC_GTM', $gtm);
        Configuration::updateValue('SYNAPXCC_MATOMO_URL', $matomoUrl);
        Configuration::updateValue('SYNAPXCC_MATOMO_SITE_ID', $matomoSiteId);
        Configuration::updateValue('SYNAPXCC_FB_PIXEL', $fbPixel);
        Configuration::updateValue('SYNAPXCC_ADSENSE', $adsense);
        Configuration::updateValue('SYNAPXCC_CRISP', $crisp);
        Configuration::updateValue('SYNAPXCC_HUBSPOT', $hubspot);

        return array();
    }

    /**
     * Formulaire de configuration (HelperForm).
     *
     * @return string
     */
    private function renderForm()
    {
        $helper = new HelperForm();

        $helper->module = $this;
        $helper->name_controller = $this->name;
        $helper->token = Tools::getAdminTokenLite('AdminModules');
        $helper->currentIndex = AdminController::$currentIndex . '&configure=' . $this->name;
        $helper->default_form_language = (int) Configuration::get('PS_LANG_DEFAULT');
        $helper->allow_employee_form_lang = (int) Configuration::get('PS_BO_ALLOW_EMPLOYEE_FORM_LANG', 0);
        $helper->title = $this->displayName;
        $helper->submit_action = 'submitSynapxcookieconsent';
        $helper->show_toolbar = false;

        $helper->tpl_vars = array(
            'fields_value' => $this->getConfigFormValues(),
            'languages' => $this->context->controller->getLanguages(),
            'id_language' => $this->context->language->id,
        );

        return $helper->generateForm(array(
            $this->getGeneralForm(),
            $this->getApiKeyForm(),
            $this->getServicesForm(),
        ));
    }

    /**
     * @return array
     */
    private function getGeneralForm()
    {
        $languageOptions = array(
            array('id' => 'shop', 'name' => $this->l('Automatique — langue de la boutique (recommandé)')),
            array('id' => 'browser', 'name' => $this->l('Automatique — langue du navigateur du visiteur')),
            array('id' => 'fr', 'name' => $this->l('Forcer le français')),
            array('id' => 'en', 'name' => $this->l('Forcer l\'anglais')),
            array('id' => 'es', 'name' => $this->l('Forcer l\'espagnol')),
            array('id' => 'de', 'name' => $this->l('Forcer l\'allemand')),
            array('id' => 'it', 'name' => $this->l('Forcer l\'italien')),
            array('id' => 'nl', 'name' => $this->l('Forcer le néerlandais')),
            array('id' => 'pt', 'name' => $this->l('Forcer le portugais')),
            array('id' => 'pl', 'name' => $this->l('Forcer le polonais')),
            array('id' => 'ro', 'name' => $this->l('Forcer le roumain')),
            array('id' => 'ru', 'name' => $this->l('Forcer le russe')),
            array('id' => 'sv', 'name' => $this->l('Forcer le suédois')),
            array('id' => 'ar', 'name' => $this->l('Forcer l\'arabe')),
            array('id' => 'zh', 'name' => $this->l('Forcer le chinois')),
        );

        return array(
            'form' => array(
                'legend' => array(
                    'title' => $this->l('Réglages généraux'),
                    'icon' => 'icon-cogs',
                ),
                'input' => array(
                    array(
                        'type' => 'switch',
                        'label' => $this->l('Activer la bannière'),
                        'name' => 'SYNAPXCC_ENABLED',
                        'is_bool' => true,
                        'desc' => $this->l('Affiche la bannière de consentement sur l\'ensemble des pages de la boutique.'),
                        'values' => array(
                            array('id' => 'enabled_on', 'value' => 1, 'label' => $this->l('Oui')),
                            array('id' => 'enabled_off', 'value' => 0, 'label' => $this->l('Non')),
                        ),
                    ),
                    array(
                        'type' => 'select',
                        'label' => $this->l('Langue de la bannière'),
                        'name' => 'SYNAPXCC_LANGUAGE',
                        'desc' => $this->l('Par défaut, la bannière utilise la langue de la boutique. Le visiteur peut toutefois sélectionner une autre langue depuis la bannière.'),
                        'options' => array(
                            'query' => $languageOptions,
                            'id' => 'id',
                            'name' => 'name',
                        ),
                    ),
                    array(
                        'type' => 'switch',
                        'label' => $this->l('Google Consent Mode v2'),
                        'name' => 'SYNAPXCC_GCM',
                        'is_bool' => true,
                        'desc' => $this->l('Émet les signaux de consentement Google (valeur « denied » par défaut avant tout choix). Ce mode est requis pour Google Ads dans l\'Union européenne depuis mars 2024.'),
                        'values' => array(
                            array('id' => 'gcm_on', 'value' => 1, 'label' => $this->l('Oui')),
                            array('id' => 'gcm_off', 'value' => 0, 'label' => $this->l('Non')),
                        ),
                    ),
                    array(
                        'type' => 'text',
                        'label' => $this->l('Politique de confidentialité'),
                        'name' => 'SYNAPXCC_PRIVACY_URL',
                        'desc' => $this->l('Lien affiché dans la bannière. Par défaut, le module utilise la page CMS de confidentialité de la boutique si elle existe. Saisissez une URL absolue ou un chemin relatif (/content/...).'),
                    ),
                ),
            ),
        );
    }

    /**
     * @return array
     */
    private function getApiKeyForm()
    {
        return array(
            'form' => array(
                'legend' => array(
                    'title' => $this->l('Preuve de consentement SynapxLab (facultative)'),
                    'icon' => 'icon-key',
                ),
                'description' => $this->l('Sans clé API, le module fonctionne de manière entièrement autonome : la bannière est exécutée localement et aucune donnée de consentement ne quitte la boutique. Avec une clé API, chaque consentement est horodaté et journalisé sur les serveurs SynapxLab afin d\'en constituer une preuve (article 7.1 du RGPD). La clé est disponible depuis un compte SynapxLab sur synapx.fr.'),
                'input' => array(
                    array(
                        'type' => 'text',
                        'label' => $this->l('Clé API SynapxLab'),
                        'name' => 'SYNAPXCC_API_KEY',
                        'desc' => $this->l('Laissez ce champ vide pour un fonctionnement autonome, sans journalisation externe.'),
                    ),
                ),
            ),
        );
    }

    /**
     * @return array
     */
    private function getServicesForm()
    {
        return array(
            'form' => array(
                'legend' => array(
                    'title' => $this->l('Services par catégorie'),
                    'icon' => 'icon-bar-chart',
                ),
                'description' => $this->l('Les services renseignés ci-dessous restent bloqués tant que le visiteur n\'a pas consenti à la catégorie correspondante (statistiques, marketing ou services fonctionnels). Laissez vides les champs des services non utilisés.'),
                'input' => array(
                    array(
                        'type' => 'text',
                        'label' => $this->l('Google Analytics 4 (statistiques)'),
                        'name' => 'SYNAPXCC_GA4',
                        'desc' => $this->l('Identifiant de mesure au format G-XXXXXXXXXX.'),
                    ),
                    array(
                        'type' => 'text',
                        'label' => $this->l('Google Tag Manager (statistiques)'),
                        'name' => 'SYNAPXCC_GTM',
                        'desc' => $this->l('Identifiant de conteneur au format GTM-XXXXXXX.'),
                    ),
                    array(
                        'type' => 'text',
                        'label' => $this->l('Matomo — URL (statistiques)'),
                        'name' => 'SYNAPXCC_MATOMO_URL',
                        'desc' => $this->l('URL de votre instance Matomo, par exemple https://analytics.example.com/.'),
                    ),
                    array(
                        'type' => 'text',
                        'label' => $this->l('Matomo — identifiant de site (statistiques)'),
                        'name' => 'SYNAPXCC_MATOMO_SITE_ID',
                        'desc' => $this->l('Nombre entier requis si l\'URL Matomo est renseignée.'),
                    ),
                    array(
                        'type' => 'text',
                        'label' => $this->l('Facebook Pixel (marketing)'),
                        'name' => 'SYNAPXCC_FB_PIXEL',
                        'desc' => $this->l('Identifiant numérique du pixel.'),
                    ),
                    array(
                        'type' => 'text',
                        'label' => $this->l('Google AdSense (marketing)'),
                        'name' => 'SYNAPXCC_ADSENSE',
                        'desc' => $this->l('Identifiant d\'éditeur au format ca-pub-XXXXXXXXXXXXXXXX.'),
                    ),
                    array(
                        'type' => 'text',
                        'label' => $this->l('Crisp (fonctionnel)'),
                        'name' => 'SYNAPXCC_CRISP',
                        'desc' => $this->l('Identifiant de site Crisp.'),
                    ),
                    array(
                        'type' => 'text',
                        'label' => $this->l('HubSpot (fonctionnel)'),
                        'name' => 'SYNAPXCC_HUBSPOT',
                        'desc' => $this->l('Identifiant numérique de portail HubSpot.'),
                    ),
                ),
                'submit' => array(
                    'title' => $this->l('Enregistrer'),
                ),
            ),
        );
    }

    /**
     * Valeurs courantes du formulaire.
     *
     * @return array
     */
    private function getConfigFormValues()
    {
        return array(
            'SYNAPXCC_ENABLED' => Tools::getValue('SYNAPXCC_ENABLED', Configuration::get('SYNAPXCC_ENABLED')),
            'SYNAPXCC_API_KEY' => Tools::getValue('SYNAPXCC_API_KEY', Configuration::get('SYNAPXCC_API_KEY')),
            'SYNAPXCC_LANGUAGE' => Tools::getValue('SYNAPXCC_LANGUAGE', Configuration::get('SYNAPXCC_LANGUAGE')),
            'SYNAPXCC_GCM' => Tools::getValue('SYNAPXCC_GCM', Configuration::get('SYNAPXCC_GCM')),
            'SYNAPXCC_PRIVACY_URL' => Tools::getValue('SYNAPXCC_PRIVACY_URL', Configuration::get('SYNAPXCC_PRIVACY_URL')),
            'SYNAPXCC_GA4' => Tools::getValue('SYNAPXCC_GA4', Configuration::get('SYNAPXCC_GA4')),
            'SYNAPXCC_GTM' => Tools::getValue('SYNAPXCC_GTM', Configuration::get('SYNAPXCC_GTM')),
            'SYNAPXCC_MATOMO_URL' => Tools::getValue('SYNAPXCC_MATOMO_URL', Configuration::get('SYNAPXCC_MATOMO_URL')),
            'SYNAPXCC_MATOMO_SITE_ID' => Tools::getValue('SYNAPXCC_MATOMO_SITE_ID', Configuration::get('SYNAPXCC_MATOMO_SITE_ID')),
            'SYNAPXCC_FB_PIXEL' => Tools::getValue('SYNAPXCC_FB_PIXEL', Configuration::get('SYNAPXCC_FB_PIXEL')),
            'SYNAPXCC_ADSENSE' => Tools::getValue('SYNAPXCC_ADSENSE', Configuration::get('SYNAPXCC_ADSENSE')),
            'SYNAPXCC_CRISP' => Tools::getValue('SYNAPXCC_CRISP', Configuration::get('SYNAPXCC_CRISP')),
            'SYNAPXCC_HUBSPOT' => Tools::getValue('SYNAPXCC_HUBSPOT', Configuration::get('SYNAPXCC_HUBSPOT')),
        );
    }
}
