<?php
/**
 * Plugin Name: Quiz Fou - Scores
 * Description: Custom Post Type et champs ACF pour stocker les scores du Quizz Fou.
 * Version: 1.0.0
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

/* ------------------------------------------------------------------ */
/*  1. Custom Post Type : quiz_score                                  */
/* ------------------------------------------------------------------ */
add_action( 'init', function () {
	register_post_type( 'quiz_score', [
		'labels'       => [
			'name'          => 'Scores Quiz',
			'singular_name' => 'Score Quiz',
		],
		'public'       => false,
		'show_ui'      => true,
		'show_in_menu' => true,
		'show_in_rest' => true,           // expose via REST API
		'rest_base'    => 'quiz-scores',  // /wp-json/wp/v2/quiz-scores
		'menu_icon'    => 'dashicons-chart-bar',
		'supports'     => [ 'title' ],    // title = pseudo du joueur
	] );
} );

/* ------------------------------------------------------------------ */
/*  2. Champs ACF (enregistrement PHP — pas besoin de JSON)           */
/*     Fonctionne avec ACF Free ≥ 5.0                                */
/* ------------------------------------------------------------------ */
add_action( 'acf/init', function () {
	if ( ! function_exists( 'acf_add_local_field_group' ) ) {
		return;
	}

	acf_add_local_field_group( [
		'key'      => 'group_quiz_score',
		'title'    => 'Données du Score',
		'fields'   => [
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
		],
		'location' => [
			[
				[
					'param'    => 'post_type',
					'operator' => '==',
					'value'    => 'quiz_score',
				],
			],
		],
		'show_in_rest' => true,
	] );
} );

/* ------------------------------------------------------------------ */
/*  3. Exposer les champs ACF dans la REST API                        */
/* ------------------------------------------------------------------ */
add_action( 'rest_api_init', function () {
	// Ajouter les champs ACF à la réponse REST du CPT quiz_score
	register_rest_field( 'quiz_score', 'acf', [
		'get_callback' => function ( $post ) {
			return get_fields( $post['id'] ) ?: [];
		},
		'schema'       => null,
	] );
} );

/* ------------------------------------------------------------------ */
/*  4. Permettre la création de quiz_score sans être admin             */
/*     On vérifie simplement que la requête est authentifiée.          */
/* ------------------------------------------------------------------ */
add_filter( 'rest_pre_insert_quiz_score', function ( $prepared, $request ) {
	return $prepared;
}, 10, 2 );

/* Autoriser les utilisateurs authentifiés à créer des scores */
add_filter( 'map_meta_cap', function ( $caps, $cap, $user_id, $args ) {
	if ( in_array( $cap, [ 'edit_quiz_scores', 'publish_quiz_scores', 'edit_published_quiz_scores' ], true ) ) {
		return [ 'read' ];
	}
	return $caps;
}, 10, 4 );

/* ------------------------------------------------------------------ */
/*  5. Auto-remplir le titre du post avec le pseudo                   */
/* ------------------------------------------------------------------ */
add_action( 'acf/save_post', function ( $post_id ) {
	if ( get_post_type( $post_id ) !== 'quiz_score' ) {
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
