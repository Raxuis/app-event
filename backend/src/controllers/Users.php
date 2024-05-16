<?php

namespace App\Controllers;

use App\Models\UserModel;

class Users extends Controller
{
  protected object $users;

  public function __construct($params)
  {
    $this->users = new UserModel();

    parent::__construct($params);
  }

  public function postUsers()
  {
    $this->users->add($this->body);

    return $this->users->getLast();
  }

  public function deleteUsers()
  {
    return $this->users->delete(intval($this->params['id']));
  }

  public function getUsers()
  {
    return $this->users->getAll();
  }
}
