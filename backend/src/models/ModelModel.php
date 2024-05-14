<?php

namespace App\Models;

use \PDO;
use stdClass;

class ModelModel extends SqlConnect
{
  public function add(array $data): void
  {
    $query = "INSERT INTO models (name, avatar) VALUES (:name, :avatar)";

    $req = $this->db->prepare($query);
    $req->execute($data);
  }
  public function delete(int $id): void
  {
    $req = $this->db->prepare("DELETE FROM models WHERE id = :id");
    $req->execute(["id" => $id]);
  }

  public function get(int $id)
  {
    $req = $this->db->prepare("SELECT * FROM models WHERE id = :id");
    $req->execute(["id" => $id]);

    return $req->rowCount() > 0 ? $req->fetch(PDO::FETCH_ASSOC) : new stdClass();
  }
  public function update(array $data)
  {
    $query = "UPDATE models SET name = :name, avatar = :avatar WHERE id = :id";
    $req = $this->db->prepare($query);
    $req->execute([
      "id" => $data['id'],
      "name" => $data['name'],
      "avatar" => $data['avatar']
    ]);
  }
  public function getAll()
  {
    $req = $this->db->prepare("SELECT * FROM users");
    $req->execute();

    return $req->rowCount() > 0 ? $req->fetchAll(PDO::FETCH_ASSOC) : new stdClass();
  }
  public function getLast()
  {
    $req = $this->db->prepare("SELECT * FROM models ORDER BY id DESC LIMIT 1");
    $req->execute();

    return $req->rowCount() > 0 ? $req->fetch(PDO::FETCH_ASSOC) : new stdClass();
  }
}
