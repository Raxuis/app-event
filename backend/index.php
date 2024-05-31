<?php

require 'vendor/autoload.php';

use App\Controllers\Auth;
use App\Controllers\Event;
use App\Controllers\EventResource;
use App\Controllers\EventResources;
use App\Controllers\Events;
use App\Router;
use App\Controllers\User;
use App\Controllers\Users;
use App\Controllers\Model;
use App\Controllers\Models;
use App\Controllers\UserEvents;
use App\Controllers\Form;
use App\Controllers\RessourceQuantityInteraction;
use App\Controllers\UserEventInteraction;

new Router([
  "user/:id" => User::class,
  "auth" => Auth::class,
  "auth/:id" => Auth::class,
  "user" => User::class,
  'user/register' => User::class,
  'users' => Users::class,
  'model/:id' => Model::class,
  'models' => Models::class,
  'event/:id' => Event::class,
  'event' => Event::class,
  "userinteraction" => UserEventInteraction::class,
  "events" => Events::class,
  "events/:user_id" => UserEvents::class,
  "form-infos" => Form::class,
  "resource/:id" => EventResource::class,
  "resource" => EventResource::class,
  "resourcequantityinteraction" => RessourceQuantityInteraction::class,
  "resources/:event_id" => EventResources::class,
]);
