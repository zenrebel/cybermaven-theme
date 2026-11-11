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
