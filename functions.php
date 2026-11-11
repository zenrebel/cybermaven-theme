<?php
/**
 * CyberMaven child theme functions.
 *
 * @package cybermaven
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Load the CyberMaven stylesheet on the front end and in the editor.
 */
function cybermaven_enqueue_styles() {
	$path = get_stylesheet_directory() . '/assets/css/cybermaven.css';
	wp_enqueue_style(
		'cybermaven',
		get_stylesheet_directory_uri() . '/assets/css/cybermaven.css',
		array(),
		file_exists( $path ) ? filemtime( $path ) : null
	);
}
add_action( 'wp_enqueue_scripts', 'cybermaven_enqueue_styles' );

/**
 * On-site image viewer for galleries, only on pages that have one.
 */
function cybermaven_enqueue_lightbox() {
	if ( ! is_singular() || ! has_block( 'core/gallery' ) ) {
		return;
	}
	$path = get_stylesheet_directory() . '/assets/js/lightbox.js';
	wp_enqueue_script(
		'cybermaven-lightbox',
		get_stylesheet_directory_uri() . '/assets/js/lightbox.js',
		array(),
		file_exists( $path ) ? filemtime( $path ) : null,
		array(
			'in_footer' => true,
			'strategy'  => 'defer',
		)
	);
}
add_action( 'wp_enqueue_scripts', 'cybermaven_enqueue_lightbox' );

function cybermaven_editor_styles() {
	add_editor_style( 'assets/css/cybermaven.css' );
}
add_action( 'after_setup_theme', 'cybermaven_editor_styles' );

/**
 * Every link to another website opens in a new tab, so visitors never
 * lose their place on cybermaven.net. Covers page content, menus, the
 * footer and anything added later. Links within the site are untouched.
 */
function cybermaven_external_links_new_tab( $block_content ) {
	if ( '' === $block_content || false === stripos( $block_content, '<a' ) || ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
		return $block_content;
	}

	$site_host = wp_parse_url( home_url(), PHP_URL_HOST );
	$site_host = preg_replace( '/^www\./i', '', (string) $site_host );
	$tags      = new WP_HTML_Tag_Processor( $block_content );

	while ( $tags->next_tag( 'a' ) ) {
		$href = $tags->get_attribute( 'href' );
		if ( ! is_string( $href ) || ! preg_match( '#^(https?:)?//#i', $href ) ) {
			continue; // Relative links, anchors, mailto: and tel: stay as they are.
		}

		$host = preg_replace( '/^www\./i', '', (string) wp_parse_url( $href, PHP_URL_HOST ) );
		if ( '' === $host || 0 === strcasecmp( $host, $site_host ) ) {
			continue;
		}

		$tags->set_attribute( 'target', '_blank' );
		$rel = (string) $tags->get_attribute( 'rel' );
		if ( false === stripos( $rel, 'noopener' ) ) {
			$tags->set_attribute( 'rel', trim( $rel . ' noopener' ) );
		}
	}

	return $tags->get_updated_html();
}
add_filter( 'render_block', 'cybermaven_external_links_new_tab' );
