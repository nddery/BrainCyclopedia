<?php
define('API_KEY', 'efcdefd5ae3046ff5a9cd1cfcad4d693:18:62785848');

$url  = 'http://api.nytimes.com/svc/search/v1/article';
$url .= '?query=economy,politics&fields=title,date,body,publication_year';
$url .= '&begin_date='. $_GET['year'] .'0101&end_date='. $_GET['year'] .'1231';
$url .= '&api-key='. API_KEY;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
$response = curl_exec($ch);
echo $response;
exit();
?>
