<?php

namespace App\Models;

use \PDO;
use stdClass;

class FormModel extends SqlConnect
{
  public function get(): array|stdClass
  {
    $req = $this->db->prepare("SELECT * FROM models");
    $req->execute();

    return $req->rowCount() > 0 ? $req->fetchAll(PDO::FETCH_ASSOC) : new stdClass();
  }
}
