<?php
/**
 * Page de réglages (Settings API).
 *
 * @package Synapx_Cookie_Consent
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Écran d'administration du plugin.
 */
class SCC_Admin {

	/**
	 * Instance unique.
	 *
	 * @var SCC_Admin|null
	 */
	private static $instance = null;

	/**
	 * Retourne l'instance unique.
	 *
	 * @return SCC_Admin
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructeur : enregistre les hooks.
	 */
	private function __construct() {
		add_action( 'admin_menu', array( $this, 'add_settings_page' ) );
		add_action( 'admin_init', array( $this, 'register_settings' ) );
	}

	/**
	 * Ajoute la page dans Réglages.
	 *
	 * @return void
	 */
	public function add_settings_page() {
		add_options_page(
			__( 'Synapx Cookie Consent', 'synapx-cookie-consent' ),
			__( 'Cookie Consent', 'synapx-cookie-consent' ),
			'manage_options',
			'synapx-cookie-consent',
			array( $this, 'render_settings_page' )
		);
	}

	/**
	 * Déclare les réglages, sections et champs.
	 *
	 * @return void
	 */
	public function register_settings() {
		register_setting(
			'scc_settings_group',
			SCC_OPTION_NAME,
			array(
				'type'              => 'array',
				'sanitize_callback' => array( 'SCC_Settings', 'sanitize' ),
				'default'           => SCC_Settings::get_defaults(),
			)
		);

		// Section : mode de fonctionnement (clé API optionnelle).
		add_settings_section(
			'scc_section_mode',
			__( 'Mode de fonctionnement', 'synapx-cookie-consent' ),
			array( $this, 'render_section_mode' ),
			'synapx-cookie-consent'
		);

		add_settings_field(
			'scc_api_key',
			__( 'Clé API SynapxLab (optionnelle)', 'synapx-cookie-consent' ),
			array( $this, 'render_field_api_key' ),
			'synapx-cookie-consent',
			'scc_section_mode',
			array( 'label_for' => 'scc_api_key' )
		);

		// Section : affichage.
		add_settings_section(
			'scc_section_display',
			__( 'Affichage de la bannière', 'synapx-cookie-consent' ),
			array( $this, 'render_section_display' ),
			'synapx-cookie-consent'
		);

		add_settings_field(
			'scc_language',
			__( 'Langue', 'synapx-cookie-consent' ),
			array( $this, 'render_field_language' ),
			'synapx-cookie-consent',
			'scc_section_display',
			array( 'label_for' => 'scc_language' )
		);

		add_settings_field(
			'scc_theme',
			__( 'Thème', 'synapx-cookie-consent' ),
			array( $this, 'render_field_theme' ),
			'synapx-cookie-consent',
			'scc_section_display',
			array( 'label_for' => 'scc_theme' )
		);

		// Section : conformité.
		add_settings_section(
			'scc_section_legal',
			__( 'Informations légales', 'synapx-cookie-consent' ),
			array( $this, 'render_section_legal' ),
			'synapx-cookie-consent'
		);

		add_settings_field(
			'scc_company_name',
			__( 'Nom de l\'organisation', 'synapx-cookie-consent' ),
			array( $this, 'render_field_company_name' ),
			'synapx-cookie-consent',
			'scc_section_legal',
			array( 'label_for' => 'scc_company_name' )
		);

		add_settings_field(
			'scc_privacy_policy_url',
			__( 'Politique de confidentialité', 'synapx-cookie-consent' ),
			array( $this, 'render_field_privacy_policy_url' ),
			'synapx-cookie-consent',
			'scc_section_legal',
			array( 'label_for' => 'scc_privacy_policy_url' )
		);

		add_settings_field(
			'scc_legal_notices_url',
			__( 'Mentions légales', 'synapx-cookie-consent' ),
			array( $this, 'render_field_legal_notices_url' ),
			'synapx-cookie-consent',
			'scc_section_legal',
			array( 'label_for' => 'scc_legal_notices_url' )
		);

		// Section : Google Consent Mode v2.
		add_settings_section(
			'scc_section_gcm',
			__( 'Google Consent Mode v2', 'synapx-cookie-consent' ),
			array( $this, 'render_section_gcm' ),
			'synapx-cookie-consent'
		);

		add_settings_field(
			'scc_gcm_enabled',
			__( 'Activer Google Consent Mode v2', 'synapx-cookie-consent' ),
			array( $this, 'render_field_gcm_enabled' ),
			'synapx-cookie-consent',
			'scc_section_gcm',
			array( 'label_for' => 'scc_gcm_enabled' )
		);

		// Section : services par catégorie.
		add_settings_section(
			'scc_section_services',
			__( 'Services soumis au consentement', 'synapx-cookie-consent' ),
			array( $this, 'render_section_services' ),
			'synapx-cookie-consent'
		);

		$service_fields = array(
			'ga_key'             => __( 'Google Analytics 4 (statistiques)', 'synapx-cookie-consent' ),
			'gtm_key'            => __( 'Google Tag Manager (statistiques)', 'synapx-cookie-consent' ),
			'clarity_project_id' => __( 'Microsoft Clarity (statistiques)', 'synapx-cookie-consent' ),
			'adsense_key'        => __( 'Google AdSense (marketing)', 'synapx-cookie-consent' ),
			'facebook_pixel_id'  => __( 'Facebook Pixel (marketing)', 'synapx-cookie-consent' ),
			'crisp_website_id'   => __( 'Crisp (fonctionnel)', 'synapx-cookie-consent' ),
			'intercom_app_id'    => __( 'Intercom (fonctionnel)', 'synapx-cookie-consent' ),
		);

		foreach ( $service_fields as $key => $label ) {
			add_settings_field(
				'scc_' . $key,
				$label,
				array( $this, 'render_field_service' ),
				'synapx-cookie-consent',
				'scc_section_services',
				array(
					'label_for' => 'scc_' . $key,
					'key'       => $key,
				)
			);
		}
	}

