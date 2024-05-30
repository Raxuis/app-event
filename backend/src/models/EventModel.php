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
    // Step 1: Create a new group if 'user_ids' is provided
    if (isset($data['user_ids'])) {
      if (count($data['user_ids']) > $data['size']) {
        header('HTTP/1.0 400 Too many Users');
        return [
          'code' => '400',
          'message' => 'Too many users'
        ];
      }
      $groupName = $data['group_name'];
      $groupQuery = "INSERT INTO groups (name) VALUES (:group_name)";
      $groupStmt = $this->db->prepare($groupQuery);
      $groupStmt->execute(['group_name' => $groupName]);
      $groupId = $this->getLastGroupId()['id']; // Retrieve the group_id from the result
      $data['group_id'] = $groupId;

      // Step 2: Add users to the new group
      $userIds = $data['user_ids'];
      foreach ($userIds as $userId) {
        $groupUserQuery = "INSERT INTO group_users (group_id, user_id, status) VALUES (:group_id, :user_id, :status)";
        $groupUserStmt = $this->db->prepare($groupUserQuery);
        $status = ($data['user_id'] === $userId) ? 'confirmed' : 'registered';
        $groupUserStmt->execute(['group_id' => $groupId, 'user_id' => $userId, 'status' => $status]);
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
    $eventId = $this->getLastEventId()['id'];

    // Step 4: Update group with event ID
    if (isset($data['group_id'])) {
      $groupQuery = "UPDATE groups SET event_id = :event_id WHERE id = :id";
      $groupStmt = $this->db->prepare($groupQuery);
      $groupStmt->execute(['event_id' => $eventId, 'id' => $data['group_id']]);
    }
    header('HTTP/1.0 201 Created');
    return [
      'code' => '201',
      'message' => 'Event created',
    ];
  }

  public function delete(int $id): void
  {
    $req = $this->db->prepare("DELETE FROM events WHERE id = :id");
    $req->execute(["id" => $id]);
  }

  public function get(int $id)
  {
    // Retrieve basic event information along with associated resources
    $req = $this->db->prepare(
      "SELECT e.id AS event_id, e.name AS event_name, e.image, e.type, e.created_at, e.time, e.place, e.description, e.size, e.user_id AS author_id, e.group_id, g.name as group_name,
            u.firstname AS author_firstname, u.lastname AS author_lastname, u.email AS author_email,
            gu.status AS guest_status, gu.registered_at, gu.confirmed_at, gu.canceled_at, us.id AS guest_id,
            us.firstname AS guest_firstname, us.lastname AS guest_lastname, us.email AS guest_email,
            er.id AS resource_id
        FROM events AS e
        INNER JOIN users AS u ON e.user_id = u.id
        INNER JOIN groups AS g ON e.group_id = g.id
        INNER JOIN group_users AS gu ON gu.group_id = g.id
        INNER JOIN users AS us ON gu.user_id = us.id
        LEFT JOIN event_resources AS er ON er.event_id = e.id
        WHERE e.id = :id
        ORDER BY e.time ASC"
    );
    $req->execute(["id" => $id]);

    $results = $req->fetchAll(PDO::FETCH_ASSOC);

    if (count($results) > 0) {
      $event = [
        'event_id' => $results[0]['event_id'],
        'event_name' => $results[0]['event_name'],
        'image' => $results[0]['image'],
        'type' => $results[0]['type'],
        'created_at' => $results[0]['created_at'],
        'time' => $results[0]['time'],
        'place' => $results[0]['place'],
        'description' => $results[0]['description'],
        'size' => $results[0]['size'],
        'author_id' => $results[0]['author_id'],
        'author_firstname' => $results[0]['author_firstname'],
        'author_lastname' => $results[0]['author_lastname'],
        'author_email' => $results[0]['author_email'],
        'group_id' => $results[0]['group_id'],
        'group_name' => $results[0]['group_name'],
        'guests' => [],
        'event_resources' => []
      ];

      // Retrieve custom fields
      $customFieldReq = $this->db->prepare("SELECT field_name, field_value, id FROM custom_fields WHERE event_id = :event_id");
      $customFieldReq->execute(['event_id' => $id]);
      $customFields = $customFieldReq->fetchAll(PDO::FETCH_ASSOC);

      $event['custom_fields'] = $customFields;

      $guestsAdded = [];
      foreach ($results as $row) {
        if (!in_array($row['guest_id'], $guestsAdded)) {
          $event['guests'][] = [
            'guest_id' => $row['guest_id'],
            'guest_status' => $row['guest_status'],
            'registered_at' => $row['registered_at'],
            'confirmed_at' => $row['confirmed_at'],
            'canceled_at' => $row['canceled_at'],
            'guest_firstname' => $row['guest_firstname'],
            'guest_lastname' => $row['guest_lastname'],
            'guest_email' => $row['guest_email']
          ];
          $guestsAdded[] = $row['guest_id'];
        }

        if ($row['resource_id'] !== null) {
          $event['event_resources'][] = [
            'resource_id' => $row['resource_id'],
          ];
        }
      }

      return $event;
    } else {
      return new stdClass();
    }
  }
  public function getAll(): bool|array|stdClass
  {
    $req = $this->db->prepare(
      "SELECT e.id AS event_id, 
                e.name AS event_name, 
                e.image, e.type, e.created_at, e.time, e.place, e.description, e.size, e.user_id AS author_id, e.group_id,
                u.firstname AS author_firstname, u.lastname AS author_lastname, u.email AS author_email,
                gu.status AS guest_status, gu.registered_at, gu.confirmed_at, gu.canceled_at, 
                us.firstname AS guest_firstname, us.lastname AS guest_lastname, us.email AS guest_email,
                cf.field_name AS custom_field_name, cf.field_value AS custom_field_value
        FROM events AS e
        INNER JOIN users AS u ON e.user_id = u.id
        INNER JOIN groups AS g ON e.group_id = g.id
        INNER JOIN group_users AS gu ON gu.group_id = g.id
        INNER JOIN users AS us ON gu.user_id = us.id
        LEFT JOIN custom_fields AS cf ON cf.event_id = e.id
        ORDER BY e.time ASC"
    );
    $req->execute();

    $results = $req->fetchAll(PDO::FETCH_ASSOC);

    if (count($results) > 0) {
      $events = [];
      foreach ($results as $row) {
        $eventId = $row['event_id'];
        if (!isset($events[$eventId])) {
          $events[$eventId] = [
            'event_id' => $eventId,
            'event_name' => $row['event_name'],
            'image' => $row['image'],
            'type' => $row['type'],
            'created_at' => $row['created_at'],
            'time' => $row['time'],
            'place' => $row['place'],
            'description' => $row['description'],
            'size' => $row['size'],
            'author_id' => $row['author_id'],
            'author_firstname' => $row['author_firstname'],
            'author_lastname' => $row['author_lastname'],
            'author_email' => $row['author_email'],
            'group_id' => $row['group_id'],
            'guests' => [], // Initialize guest list
            'custom_fields' => [] // Initialize custom fields array
          ];
        }

        // Add guest information
        $events[$eventId]['guests'][] = [
          'guest_status' => $row['guest_status'],
          'registered_at' => $row['registered_at'],
          'confirmed_at' => $row['confirmed_at'],
          'canceled_at' => $row['canceled_at'],
          'guest_firstname' => $row['guest_firstname'],
          'guest_lastname' => $row['guest_lastname'],
          'guest_email' => $row['guest_email']
        ];

        // Add custom field information
        if (isset($row['custom_field_name']) && isset($row['custom_field_value'])) {
          $events[$eventId]['custom_fields'][] = [
            'name' => $row['custom_field_name'],
            'value' => $row['custom_field_value']
          ];
        }
      }

      return array_values($events);
    } else {
      return new stdClass();
    }
  }
  public function getUserEvents($user_id): stdClass|array
  {
    $req = $this->db->prepare(
      "SELECT e.id AS event_id, 
      e.name AS event_name, 
      e.image, COALESCE(m.type, e.type) AS type, e.created_at, e.time, e.place, e.description, e.size, e.user_id AS author_id, e.group_id,
      u.firstname AS author_firstname, u.lastname AS author_lastname, u.email AS author_email,
      gu.status AS guest_status, gu.registered_at, gu.confirmed_at, gu.canceled_at, us.id as guest_id,
      us.firstname AS guest_firstname, us.lastname AS guest_lastname, us.email AS guest_email
      FROM events AS e
      INNER JOIN users AS u ON e.user_id = u.id
      LEFT JOIN models AS m ON e.model_id = m.id
      INNER JOIN groups AS g ON e.group_id = g.id
      INNER JOIN group_users AS gu ON gu.group_id = g.id
      INNER JOIN users AS us ON gu.user_id = us.id
      WHERE e.user_id = :user_id
      OR e.group_id IN (SELECT group_id FROM group_users WHERE user_id = :user_id)
      ORDER BY e.time ASC"
    );
    $req->execute(["user_id" => $user_id]);

    $results = $req->fetchAll(PDO::FETCH_ASSOC);

    if (count($results) > 0) {
      $events = [];
      foreach ($results as $row) {
        $event_id = $row['event_id'];
        if (!isset($events[$event_id])) {
          $events[$event_id] = [
            'event_id' => $row['event_id'],
            'event_name' => $row['event_name'],
            'image' => $row['image'],
            'type' => $row['type'],
            'created_at' => $row['created_at'],
            'time' => $row['time'],
            'place' => $row['place'],
            'description' => $row['description'],
            'size' => $row['size'],
            'author_id' => $row['author_id'],
            'author_firstname' => $row['author_firstname'],
            'author_lastname' => $row['author_lastname'],
            'author_email' => $row['author_email'],
            'group_id' => $row['group_id'],
            'guests' => []
          ];
        }

        $events[$event_id]['guests'][] = [
          'guest_id' => $row['guest_id'],
          'guest_status' => $row['guest_status'],
          'registered_at' => $row['registered_at'],
          'confirmed_at' => $row['confirmed_at'],
          'canceled_at' => $row['canceled_at'],
          'guest_firstname' => $row['guest_firstname'],
          'guest_lastname' => $row['guest_lastname'],
          'guest_email' => $row['guest_email']
        ];
      }
      return array_values($events);
    } else {
      return new stdClass();
    }
  }

  public function getLast()
  {
    $req = $this->db->prepare("SELECT * FROM events ORDER BY id DESC LIMIT 1");
    $req->execute();

    return $req->rowCount() > 0 ? $req->fetch(PDO::FETCH_ASSOC) : new stdClass();
  }
  public function getLastEventId(): bool|array|stdClass
  {
    $req = $this->db->prepare("SELECT e.id FROM events as e ORDER BY id DESC LIMIT 1");
    $req->execute();

    return $req->rowCount() > 0 ? $req->fetch(PDO::FETCH_ASSOC) : new stdClass();
  }
  public function getLastGroupId(): bool|array|stdClass
  {
    $req = $this->db->prepare("SELECT g.id FROM groups as g ORDER BY id DESC LIMIT 1");
    $req->execute();

    return $req->rowCount() > 0 ? $req->fetch(PDO::FETCH_ASSOC) : new stdClass();
  }
  public function getModelType(int $id): bool|array|stdClass
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
  public function userEventInteraction(array $body)
  {
    $validStatuses = ['accepted', 'registered', 'canceled'];

    if (!in_array($body['status'], $validStatuses)) {
      throw new Exception("Invalid status value provided.");
    }

    // Mapping 'accepted' to 'confirmed' for consistency with the enum values
    if ($body['status'] === "accepted") {
      $body['status'] = "confirmed";
    }

    $statusColumnValue = $body['status'];

    if ($statusColumnValue === "confirmed") {
      $req = $this->db->prepare("UPDATE group_users SET status = :status, confirmed_at = NOW() WHERE user_id = :user_id AND group_id = :group_id");
    } else if ($statusColumnValue === "registered") {
      $req = $this->db->prepare("UPDATE group_users SET status = :status WHERE user_id = :user_id AND group_id = :group_id");
    } else {
      $req = $this->db->prepare("UPDATE group_users SET status = :status, confirmed_at = NULL, canceled_at = NOW() WHERE user_id = :user_id AND group_id = :group_id");
    }

    $req->execute([
      "status" => $statusColumnValue,
      "user_id" => $body['user_id'],
      "group_id" => $body['group_id']
    ]);
  }
  public function update(int $id, array $data)
  {
    try {
      // Step 1: Validate user IDs and size
      if (isset($data['user_ids']) && (count($data['user_ids']) > $data['size'])) {
        header('HTTP/1.0 400 Too many Users');
        return [
          'code' => '400',
          'message' => 'Too many users'
        ];
      }

      // Step 2: Update the event details
      $query = "UPDATE events SET name = :name, description = :description, size = :size, time = :time, place = :place, image = :image WHERE id = :id";

      $req = $this->db->prepare($query);

      // Bind parameters
      $req->bindValue(':name', $data['name']);
      $req->bindValue(':description', $data['description']);
      $req->bindValue(':size', $data['size']);
      $req->bindValue(':time', $data['time']);
      $req->bindValue(':place', $data['place']);
      $req->bindValue(':id', $id);

      if (isset($data['image'])) {
        $req->bindValue(':image', $data['image']);
      } else {
        $req->bindValue(':image', null);
      }

      $req->execute();

      // Step 3: Update the group name if provided
      if (isset($data['group_name'])) {
        $groupQuery = "UPDATE groups SET name = :group_name WHERE id = (SELECT group_id FROM events WHERE id = :event_id)";
        $groupStmt = $this->db->prepare($groupQuery);
        $groupStmt->execute(['group_name' => $data['group_name'], 'event_id' => $id]);
      }

      // Step 4: Update guests if provided
      if (isset($data['user_ids']) && isset($data['guest_statuses'])) {
        $groupId = $this->getGroupIdByEventId($id);

        // Remove existing guests except the author
        $deleteGuestsQuery = "DELETE FROM group_users WHERE group_id = :group_id AND user_id != :author_id";
        $deleteGuestsStmt = $this->db->prepare($deleteGuestsQuery);
        $deleteGuestsStmt->execute(['group_id' => $groupId, 'author_id' => $data['user_id']]);

        // Add or update new guests with their statuses
        foreach ($data['user_ids'] as $index => $userId) {
          if ($userId !== $data['user_id']) {
            $groupUserQuery = "INSERT INTO group_users (group_id, user_id, status) VALUES (:group_id, :user_id, :status)ON DUPLICATE KEY UPDATE status = :status";
            $groupUserStmt = $this->db->prepare($groupUserQuery);
            $status = ($userId == $data['user_id']) ? 'confirmed' : $data['guest_statuses'][$index];
            $groupUserStmt->execute(['group_id' => $groupId, 'user_id' => $userId, 'status' => $status]);
          }
        }
      }

      // Step 5: Handle custom fields
      if (isset($data['custom_fields']) && is_array($data['custom_fields'])) {
        // Delete existing custom fields for this event
        $deleteQuery = "DELETE FROM custom_fields WHERE event_id = :event_id";
        $deleteStmt = $this->db->prepare($deleteQuery);
        $deleteStmt->execute(['event_id' => $id]);

        // Insert new custom fields
        $customFieldQuery = "INSERT INTO custom_fields (event_id, field_name, field_value) VALUES (:event_id, :field_name, :field_value)";
        $customFieldStmt = $this->db->prepare($customFieldQuery);

        foreach ($data['custom_fields'] as $field) {
          if ($field instanceof stdClass) {
            $field = (array) $field;
          }

          $customFieldStmt->execute([
            'event_id' => $id,
            'field_name' => $field['name'],
            'field_value' => $field['value']
          ]);
        }
      }

      header('HTTP/1.0 201 Created');
      return [
        'code' => '201',
        'message' => 'Event updated',
      ];
    } catch (Exception $e) {
      throw $e;
    }
  }

  private function getGroupIdByEventId(int $eventId): int
  {
    $req = $this->db->prepare("SELECT group_id FROM events WHERE id = :event_id");
    $req->execute(['event_id' => $eventId]);
    $result = $req->fetch(PDO::FETCH_ASSOC);

    if (!$result) {
      throw new Exception("Event with ID $eventId not found");
    }

    return $result['group_id'];
  }
}

