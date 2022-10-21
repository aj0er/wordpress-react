<?php

const DEVELOPMENT_MODE = true;

function initCors(){
  header( 'Access-Control-Allow-Origin: http://localhost:5173');
  header( 'Access-Control-Allow-Methods: GET, DELETE, PUT' );
  header( 'Access-Control-Allow-Credentials: true' );
}

function setup_scripts() {
	wp_enqueue_style( 'reacttest',  get_template_directory_uri() . '/assets/index.css');
	wp_enqueue_script( 'reacttest', get_template_directory_uri() . '/assets/index.js', array(), '1.0.0', true );
}

add_action( 'wp_enqueue_scripts', 'setup_scripts' );

add_action('rest_api_init', function () {
    if(DEVELOPMENT_MODE){
        remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
        add_filter( 'rest_pre_serve_request', 'initCors');
    }
    
    register_rest_route( 'api', '/posts', array(
        'methods' => 'GET',
        'callback' => 'get_posts_rest',
    ));

    register_rest_route( 'api', '/posts/(?P<id>[a-zA-Z0-9-]+)', array(
        'methods' => 'DELETE',
        'callback' => 'delete_post',
    ));

    register_rest_route( 'api', '/posts/(?P<id>[a-zA-Z0-9-]+)', array(
        'methods' => 'PUT',
        'callback' => 'change_post',
    ));

    register_rest_route( 'api', '/posts', array(
        'methods' => 'POST',
        'callback' => 'create_post'
    ));
});

/* 
    REST
*/

function get_posts_rest(){
    return array_map(function($p){
        return create_post_response($p);
    }, get_posts());
}

function change_post(WP_REST_Request $request){
    if(!is_user_administrator())
        return wp_get_current_user();

    $id = $request["id"];
    $json = $request->get_json_params();
    if($json == null){
        return json_error();
    }

    $title = $json["post_title"] ?? null;
    $content = $json["post_content"] ?? null;

    if($title == null || $content == null)
        return bad_request_error();

    $update_post = get_post($id);
    if($update_post == null){
        return new WP_Error("not_found", "Not found", array("status" => 404));
    }

    // TODO: Ändra andras inlägg? Speciell roll?

    $update_post->post_title = $title;
    $update_post->post_content = $content;

    $error = wp_update_post($update_post, true);
    if(is_int($error)){
        return create_post_response($update_post);
    } else {
        return $error;
    }
}

function create_post_response($post){
    return [
        "ID" => $post->ID,
        "post_title" => $post->post_title,
        "post_content" => $post->post_content
    ];
}

function create_post(WP_REST_Request $request){
    if(!is_user_administrator())
        return forbidden_error();

    $json = $request->get_json_params();
    if($json == null)
        return json_error();

    $title = $json["post_title"] ?? null;
    $content = $json["post_content"] ?? null;

    if($title == null || $content == null)
        return bad_request_error();
    
    wp_insert_post([
        "post_title" => $title,
        "post_content" => $content,
        "post_status" => "publish"
    ]);

    return array_map(function($p){
        return create_post_response($p);
    }, get_posts());
}

function delete_post($data){
    if(!is_user_administrator())
        return forbidden_error();

    $post_id = $data["id"];
    wp_delete_post($post_id);
    return null;
}

/*
    Auth
*/
function generate_frontend_user(){
    $user = wp_get_current_user();

    if($user->ID == 0){ // Användaren är utloggad, skicka gästanvändare till frontend
        return [
            "id" => 0,
            "roles" => [],
            "nonce" => ""
        ];
    }

    $nonce = wp_create_nonce('wp_rest');

    return [
        "id" => $user->ID,
        "roles" => $user->roles,
        "nonce" => $nonce
    ];
}

function is_user_administrator(){
    return in_array('administrator', wp_get_current_user()->roles);
}

/*
    Errors
*/
function forbidden_error(): WP_Error {
    return new WP_Error("forbidden", "You are missing the required privileges for this action.", array("status" => 403));
}

function json_error(): WP_Error {
    return new WP_Error("bad_request", "Invalid JSON data or missing headers", array("status" => 400));
}

function bad_request_error(): WP_Error {
    return new WP_Error("bad_request", "Bad request", array("status" => 400));
}