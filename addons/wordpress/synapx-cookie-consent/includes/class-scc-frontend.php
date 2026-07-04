<?php
/**
 * Injection de la bannière côté public.
 *
 * @package Synapx_Cookie_Consent
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Charge le script de la bannière et sa configuration.
 */
class SCC_Frontend {

	/**
	 * Instance unique.
	 *
	 * @var SCC_Frontend|null
	 */
	private static $instance = null;

	/**
	 * Retourne l'instance unique.
	 *
	 * @return SCC_Frontend
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
		// Priorité 1 : le script de consentement doit être enregistré avant
		// les autres scripts afin d'être imprimé en premier dans wp_head.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ), 1 );
		add_filter( 'body_class', array( $this, 'add_theme_body_class' ) );
	}

	/**
	 * Charge dist/cookie.js (embarqué localement) et la configuration inline.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		if ( is_admin() ) {
			return;
		}

		wp_enqueue_script(
			'synapx-cookie-consent',
			SCC_PLUGIN_URL . 'assets/js/cookie.js',
			array(),
			SCC_BANNER_VERSION,
			false // Dans <head> : la bannière doit bloquer les scripts tiers au plus tôt.
		);

		// Mode sans clé API : coupe la télémétrie de version du SDK pour un
		// fonctionnement strictement sans donnée sortante. Le drapeau doit être
		// défini AVANT le bundle, d'où la position « before ».
		$settings = SCC_Settings::get_settings();
		if ( '' === trim( (string) $settings['api_key'] ) ) {
			wp_add_inline_script(
				'synapx-cookie-consent',
				'window.SynapxCookieConsentNoTelemetry=true;',
				'before'
			);
		}

		wp_add_inline_script( 'synapx-cookie-consent', $this->get_bootstrap_script(), 'after' );
	}

	/**
	 * Construit le script inline d'initialisation.
	 *
	 * @return string
	 */
	private function get_bootstrap_script() {
		$settings = SCC_Settings::get_settings();
		$config   = SCC_Settings::build_js_config();

		// init() insère la bannière dans document.body (renderOnce) : appelé
		// depuis <head>, document.body n'existe pas encore et l'erreur est
		// avalée par le SDK — la bannière ne s'afficherait jamais. On diffère
		// donc l'initialisation jusqu'à DOMContentLoaded.
		$script  = '(function(){';
		$script .= 'function boot(){';
		$script .= 'if(!window.CookieConsent){return;}';
		$script .= 'window.CookieConsent.init(' . wp_json_encode( $config ) . ');';

		// Langue forcée : la bannière détecte navigator.language par défaut.
		// On applique le choix via le sélecteur de langue intégré à la bannière
		// (rendu par init() juste au-dessus).
		if ( 'auto' !== $settings['language'] ) {
			$script .= 'var s=document.getElementById("pmcpli-lang-select");';
			$script .= 'if(s&&s.value!==' . wp_json_encode( $settings['language'] ) . '){';
			$script .= 's.value=' . wp_json_encode( $settings['language'] ) . ';';
			$script .= 's.dispatchEvent(new Event("change",{bubbles:true}));';
			$script .= '}';
		}

		$script .= '}';
		$script .= 'if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",boot);}else{boot();}';
		$script .= '})();';

		return $script;
	}

	/**
	 * Applique le thème CSS de la bannière via une classe sur <body>.
	 *
	 * @param string[] $classes Classes existantes.
	 * @return string[]
	 */
	public function add_theme_body_class( $classes ) {
		$settings = SCC_Settings::get_settings();
		$theme    = $settings['theme'];

		if ( 'default' !== $theme && in_array( $theme, SCC_Settings::get_supported_themes(), true ) ) {
			$classes[] = 'cookie-theme-' . sanitize_html_class( $theme );
		}

		return $classes;
	}
}
