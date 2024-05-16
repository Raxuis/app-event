<?php

namespace App\Controllers;

use App\Models\AuthModel;

class Auth extends Controller
{
  protected object $auth;

  public function __construct($params)
  {
    $this->auth = new AuthModel();

    parent::__construct($params);
  }
  public function postAuth()
  {
    return $this->auth->add($this->body);
  }

  public function getAuth()
  {
    return $this->auth->get();
  }
}
