<?php
/**
 * Plugin Name: CRM Backend
 * Description: Roles, Projects CPT, REST fields, and CORS for the React CRM app.
 * Version: 0.1.0
 * Author: WebCRM
 *
 * Upload this file to:  wp-content/mu-plugins/crm-backend.php
 * (Create the mu-plugins folder if it does not exist — no activation needed.)
 */

if (!defined('ABSPATH')) { exit; }

/* ------------------------------------------------------------------
 * 1. Custom role: "client" — can only see & edit their own project.
 * ------------------------------------------------------------------ */
add_action('init', function () {
    if (!get_role('client')) {
        add_role('client', 'לקוח', [
            'read'         => true,
            'upload_files' => true,
        ]);
    }
});

/* ------------------------------------------------------------------
 * 2. Custom Post Types: "project" and "lead"
 * ------------------------------------------------------------------ */
add_action('init', function () {
    register_post_type('project', [
        'label'        => 'פרויקטים',
        'public'       => false,
        'show_ui'      => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'rest_base'    => 'projects',
        'supports'     => ['title', 'editor', 'author', 'thumbnail', 'custom-fields'],
        'menu_icon'    => 'dashicons-portfolio',
        'capability_type' => 'post',
        'map_meta_cap'    => true,
    ]);

    register_post_type('lead', [
        'label'        => 'לידים',
        'public'       => false,
        'show_ui'      => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'rest_base'    => 'leads',
        'supports'     => ['title', 'editor', 'author', 'custom-fields'],
        'menu_icon'    => 'dashicons-groups',
        'capability_type' => 'post',
        'map_meta_cap'    => true,
    ]);

    register_post_type('quote', [
        'label'        => 'הצעות מחיר',
        'public'       => false,
        'show_ui'      => true,
        'show_in_menu' => true,
        'show_in_rest' => true,
        'rest_base'    => 'quotes',
        'supports'     => ['title', 'author', 'custom-fields'],
        'menu_icon'    => 'dashicons-media-spreadsheet',
        'capability_type' => 'post',
        'map_meta_cap'    => true,
    ]);
});

/* ------------------------------------------------------------------
 * 3. Expose useful meta fields on the REST API.
 * ------------------------------------------------------------------ */
add_action('init', function () {
    $project_fields = [
        'client_name'   => 'string',
        'business_type' => 'string',
        'phone'         => 'string',
        'email'         => 'string',
        'website_url'   => 'string',
        'notes'         => 'string',
        'status'        => 'string',
        'source_lead_id' => 'integer',
    ];
    foreach ($project_fields as $key => $type) {
        register_post_meta('project', $key, [
            'show_in_rest' => true,
            'single'       => true,
            'type'         => $type,
            'auth_callback' => function () { return current_user_can('edit_posts'); },
        ]);
    }

    /* Lead fields. status values: new | in_progress | closing | won | lost */
    $lead_fields = [
        'phone'         => 'string',
        'email'         => 'string',
        'service_type'  => 'string',
        'source'        => 'string',
        'notes'         => 'string',
        'status'        => 'string',
        'budget'        => 'string',
    ];
    foreach ($lead_fields as $key => $type) {
        register_post_meta('lead', $key, [
            'show_in_rest' => true,
            'single'       => true,
            'type'         => $type,
            'auth_callback' => function () { return current_user_can('edit_posts'); },
        ]);
    }

    /* Quote fields. items_json = JSON array of {description, quantity, price}. */
    $quote_fields = [
        'lead_id'       => 'integer',
        'client_name'   => 'string',
        'service_type'  => 'string',
        'items_json'    => 'string',
        'subtotal'      => 'number',
        'vat_rate'      => 'number',
        'vat_amount'    => 'number',
        'total'         => 'number',
        'status'        => 'string',
        'notes'         => 'string',
        'payment_link'  => 'string',
    ];
    foreach ($quote_fields as $key => $type) {
        register_post_meta('quote', $key, [
            'show_in_rest' => true,
            'single'       => true,
            'type'         => $type,
            'auth_callback' => function () { return current_user_can('edit_posts'); },
        ]);
    }
});

/* ------------------------------------------------------------------
 * 4. Clients only see their own projects via REST.
 * ------------------------------------------------------------------ */
add_filter('rest_project_query', function ($args, $request) {
    $user = wp_get_current_user();
    if (in_array('client', (array) $user->roles, true)) {
        $args['author'] = $user->ID;
    }
    return $args;
}, 10, 2);

/* ------------------------------------------------------------------
 * 5. Add user role + display name to JWT /users/me response.
 * ------------------------------------------------------------------ */
add_action('rest_api_init', function () {
    register_rest_field('user', 'roles', [
        'get_callback' => function ($user) {
            $u = get_userdata($user['id']);
            return $u ? (array) $u->roles : [];
        },
        'schema' => null,
    ]);
});

/* ------------------------------------------------------------------
 * 6. CORS — allow the React app (dev + production) to call the API.
 *    Adjust ALLOWED_ORIGINS below to match where your React app runs.
 * ------------------------------------------------------------------ */
add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        $allowed = [
            'http://localhost:5173',
            'http://localhost:4173',
            'https://crm.ariel-azulay.co.il',
        ];
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        if (in_array($origin, $allowed, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');
            header('Vary: Origin');
        }
        if ('OPTIONS' === $_SERVER['REQUEST_METHOD']) {
            status_header(200);
            exit;
        }
        return $value;
    });
}, 15);
