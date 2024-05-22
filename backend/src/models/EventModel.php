<?php

namespace App\Models;

use Exception;
use PDO;
use stdClass;

class EventModel extends SqlConnect
{
  protected string $type;
  public function add(array $data)
  {
    try {
      // Step 1: Create a new group if 'user_ids' is provided
      if (isset($data['user_ids'])) {
        $groupName = $data['group_name'];
        $groupQuery = "INSERT INTO groups (name) VALUES (:group_name)";
        $groupStmt = $this->db->prepare($groupQuery);
        $groupStmt->execute(['group_name' => $groupName]);
        $groupId = $this->getLastGroupId()['id']; // Retrieve the group_id from the result
        $data['group_id'] = $groupId;

        // Step 2: Add users to the new group
        $userIds = $data['user_ids'];
        foreach ($userIds as $userId) {
          $groupUserQuery = "INSERT INTO group_users (group_id, user_id) VALUES (:group_id, :user_id)";
          $groupUserStmt = $this->db->prepare($groupUserQuery);
          $groupUserStmt->execute(['group_id' => $groupId, 'user_id' => $userId]);
        }
        unset($data['user_ids']);
      }

      // Step 3: Create the event
      $query = "INSERT INTO events (name, description, size, time, place, user_id";

      if (isset($data['image'])) {
        $query .= ", image";
      }

      if (isset($data['model_id'])) {
        $query .= ", model_id, type";
      }

      if (isset($data['group_id'])) {
        $query .= ", group_id";
      }

      $query .= ") VALUES (:name, :description, :size, :time, :place, :user_id";

      if (isset($data['image'])) {
        $query .= ", :image";
      }

      if (isset($data['model_id'])) {
        $query .= ", :model_id, :type";
      }

      if (isset($data['group_id'])) {
        $query .= ", :group_id";
      }

      $query .= ")";

      $req = $this->db->prepare($query);

      // Bind parameters
      $req->bindValue(':name', $data['name']);
      $req->bindValue(':description', $data['description']);
      $req->bindValue(':size', $data['size']);
      $req->bindValue(':time', $data['time']);
      $req->bindValue(':place', $data['place']);
      $req->bindValue(':user_id', $data['user_id']);

      if (isset($data['image'])) {
        $req->bindValue(':image', $data['image']);
      }

      if (isset($data['model_id'])) {
        $req->bindValue(':model_id', $data['model_id']);
        $type = $this->getModelType($data['model_id'])['type'];
        $req->bindValue(':type', $type);
      }

      if (isset($data['group_id'])) {
        $req->bindValue(':group_id', $data['group_id']);
      }

      $req->execute();
    } catch (Exception $e) {
      throw $e;
    }
  }

  public function delete(int $id): void
  {
    $req = $this->db->prepare("DELETE FROM events WHERE id = :id");
    $req->execute(["id" => $id]);
  }

  public function get(int $id)
  {
    //TODO : Add case model_id or group_id isn't null
    $req = $this->db->prepare(
      "SELECT e.*, u.firstname, u.lastname FROM events as e
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
         INNER JOIN users AS u ON e.user_id = u.id
         ORDER BY e.time DESC
         "
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
         ORDER BY e.time ASC
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
  public function getLastGroupId()
  {
    $req = $this->db->prepare("SELECT g.id FROM groups as g ORDER BY id DESC LIMIT 1");
    $req->execute();

    return $req->rowCount() > 0 ? $req->fetch(PDO::FETCH_ASSOC) : new stdClass();
  }
  public function getModelType(int $id)
  {
    $req = $this->db->prepare("
    SELECT m.type
    FROM models AS m
    WHERE m.id = :id
    ");
    $req->execute([
      "id" => $id
    ]);

    return $req->rowCount() > 0 ? $req->fetch(PDO::FETCH_ASSOC) : new stdClass();
  }
}
