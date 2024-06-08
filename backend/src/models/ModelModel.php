<?php

namespace App\Models;

use PDO;
use stdClass;
use Exception;

class ModelModel extends SqlConnect
{
  public function get(int $id): array|stdClass
  {
    try {
      $req = $this->db->prepare("SELECT * FROM models WHERE id = :id");
      $req->execute(["id" => $id]);

      return $req->rowCount() > 0 ? $req->fetch(PDO::FETCH_ASSOC) : new stdClass();
    } catch (Exception $e) {
      return ['error' => 'Error fetching model: ' . $e->getMessage()];
    }
  }

  public function update(array $data): void
  {
    try {
      $query = "UPDATE models SET name = :name, avatar = :avatar WHERE id = :id";
      $req = $this->db->prepare($query);
      $req->execute([
        "id" => $data['id'],
        "name" => $data['name'],
        "avatar" => $data['avatar']
      ]);
    } catch (Exception $e) {
      throw new Exception('Error updating model: ' . $e->getMessage());
    }
  }

  public function getAll(): array|stdClass
  {
    try {
      $req = $this->db->prepare("SELECT * FROM models");
      $req->execute();

      return $req->rowCount() > 0 ? $req->fetchAll(PDO::FETCH_ASSOC) : new stdClass();
    } catch (Exception $e) {
      return ['error' => 'Error fetching models: ' . $e->getMessage()];
    }
  }

  public function getLast(): array|stdClass
  {
    try {
      $req = $this->db->prepare("SELECT * FROM models ORDER BY id DESC LIMIT 1");
      $req->execute();

      return $req->rowCount() > 0 ? $req->fetch(PDO::FETCH_ASSOC) : new stdClass();
    } catch (Exception $e) {
      return ['error' => 'Error fetching last model: ' . $e->getMessage()];
    }
  }
}
