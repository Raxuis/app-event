<?php

require 'vendor/autoload.php';

use App\Controllers\Event;
use App\Controllers\Events;
use App\Router;
use App\Controllers\User;
use App\Controllers\Users;
use App\Controllers\Model;
use App\Controllers\Models;

new Router([
  'user/:id' => User::class,
  'user/login' => User::class,
  'user/register' => User::class,
  'users' => Users::class,
  'model/:id' => Model::class,
  'models' => Models::class,
  'event/:id' => Event::class,
  'event' => Event::class,
  'events' => Events::class
]);
