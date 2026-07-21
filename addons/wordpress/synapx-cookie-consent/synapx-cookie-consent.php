<?php
/**
 * Plugin Name:       Synapx Cookie Consent
 * Plugin URI:        https://synapx.fr/sdk/cookie_consent/
 * Description:       Bannière de consentement aux cookies conforme RGPD/CNIL. Blocage automatique des scripts tiers, Google Consent Mode v2, 13 langues. Fonctionne en autonomie complète ou avec une clé API optionnelle pour la preuve de consentement.
 * Version:           1.0.2
 * Requires at least: 5.8
 * Requires PHP:      7.4
 * Author:            SynapxLab
 * Author URI:        https://synapx.fr/
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       synapx-cookie-consent
 * Domain Path:       /languages
 *
 * @package Synapx_Cookie_Consent
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'SCC_VERSION', '1.0.2' );
define( 'SCC_BANNER_VERSION', '2.6.0' ); // Version du bundle JS embarqué (dist/cookie.js).
define( 'SCC_PLUGIN_FILE', __FILE__ );
define( 'SCC_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'SCC_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'SCC_OPTION_NAME', 'scc_settings' );

require_once SCC_PLUGIN_DIR . 'includes/class-scc-settings.php';
require_once SCC_PLUGIN_DIR . 'includes/class-scc-frontend.php';

if ( is_admin() ) {
	require_once SCC_PLUGIN_DIR . 'admin/class-scc-admin.php';
}

/**
 * Initialise le plugin.
 *
 * @return void
 */
function scc_init() {
	load_plugin_textdomain( 'synapx-cookie-consent', false, dirname( plugin_basename( SCC_PLUGIN_FILE ) ) . '/languages' );

	SCC_Frontend::get_instance();

	if ( is_admin() ) {
		SCC_Admin::get_instance();
	}
}
add_action( 'plugins_loaded', 'scc_init' );

/**
 * À l'activation : enregistre les options par défaut si absentes.
 *
 * @return void
 */
function scc_activate() {
	if ( false === get_option( SCC_OPTION_NAME, false ) ) {
		add_option( SCC_OPTION_NAME, SCC_Settings::get_defaults() );
	}
}
register_activation_hook( __FILE__, 'scc_activate' );

/**
 * Lien "Réglages" sur la page des extensions.
 *
 * @param string[] $links Liens existants.
 * @return string[]
 */
function scc_plugin_action_links( $links ) {
	$settings_link = sprintf(
		'<a href="%s">%s</a>',
		esc_url( admin_url( 'options-general.php?page=synapx-cookie-consent' ) ),
		esc_html__( 'Réglages', 'synapx-cookie-consent' )
	);
	array_unshift( $links, $settings_link );
	return $links;
}
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'scc_plugin_action_links' );
