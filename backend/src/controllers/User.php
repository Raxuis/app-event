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

  public function postUser()
  {
    try {
      $body = (array) $this->sanitizeInput($this->body);
      $this->user->add($body);
      $lastUser = $this->user->getLast();
      return $this->respond(201, $this->sanitizeOutput($lastUser));
    } catch (Exception $e) {
      return $this->handleException($e);
    }
  }

  public function deleteUser()
  {
    try {
      $this->user->delete(intval($this->params['id']));
      return $this->respond(200, ['success' => 'User deleted successfully']);
    } catch (Exception $e) {
      return $this->handleException($e);
    }
  }

  public function getUser()
  {
    try {
      $user = $this->user->get(intval($this->params['id']));
      return $this->respond(200, $this->sanitizeOutput($user));
    } catch (Exception $e) {
      return $this->handleException($e);
    }
  }

  public function putUser()
  {
    try {
      $body = $this->sanitizeInput($this->body);
      $this->user->update($body);
      $updatedUser = $this->user->get($this->body['id']);
      return $this->respond(200, $this->sanitizeOutput($updatedUser));
    } catch (Exception $e) {
      return $this->handleException($e);
    }
  }

  private function respond(int $statusCode, array $data)
  {
    header("HTTP/1.0 $statusCode");
    echo json_encode($data);
    exit;
  }

  private function handleException(Exception $e)
  {
    $statusCode = $e->getCode() ? $e->getCode() : 500;
    $message = $e->getMessage() ? $e->getMessage() : 'An error occurred';
    return $this->respond($statusCode, ['error' => $message]);
  }
}
