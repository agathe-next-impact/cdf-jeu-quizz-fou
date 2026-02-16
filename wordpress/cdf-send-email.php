<?php
/**
 * Plugin Name: CDF Send Email
 * Description: Endpoint REST pour envoyer des emails via wp_mail (utilisé par le quiz app).
 * Version: 1.0
 */

add_action('rest_api_init', function () {
    register_rest_route('cdf/v1', '/send-email', [
        'methods'  => 'POST',
        'callback' => 'cdf_send_email_handler',
        'permission_callback' => function ($request) {
            return current_user_can('edit_posts');
        },
    ]);
});

function cdf_send_email_handler(WP_REST_Request $request) {
    $to      = sanitize_email($request->get_param('to'));
    $subject = sanitize_text_field($request->get_param('subject'));
    $body    = wp_kses_post($request->get_param('body'));

    if (empty($to) || empty($subject) || empty($body)) {
        return new WP_REST_Response(['error' => 'Champs requis : to, subject, body'], 400);
    }

    $headers = ['Content-Type: text/html; charset=UTF-8'];
    $sent = wp_mail($to, $subject, $body, $headers);

    if (!$sent) {
        return new WP_REST_Response(['error' => 'Échec de l\'envoi'], 500);
    }

    return new WP_REST_Response(['ok' => true], 200);
}
