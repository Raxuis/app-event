<?php

namespace App\Controllers;

use App\Models\UserModel;

class User extends Controller
{
  protected object $user;

  public function __construct($params)
  {
    $this->user = new UserModel();

    parent::__construct($params);
  }

  public function postUser()
  {
    $body = (array) json_decode(file_get_contents('php://input'));

    $this->user->add($body);

    return $this->user->getLast();
  }

  public function deleteUser()
  {
    return $this->user->delete(intval($this->params['id']));
  }

  public function getUser()
  {
    return $this->user->get(intval($this->params['id']));
  }

  public function login()
  {
    $requestData = json_decode(file_get_contents('php://input'), true);

    if (isset($requestData['email']) && isset($requestData['password'])) {
      $userModel = new UserModel();
      $user = $userModel->authenticate($requestData);

      if ($user) {
        header('Content-Type: application/json');
        echo json_encode($user);
      } else {
        header('HTTP/1.0 401 Unauthorized');
        echo json_encode(['error' => 'Invalid credentials']);
      }
    } else {
      header('HTTP/1.0 400 Bad Request');
      echo json_encode(['error' => 'Email and password are required']);
    }
  }
  public function putUser()
  {
    $body = (array) json_decode(file_get_contents('php://input'));

    $this->user->update($body);

    return $this->user->getLast();
  }
}
