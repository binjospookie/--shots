<?php

header( 'Content-Type: application/json; charset=utf-8' );

setlocale( LC_ALL, 'en_US.UTF8' );
setlocale( LC_TIME, 'ru_RU.UTF8' );
mb_regex_encoding( 'UTF-8' );
mb_internal_encoding( 'UTF-8' );

header( 'Expires: Mon, 26 Jul 1997 05:00:00 GMT' );
header( 'Last-Modified: ' . gmdate( 'D, d M Y H:i:s' ) . ' GMT' );
header( 'Cache-Control: no-cache, must-revalidate' );
header( 'Pragma: no-cache' );

session_name( 'SHOTSSESSID' );
session_set_cookie_params( 0 );

require_once 'functions.php';

if ( ( $_SERVER['REQUEST_METHOD'] !== 'POST' ))
{
	set_http_code( '400 Bad Request' );
	echo '{"error":"Incorrect data"}';
	exit;
}

$data = $_POST['shot'];

$filename = uniqid(rand(), true) . '.png';
$data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $data));
file_put_contents('saved/'.$filename, $data);
$path = 'http://shots.binjo.ru/saved/'.$filename;

echo json_encode($path);
