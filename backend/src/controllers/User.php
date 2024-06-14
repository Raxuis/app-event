<?php
namespace App\Controllers;

use App\Models\UserModel;
use Exception;

class User extends Controller
{
  protected object $user;

  public function __construct($params)
  {
    $this->user = new UserModel();
    parent::__construct($params);
  }

  protected function postUser()
  {
    $body = (array) $this->sanitizeInput($this->body);
    $this->user->add($body);
    return $this->sanitizeOutput($this->user->getLast());
  }

  protected function deleteUser()
  {
    $this->user->delete(intval($this->params['id']));
  }

  public function getUser()
  {
    return $this->sanitizeOutput($this->user->get(intval($this->params['id'])));
  }

  protected function putUser()
  {
    try {
      $body = $this->sanitizeInput($this->body);
      $this->user->update($body);
      $updatedUser = $this->user->get($this->body['id']);
      return $this->sanitizeOutput($updatedUser);
    } catch (Exception $e) {
      $this->respond(500, ['message' => 'Error updating user: ' . $e->getMessage()]);
    }
  }
}
