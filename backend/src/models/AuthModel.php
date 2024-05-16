<?php

namespace App\Models;

use \PDO;
use stdClass;

class AuthModel extends SqlConnect
{
  public function add(array $data)
  {
    $verif_query = "SELECT * FROM users WHERE email = :email";
    $verif_req = $this->db->prepare($verif_query);
    $verif_req->execute(["email" => $data['email']]);
    $response = $verif_req->fetch(PDO::FETCH_ASSOC);
    if ($verif_req->rowCount() >= 1) {
      if (password_verify($data['password'], $response['password'])) {
        session_start();
        $_SESSION['user']['id'] = $response['id'];
        $_SESSION['user']['email'] = $response['email'];
        return "success";
      } else {
        return "Incorrect password";
      }
    } else {
      return "User not found";
    }
  }

  public function get()
  {
    return session_status();

    // if (session_status() > 1) {
    //   return true;
    // }
    // header("HTTP/1.1 401 Unauthorized");
    // // header('Location: /login');
  }
}
