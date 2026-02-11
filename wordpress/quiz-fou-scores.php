<?php
/**
 * Plugin Name: Comme des Fous - Scores
 * Description: Custom Post Types et champs ACF pour stocker les scores des jeux (Quizz Fou + DSM-6).
 * Version: 2.0.0
 * Requires PHP: 7.4
 *
 * Instructions :
 *   1. Copier ce fichier dans wp-content/plugins/quiz-fou-scores/
 *   2. Activer le plugin dans WordPress
 *   3. Installer et activer ACF (Advanced Custom Fields) version gratuite
 *   4. Les champs ACF sont enregistrés automatiquement par ce plugin
 *   5. Créer un mot de passe d'application dans WordPress :
 *      Utilisateurs → votre profil → Mots de passe d'application
 *   6. Configurer les variables d'environnement dans Next.js (.env.local) :
 *        WORDPRESS_URL=https://votre-site.com
 *        WORDPRESS_USER=admin
 *        WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* ================================================================== */
/*  Score fields shared by all game CPTs                               */
/* ================================================================== */
function cdf_score_fields() {
	return [
		[
			'key'   => 'field_player_pseudo',
			'label' => 'Pseudo',
			'name'  => 'player_pseudo',
			'type'  => 'text',
		],
		[
			'key'   => 'field_player_score',
			'label' => 'Score',
			'name'  => 'player_score',
			'type'  => 'number',
		],
		[
			'key'   => 'field_player_title',
			'label' => 'Titre',
			'name'  => 'player_title',
			'type'  => 'text',
		],
		[
			'key'   => 'field_score_date',
			'label' => 'Date',
			'name'  => 'score_date',
			'type'  => 'text',
		],
		[
			'key'          => 'field_player_answers',
			'label'        => 'Réponses (JSON)',
			'name'         => 'player_answers',
			'type'         => 'textarea',
			'instructions' => 'JSON encodé des réponses du joueur.',
		],
	];
}

/* ================================================================== */
/*  1. Custom Post Types                                               */
/* ================================================================== */
add_action( 'init', function () {
	// Quizz Fou scores
	register_post_type( 'quiz_score', [
		'labels'       => [
			'name'          => 'Scores Quiz Fou',
			'singular_name' => 'Score Quiz Fou',
		],
		'public'       => false,
		'show_ui'      => true,
		'show_in_menu' => true,
		'show_in_rest' => true,
		'rest_base'    => 'quiz-scores',
		'menu_icon'    => 'dashicons-chart-bar',
		'supports'     => [ 'title' ],
	] );

	// DSM-6 scores
	register_post_type( 'dsm6_score', [
		'labels'       => [
			'name'          => 'Scores DSM-6',
			'singular_name' => 'Score DSM-6',
		],
		'public'       => false,
		'show_ui'      => true,
		'show_in_menu' => true,
		'show_in_rest' => true,
		'rest_base'    => 'dsm6-scores',
		'menu_icon'    => 'dashicons-heart',
		'supports'     => [ 'title' ],
	] );
} );

/* ================================================================== */
/*  2. Champs ACF (PHP, fonctionne avec ACF Free ≥ 5.0)               */
/* ================================================================== */
add_action( 'acf/init', function () {
	if ( ! function_exists( 'acf_add_local_field_group' ) ) {
		return;
	}

	$fields = cdf_score_fields();

	// Quiz Fou
	acf_add_local_field_group( [
		'key'          => 'group_quiz_score',
		'title'        => 'Données du Score — Quiz Fou',
		'fields'       => $fields,
		'location'     => [ [ [ 'param' => 'post_type', 'operator' => '==', 'value' => 'quiz_score' ] ] ],
		'show_in_rest' => true,
	] );

	// DSM-6 (réutilise les mêmes champs avec des clés uniques)
	$dsm6_fields = array_map( function ( $f ) {
		$f['key'] = str_replace( 'field_', 'field_dsm6_', $f['key'] );
		return $f;
	}, $fields );

	acf_add_local_field_group( [
		'key'          => 'group_dsm6_score',
		'title'        => 'Données du Score — DSM-6',
		'fields'       => $dsm6_fields,
		'location'     => [ [ [ 'param' => 'post_type', 'operator' => '==', 'value' => 'dsm6_score' ] ] ],
		'show_in_rest' => true,
	] );
} );

/* ================================================================== */
/*  3. Exposer les champs ACF dans la REST API                         */
/* ================================================================== */
add_action( 'rest_api_init', function () {
	foreach ( [ 'quiz_score', 'dsm6_score' ] as $cpt ) {
		register_rest_field( $cpt, 'acf', [
			'get_callback' => function ( $post ) {
				return get_fields( $post['id'] ) ?: [];
			},
			'schema'       => null,
		] );
	}
} );

/* ================================================================== */
/*  4. Permissions : autoriser la création via API authentifiée         */
/* ================================================================== */
add_filter( 'map_meta_cap', function ( $caps, $cap ) {
	$allowed = [
		'edit_quiz_scores', 'publish_quiz_scores', 'edit_published_quiz_scores',
		'edit_dsm6_scores', 'publish_dsm6_scores', 'edit_published_dsm6_scores',
	];
	if ( in_array( $cap, $allowed, true ) ) {
		return [ 'read' ];
	}
	return $caps;
}, 10, 4 );

/* ================================================================== */
/*  5. Auto-remplir le titre du post avec le pseudo                    */
/* ================================================================== */
add_action( 'acf/save_post', function ( $post_id ) {
	$type = get_post_type( $post_id );
	if ( ! in_array( $type, [ 'quiz_score', 'dsm6_score' ], true ) ) {
		return;
	}
	$pseudo = get_field( 'player_pseudo', $post_id );
	$score  = get_field( 'player_score', $post_id );
	if ( $pseudo ) {
		wp_update_post( [
			'ID'         => $post_id,
			'post_title' => sprintf( '%s — %d pts', $pseudo, $score ?: 0 ),
		] );
	}
} );
