<?php

namespace App\Controllers;

use App\Models\UserModel;
use Exception;

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
  try {
    $body = $this->sanitizeInput($this->body);
    $this->users->add($body);
    return $this->sanitizeOutput($this->users->getLast());
    } catch (Exception $e) {
      $this->respond(500, ['error' => 'An error occurred while processing the request.' . $e->getMessage()]);
    }
  }

  public function deleteUsers()
  {
    $this->users->delete(intval($this->params['id']));
  }

  public function getUsers()
  {
    return $this->sanitizeOutput($this->users->getAll());
  }
}
