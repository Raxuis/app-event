<?php

require 'vendor/autoload.php';

use App\Router;
use App\Controllers\User;
use App\Controllers\Users;
use App\Controllers\Message;
use App\Controllers\Messages;
use App\Controllers\Model;
use App\Controllers\Models;

new Router([
  'user/:id' => User::class,
  'user/login' => User::class,
  'user/register' => User::class,
  'users' => Users::class,
  'model/:id' => Model::class,
  'models' => Models::class,
  'message/:id' => Message::class,
  'message' => Message::class,
  'messages' => Messages::class
]);
