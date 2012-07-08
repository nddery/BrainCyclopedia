<?php
require_once('keys.php');
$key = get_key();
define('API_KEY', $key);

// array of possible offset
$offset = array(0, 1, 2, 3, 4, 5, 6, 7);

$url  = 'http://api.nytimes.com/svc/search/v1/article';
// $url .= '?query= des_facet:[POLITICS AND GOVERNMENT]&fields=title,date,body,publication_year';
$url .= '?query=facet_terms:politics&fields=title,date,body,publication_year';
// $url .= '?query=facet_terms:politics&fields=title,date,body,publication_year,des_facet,geo_facet,org_facet,per_facet';
$url .= '&begin_date='. $_GET['year'] .'0101&end_date='. $_GET['year'] .'1231';
$url .= '&offset='.$offset[array_rand($offset)];
$url .= '&api-key='. API_KEY;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
$response = curl_exec($ch);
echo $response;
exit();
?>
