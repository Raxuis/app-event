<?php

namespace App\Models;

use PDO;
use stdClass;

class EventModel extends SqlConnect
{
  public function add(array $data): void
  {
    $query = "INSERT INTO events (name, description, size, time, place, user_id";

    if (isset($data['image'])) {
      $query .= ", image";
    }

    if (isset($data['model_id'])) {
      $query .= ", model_id";
    }

    if (isset($data['group_id'])) {
      $query .= ", group_id";
    }

    $query .= ") VALUES (:name, :description, :size, :time, :place,:user_id";

    if (isset($data['image'])) {
      $query .= ", :image";
    }

    if (isset($data['model_id'])) {
      $query .= ", :model_id";
    }

    if (isset($data['group_id'])) {
      $query .= ", :group_id";
    }

    $query .= ")";

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
      "SELECT e.*, u.firstname, u.lastname FROM e
          INNER JOIN users AS u
          ON e.user_id = u.id
          WHERE e.id = :id"
    );
    $req->execute(["id" => $id]);

    return $req->rowCount() > 0 ? $req->fetch(PDO::FETCH_ASSOC) : new stdClass();
  }
  public function getAll(): bool|array|stdClass
  {
    $req = $this->db->prepare(
      "SELECT e.id AS event_id, e.name AS event_name, e.image,e.type,e.created_at, e.time,place, e.description, e.size, e.user_id,e.group_id, 
                u.id AS user_id, u.firstname, u.lastname, u.email
         FROM events AS e
         INNER JOIN users AS u ON e.user_id = u.id"
    );
    $req->execute();

    return $req->rowCount() > 0 ? $req->fetchAll(PDO::FETCH_ASSOC) : new stdClass();
  }


  public function getUserEvents($user_id): stdClass|bool|array
  {
    $req = $this->db->prepare(
      "SELECT e.id AS event_id, e.name AS event_name, e.image,e.type,e.created_at, e.time,e.place, e.description, e.size, e.user_id,e.group_id, 
                u.id AS user_id, u.firstname, u.lastname, u.email
         FROM events AS e
         INNER JOIN users AS u ON e.user_id = u.id
         WHERE e.user_id = $user_id
         "
    );
    $req->execute();

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
