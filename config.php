<?php

// Project
define('PROJECT_NAME', 'elite-cloud');

// Slim
$config['slim']['displayErrorDetails'] = true;
$config['slim']['addContentLengthHeader'] = false;

// Smarty
define('SMARTY_DEBUGGING', false);

// Database
$config['db']['host'] = 'localhost';
$config['db']['user'] = 'root';
$config['db']['pass'] = '';
$config['db']['datb'] = 'elite-cloud';

// overwrite $config['db']['pass'] in an external config during development
// which wont be uploaded to prevent mistakes
@include '../config.php';
