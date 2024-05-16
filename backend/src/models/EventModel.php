<?php

namespace App\Models;

use PDO;
use stdClass;

class EventModel extends SqlConnect
{
  public function add(array $data): void
  {
    $query = "INSERT INTO events (size, type) VALUES (:size, :type)";

    $req = $this->db->prepare($query);
    $req->execute($data);
  }

  public function delete(int $id): void
  {
    $req = $this->db->prepare("DELETE FROM events WHERE id = :id");
    $req->execute(["id" => $id]);
  }

  public function get(int $id)
  {
    //TODO : Add case model_id or group_id isn't null
    if ($id < 0) {
      return $this->getLastUserMessage(1);
    }
    $req = $this->db->prepare(
      "SELECT * FROM events
      WHERE id = :id"
    );
    $req->execute(["id" => $id]);

    return $req->rowCount() > 0 ? $req->fetch(PDO::FETCH_ASSOC) : new stdClass();
  }

  public function getAll(): bool|array|stdClass
  {
    $req = $this->db->prepare(
      "SELECT * FROM events"
    );
    $req->execute();

    return $req->rowCount() > 0 ? $req->fetchAll(PDO::FETCH_ASSOC) : new stdClass();
  }

  public function getUserEvents($user_id): stdClass|bool|array
  {
    $req = $this->db->prepare(
      "SELECT * FROM events as e
      INNER JOIN users as u
      ON m.user_id = u.id
      WHERE u.id = :id"
    );
    $req->execute(["id" => $user_id]);

    return $req->rowCount() > 0 ? $req->fetchAll(PDO::FETCH_ASSOC) : new stdClass();
  }


  public function getLast()
  {
    $req = $this->db->prepare("SELECT * FROM events ORDER BY id DESC LIMIT 1");
    $req->execute();

    return $req->rowCount() > 0 ? $req->fetch(PDO::FETCH_ASSOC) : new stdClass();
  }
  public function getLastUserMessage(int $id)
  {
    $req = $this->db->prepare("SELECT * FROM events WHERE user_id = :user_id ORDER BY date DESC LIMIT 1");
    $req->execute(["user_id" => $id]);

    return $req->rowCount() > 0 ? $req->fetch(PDO::FETCH_ASSOC) : new stdClass();
  }
}
