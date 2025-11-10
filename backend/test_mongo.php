<?php
require __DIR__ . '/vendor/autoload.php';

$mongo = new MongoDB\Client('mongodb://mongo:27017');
$dbs = $mongo->listDatabases();
print_r($dbs);