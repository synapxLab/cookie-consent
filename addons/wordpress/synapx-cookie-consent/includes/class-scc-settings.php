<?php
/**
 * Gestion des réglages du plugin (valeurs par défaut, lecture, sanitization).
 *
 * @package Synapx_Cookie_Consent
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Classe utilitaire pour les réglages.
 */
class SCC_Settings {

	/**
	 * Langues supportées par la bannière.
	 *
	 * @return string[] Codes de langue.
	 */
	public static function get_supported_languages() {
		return array( 'ar', 'de', 'en', 'es', 'fr', 'it', 'nl', 'pl', 'pt', 'ro', 'ru', 'sv', 'zh' );
	}

	/**
	 * Thèmes CSS supportés par la bannière.
	 *
	 * @return string[]
	 */
	public static function get_supported_themes() {
		return array( 'default', 'brown', 'dark', 'red' );
	}

	/**
	 * Valeurs par défaut des réglages.
	 *
	 * @return array
	 */
	public static function get_defaults() {
		return array(
			// Mode SynapxLab (optionnel) : clé API pour la preuve de consentement.
			'api_key'              => '',

			// Affichage.
			'language'             => 'auto',
			'theme'                => 'default',

			// Google Consent Mode v2.
			'gcm_enabled'          => 1,

			// Liens légaux (vides = détection automatique / lien inactif).
			'privacy_policy_url'   => '',
			'legal_notices_url'    => '',
			'company_name'         => '',

			// Services par catégorie (vides = catégorie affichée sans service géré).
			'ga_key'               => '',
			'gtm_key'              => '',
			'clarity_project_id'   => '',
			'adsense_key'          => '',
			'facebook_pixel_id'    => '',
			'crisp_website_id'     => '',
			'intercom_app_id'      => '',
		);
	}

	/**
	 * Retourne les réglages fusionnés avec les valeurs par défaut.
	 *
	 * @return array
	 */
	public static function get_settings() {
		$saved = get_option( SCC_OPTION_NAME, array() );
		if ( ! is_array( $saved ) ) {
			$saved = array();
		}
		return wp_parse_args( $saved, self::get_defaults() );
	}

	/**
	 * Sanitize les réglages soumis via la Settings API.
	 *
	 * @param mixed $input Données brutes.
	 * @return array Données nettoyées.
	 */
	public static function sanitize( $input ) {
		$defaults = self::get_defaults();
		$output   = array();

		if ( ! is_array( $input ) ) {
			return $defaults;
		}

		$output['api_key'] = isset( $input['api_key'] ) ? sanitize_text_field( $input['api_key'] ) : '';

		$language           = isset( $input['language'] ) ? sanitize_key( $input['language'] ) : 'auto';
		$output['language'] = ( 'auto' === $language || in_array( $language, self::get_supported_languages(), true ) ) ? $language : 'auto';

		$theme           = isset( $input['theme'] ) ? sanitize_key( $input['theme'] ) : 'default';
		$output['theme'] = in_array( $theme, self::get_supported_themes(), true ) ? $theme : 'default';

		$output['gcm_enabled'] = empty( $input['gcm_enabled'] ) ? 0 : 1;

		$output['privacy_policy_url'] = isset( $input['privacy_policy_url'] ) ? esc_url_raw( trim( (string) $input['privacy_policy_url'] ) ) : '';
		$output['legal_notices_url']  = isset( $input['legal_notices_url'] ) ? esc_url_raw( trim( (string) $input['legal_notices_url'] ) ) : '';
		$output['company_name']       = isset( $input['company_name'] ) ? sanitize_text_field( $input['company_name'] ) : '';

		foreach ( array( 'ga_key', 'gtm_key', 'clarity_project_id', 'adsense_key', 'facebook_pixel_id', 'crisp_website_id', 'intercom_app_id' ) as $key ) {
			$output[ $key ] = isset( $input[ $key ] ) ? sanitize_text_field( $input[ $key ] ) : '';
		}

		return wp_parse_args( $output, $defaults );
	}

	/**
	 * Construit la configuration JavaScript passée à window.CookieConsent.init().
	 *
	 * @return array
	 */
	public static function build_js_config() {
		$settings = self::get_settings();
		$config   = array();

		// Mode AVEC clé API : active la télémétrie / preuve de consentement
		// vers le service SynapxLab. Sans clé, aucun logger n'est configuré :
		// le plugin fonctionne en autonomie complète.
		if ( '' !== $settings['api_key'] ) {
			$config['logger'] = array(
				'enabled' => true,
				'apiKey'  => $settings['api_key'],
			);
		}

		// Liens légaux : la politique de confidentialité WordPress sert de repli.
		$privacy_url = $settings['privacy_policy_url'];
		if ( '' === $privacy_url && function_exists( 'get_privacy_policy_url' ) ) {
			$privacy_url = (string) get_privacy_policy_url();
		}

		$company = array();
		if ( '' !== $settings['company_name'] ) {
			$company['name'] = $settings['company_name'];
		} else {
			$company['auto'] = true;
		}
		if ( '' !== $privacy_url ) {
			$company['privacypolicy'] = $privacy_url;
		}
		if ( '' !== $settings['legal_notices_url'] ) {
			$company['legalnotices'] = $settings['legal_notices_url'];
		}
		$config['company'] = $company;

		$config['google_consent_mode'] = array(
			'enabled' => (bool) $settings['gcm_enabled'],
		);

		$statistics = array();
		if ( '' !== $settings['ga_key'] ) {
			$statistics['google_analytics_key'] = $settings['ga_key'];
		}
		if ( '' !== $settings['gtm_key'] ) {
			$statistics['google_tag_manager_key'] = $settings['gtm_key'];
		}
		if ( '' !== $settings['clarity_project_id'] ) {
			$statistics['clarity_project_id'] = $settings['clarity_project_id'];
		}
		if ( ! empty( $statistics ) ) {
			$config['statistics'] = $statistics;
		}

		$marketing = array();
		if ( '' !== $settings['adsense_key'] ) {
			$marketing['google_adsense_key'] = $settings['adsense_key'];
		}
		if ( '' !== $settings['facebook_pixel_id'] ) {
			$marketing['facebook_pixel'] = array(
				'key'   => $settings['facebook_pixel_id'],
				'track' => 'PageView',
			);
		}
		if ( ! empty( $marketing ) ) {
			$config['marketing'] = $marketing;
		}

		$functional = array();
		if ( '' !== $settings['crisp_website_id'] ) {
			$functional['crisp_website_id'] = $settings['crisp_website_id'];
		}
		if ( '' !== $settings['intercom_app_id'] ) {
			$functional['intercom_app_id'] = $settings['intercom_app_id'];
		}
		if ( ! empty( $functional ) ) {
			$config['functional'] = $functional;
		}

		/**
		 * Filtre la configuration passée à window.CookieConsent.init().
		 *
		 * @param array $config Configuration JavaScript.
		 */
		return apply_filters( 'scc_js_config', $config );
	}
}