	/**
	 * Affiche la page de réglages.
	 *
	 * @return void
	 */
	public function render_settings_page() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		?>
		<div class="wrap">
			<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
			<form action="options.php" method="post">
				<?php
				settings_fields( 'scc_settings_group' );
				do_settings_sections( 'synapx-cookie-consent' );
				submit_button( __( 'Enregistrer les réglages', 'synapx-cookie-consent' ) );
				?>
			</form>
		</div>
		<?php
	}

	/**
	 * Introduction de la section mode.
	 *
	 * @return void
	 */
	public function render_section_mode() {
		echo '<p>' . esc_html__( 'Le plugin propose deux modes de fonctionnement :', 'synapx-cookie-consent' ) . '</p>';
		echo '<ul style="list-style:disc;margin-left:20px;">';
		echo '<li>' . esc_html__( 'Sans clé API : la bannière fonctionne de manière entièrement autonome. Les choix des visiteurs sont enregistrés uniquement dans leur navigateur et aucune donnée n\'est transmise à un service tiers.', 'synapx-cookie-consent' ) . '</li>';
		echo '<li>' . esc_html__( 'Avec une clé API : les actions de consentement (acceptation, refus et modification) sont journalisées par le service SynapxLab afin de constituer une preuve de consentement (article 7.1 du RGPD). La clé API est disponible depuis l\'espace membre SynapxLab.', 'synapx-cookie-consent' ) . '</li>';
		echo '</ul>';
	}

	/**
	 * Champ : clé API.
	 *
	 * @return void
	 */
	public function render_field_api_key() {
		$settings = SCC_Settings::get_settings();
		printf(
			'<input type="text" id="scc_api_key" name="%s[api_key]" value="%s" class="regular-text" autocomplete="off" />',
			esc_attr( SCC_OPTION_NAME ),
			esc_attr( $settings['api_key'] )
		);
		echo '<p class="description">' . esc_html__( 'Laissez ce champ vide pour un fonctionnement entièrement autonome, sans transmission de données liées au consentement.', 'synapx-cookie-consent' ) . '</p>';
	}

	/**
	 * Introduction de la section affichage.
	 *
	 * @return void
	 */
	public function render_section_display() {
		echo '<p>' . esc_html__( 'La bibliothèque affiche la bannière en position fixe, au bas de la page. Un bouton flottant permet ensuite aux visiteurs de modifier leur choix à tout moment.', 'synapx-cookie-consent' ) . '</p>';
	}

	/**
	 * Champ : langue.
	 *
	 * @return void
	 */
	public function render_field_language() {
		$settings  = SCC_Settings::get_settings();
		$languages = array(
			'auto' => __( 'Automatique (langue du navigateur)', 'synapx-cookie-consent' ),
			'fr'   => __( 'Français', 'synapx-cookie-consent' ),
			'en'   => __( 'Anglais', 'synapx-cookie-consent' ),
			'es'   => __( 'Espagnol', 'synapx-cookie-consent' ),
			'de'   => __( 'Allemand', 'synapx-cookie-consent' ),
			'it'   => __( 'Italien', 'synapx-cookie-consent' ),
			'nl'   => __( 'Néerlandais', 'synapx-cookie-consent' ),
			'pt'   => __( 'Portugais', 'synapx-cookie-consent' ),
			'pl'   => __( 'Polonais', 'synapx-cookie-consent' ),
			'ro'   => __( 'Roumain', 'synapx-cookie-consent' ),
			'ru'   => __( 'Russe', 'synapx-cookie-consent' ),
			'sv'   => __( 'Suédois', 'synapx-cookie-consent' ),
			'ar'   => __( 'Arabe', 'synapx-cookie-consent' ),
			'zh'   => __( 'Chinois', 'synapx-cookie-consent' ),
		);

		printf( '<select id="scc_language" name="%s[language]">', esc_attr( SCC_OPTION_NAME ) );
		foreach ( $languages as $code => $label ) {
			printf(
				'<option value="%s" %s>%s</option>',
				esc_attr( $code ),
				selected( $settings['language'], $code, false ),
				esc_html( $label )
			);
		}
		echo '</select>';
		echo '<p class="description">' . esc_html__( 'En mode automatique, la bannière utilise la langue du navigateur du visiteur. Le sélecteur de langue reste disponible dans la bannière.', 'synapx-cookie-consent' ) . '</p>';
	}

	/**
	 * Champ : thème.
	 *
	 * @return void
	 */
	public function render_field_theme() {
		$settings = SCC_Settings::get_settings();
		$themes   = array(
			'default' => __( 'Défaut (clair)', 'synapx-cookie-consent' ),
			'brown'   => __( 'Brun', 'synapx-cookie-consent' ),
			'dark'    => __( 'Sombre', 'synapx-cookie-consent' ),
			'red'     => __( 'Rouge', 'synapx-cookie-consent' ),
		);

		printf( '<select id="scc_theme" name="%s[theme]">', esc_attr( SCC_OPTION_NAME ) );
		foreach ( $themes as $slug => $label ) {
			printf(
				'<option value="%s" %s>%s</option>',
				esc_attr( $slug ),
				selected( $settings['theme'], $slug, false ),
				esc_html( $label )
			);
		}
		echo '</select>';
		echo '<p class="description">' . esc_html__( 'Vous pouvez personnaliser les couleurs de la bannière dans votre thème au moyen des variables CSS --cc-*.', 'synapx-cookie-consent' ) . '</p>';
	}

	/**
	 * Introduction de la section légale.
	 *
	 * @return void
	 */
	public function render_section_legal() {
		echo '<p>' . esc_html__( 'Ces liens apparaissent dans la bannière. Si le champ « Politique de confidentialité » est vide, le plugin utilise la page définie dans Réglages → Confidentialité.', 'synapx-cookie-consent' ) . '</p>';
	}

	/**
	 * Champ : nom de l'organisation.
	 *
	 * @return void
	 */
	public function render_field_company_name() {
		$settings = SCC_Settings::get_settings();
		printf(
			'<input type="text" id="scc_company_name" name="%s[company_name]" value="%s" class="regular-text" />',
			esc_attr( SCC_OPTION_NAME ),
			esc_attr( $settings['company_name'] )
		);
		echo '<p class="description">' . esc_html__( 'Nom affiché dans la bannière. Laissez ce champ vide pour utiliser automatiquement le titre du site.', 'synapx-cookie-consent' ) . '</p>';
	}

	/**
	 * Champ : URL politique de confidentialité.
	 *
	 * @return void
	 */
	public function render_field_privacy_policy_url() {
		$settings = SCC_Settings::get_settings();
		printf(
			'<input type="url" id="scc_privacy_policy_url" name="%s[privacy_policy_url]" value="%s" class="regular-text" placeholder="%s" />',
			esc_attr( SCC_OPTION_NAME ),
			esc_attr( $settings['privacy_policy_url'] ),
			esc_attr( get_privacy_policy_url() )
		);
		echo '<p class="description">' . esc_html__( 'URL de votre politique de confidentialité. Laissez ce champ vide pour utiliser la page de confidentialité définie dans WordPress.', 'synapx-cookie-consent' ) . '</p>';
	}

	/**
	 * Champ : URL mentions légales.
	 *
	 * @return void
	 */
	public function render_field_legal_notices_url() {
		$settings = SCC_Settings::get_settings();
		printf(
			'<input type="url" id="scc_legal_notices_url" name="%s[legal_notices_url]" value="%s" class="regular-text" />',
			esc_attr( SCC_OPTION_NAME ),
			esc_attr( $settings['legal_notices_url'] )
		);
		echo '<p class="description">' . esc_html__( 'URL de votre page de mentions légales (facultative).', 'synapx-cookie-consent' ) . '</p>';
	}

	/**
	 * Introduction de la section GCM.
	 *
	 * @return void
	 */
	public function render_section_gcm() {
		echo '<p>' . esc_html__( 'Google Consent Mode v2 transmet l\'état du consentement aux services Google (Analytics et Ads). Les signaux sont définis sur « refusé » par défaut, puis actualisés selon le choix du visiteur. Ce mode est requis pour Google Ads dans l\'Union européenne depuis mars 2024.', 'synapx-cookie-consent' ) . '</p>';
	}

	/**
	 * Champ : activation GCM.
	 *
	 * @return void
	 */
	public function render_field_gcm_enabled() {
		$settings = SCC_Settings::get_settings();
		printf(
			'<label><input type="checkbox" id="scc_gcm_enabled" name="%s[gcm_enabled]" value="1" %s /> %s</label>',
			esc_attr( SCC_OPTION_NAME ),
			checked( $settings['gcm_enabled'], 1, false ),
			esc_html__( 'Émettre les signaux Google Consent Mode v2', 'synapx-cookie-consent' )
		);
	}

	/**
	 * Introduction de la section services.
	 *
	 * @return void
	 */
	public function render_section_services() {
		echo '<p>' . esc_html__( 'Renseignez uniquement les identifiants des services utilisés. Chaque service est chargé après que le visiteur a consenti à la catégorie correspondante (statistiques, marketing ou services fonctionnels). Les champs vides sont ignorés.', 'synapx-cookie-consent' ) . '</p>';
		echo '<p>' . esc_html__( 'Vous pouvez également bloquer manuellement d\'autres scripts dans votre thème avec type="text/plain" et l\'attribut data-cookie-category.', 'synapx-cookie-consent' ) . '</p>';
	}

	/**
	 * Champ générique : identifiant de service.
	 *
	 * @param array $args Arguments du champ (clé "key").
	 * @return void
	 */
	public function render_field_service( $args ) {
		$settings = SCC_Settings::get_settings();
		$key      = isset( $args['key'] ) ? $args['key'] : '';

		if ( '' === $key || ! array_key_exists( $key, $settings ) ) {
			return;
		}

		$placeholders = array(
			'ga_key'             => 'G-XXXXXXXXXX',
			'gtm_key'            => 'GTM-XXXXXXX',
			'clarity_project_id' => '',
			'adsense_key'        => 'ca-pub-XXXXXXXXXXXXXXXX',
			'facebook_pixel_id'  => '',
			'crisp_website_id'   => '',
			'intercom_app_id'    => '',
		);

		printf(
			'<input type="text" id="scc_%1$s" name="%2$s[%1$s]" value="%3$s" class="regular-text" placeholder="%4$s" autocomplete="off" />',
			esc_attr( $key ),
			esc_attr( SCC_OPTION_NAME ),
			esc_attr( $settings[ $key ] ),
			esc_attr( isset( $placeholders[ $key ] ) ? $placeholders[ $key ] : '' )
		);
	}
}
