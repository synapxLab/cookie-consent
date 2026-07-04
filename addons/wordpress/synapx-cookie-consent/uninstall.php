<?php
/**
 * Nettoyage à la désinstallation du plugin.
 *
 * Supprime les options créées par le plugin. Les choix de consentement des
 * visiteurs sont stockés dans leur navigateur (localStorage) et ne sont pas
 * concernés par cette suppression.
 *
 * @package Synapx_Cookie_Consent
 */

if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}

delete_option( 'scc_settings' );

// Multisite : supprime l'option sur chaque site du réseau.
if ( is_multisite() ) {
	$scc_site_ids = get_sites( array( 'fields' => 'ids' ) );
	foreach ( $scc_site_ids as $scc_site_id ) {
		switch_to_blog( $scc_site_id );
		delete_option( 'scc_settings' );
		restore_current_blog();
	}
}
