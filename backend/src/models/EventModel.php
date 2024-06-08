<?php

namespace App\Models;

use Exception;
use PDO;
use stdClass;

class EventModel extends SqlConnect
{
  protected string $type;

  public function add(array $data): array
  {
    try {
      if (isset($data['user_ids'])) {
        return $this->handleGroupCreation($data);
      } else {
        return $this->createEvent($data);
      }
    } catch (Exception $e) {
      throw new Exception('Failed to add event: ' . $e->getMessage());
    }
  }

  private function handleGroupCreation(array &$data): array
  {
    if (count($data['user_ids']) > $data['size']) {
      throw new Exception('Too many users');
    }

    $this->createGroup($data);
    $this->addUsersToGroup($data);
    unset($data['user_ids']);

    return $this->createEvent($data);
  }

  private function createGroup(array &$data): void
  {
    $groupStmt = $this->db->prepare("INSERT INTO groups (name) VALUES (:group_name)");
    $groupStmt->execute(['group_name' => $data['group_name']]);
    $data['group_id'] = $this->getLastGroupId()['id'];
  }

  private function addUsersToGroup(array $data): void
  {
    foreach ($data['user_ids'] as $userId) {
      $groupUserStmt = $this->db->prepare(
        "INSERT INTO group_users (group_id, user_id, status) VALUES (:group_id, :user_id, :status)"
      );
      $status = ($data['user_id'] === $userId) ? 'confirmed' : 'registered';
      $groupUserStmt->execute([
        'group_id' => $data['group_id'],
        'user_id' => $userId,
        'status' => $status
      ]);
    }
  }

  private function createEvent(array $data): array
  {
    $columns = ['name', 'description', 'size', 'time', 'place', 'user_id'];
    $values = [':name', ':description', ':size', ':time', ':place', ':user_id'];

    if (isset($data['image'])) {
      $columns[] = 'image';
      $values[] = ':image';
    }
    if (isset($data['model_id'])) {
      $columns[] = 'model_id';
      $columns[] = 'type';
      $values[] = ':model_id';
      $values[] = ':type';
    }
    if (isset($data['group_id'])) {
      $columns[] = 'group_id';
      $values[] = ':group_id';
    }

    $query = sprintf(
      "INSERT INTO events (%s) VALUES (%s)",
      implode(", ", $columns),
      implode(", ", $values)
    );

    $stmt = $this->db->prepare($query);
    $this->bindEventParams($stmt, $data);

    $stmt->execute();
    $eventId = $this->getLastEventId()['id'];

    if (isset($data['group_id'])) {
      $this->updateGroupEventId($data['group_id'], $eventId);
    }

    return ['code' => '201', 'message' => 'Event created'];
  }

  private function bindEventParams($stmt, $data): void
  {
    $stmt->bindValue(':name', $data['name']);
    $stmt->bindValue(':description', $data['description']);
    $stmt->bindValue(':size', $data['size']);
    $stmt->bindValue(':time', $data['time']);
    $stmt->bindValue(':place', $data['place']);
    $stmt->bindValue(':user_id', $data['user_id']);

    if (isset($data['image'])) {
      $stmt->bindValue(':image', $data['image']);
    }
    if (isset($data['model_id'])) {
      $stmt->bindValue(':model_id', $data['model_id']);
      $type = $this->getModelType($data['model_id'])['type'];
      $stmt->bindValue(':type', $type);
    }
    if (isset($data['group_id'])) {
      $stmt->bindValue(':group_id', $data['group_id']);
    }
  }

  private function updateGroupEventId(int $groupId, int $eventId): void
  {
    $groupStmt = $this->db->prepare("UPDATE groups SET event_id = :event_id WHERE id = :id");
    $groupStmt->execute(['event_id' => $eventId, 'id' => $groupId]);
  }

  public function delete(int $id): void
  {
    try {
      $stmt = $this->db->prepare("DELETE FROM events WHERE id = :id");
      $stmt->execute(["id" => $id]);
    } catch (Exception $e) {
      throw new Exception('Failed to delete event: ' . $e->getMessage());
    }
  }

  public function get(int $id): array|stdClass
  {
    try {
      $stmt = $this->db->prepare(
        "SELECT e.id AS event_id, e.name AS event_name, e.image, e.type, e.created_at, e.time, e.place, e.description, e.size, 
                        e.user_id AS author_id, e.group_id, g.name as group_name,
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
      $stmt->execute(["id" => $id]);

      $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
      return $this->processEventResults($results);
    } catch (Exception $e) {
      throw new Exception('Failed to retrieve event: ' . $e->getMessage());
    }
  }

  public function update(int $id, array $data): array
  {
    try {
      if (isset($data['user_ids']) && (count($data['user_ids']) > $data['size'])) {
        throw new Exception('Too many users');
      }

      $this->updateEventDetails($id, $data);

      if (isset($data['group_name'])) {
        $this->updateGroupName($id, $data['group_name']);
      }

      if (isset($data['user_ids']) && isset($data['guest_statuses'])) {
        $this->updateGuests($id, $data['user_ids'], $data['guest_statuses']);
      }

      return ['code' => '200', 'message' => 'Event updated'];
    } catch (Exception $e) {
      throw new Exception('Failed to update event: ' . $e->getMessage());
    }
  }

  private function updateEventDetails(int $id, array $data): void
  {
    $columns = ['name', 'description', 'size', 'time', 'place'];

    if (isset($data['image'])) {
      $columns[] = 'image';
    }

    // 👇 The array is imploded into a single string separated by commas.
    $setClause = implode(", ", array_map(fn($col) => "$col = :$col", $columns));
    $query = "UPDATE events SET $setClause WHERE id = :id";

    $stmt = $this->db->prepare($query);
    $stmt->bindValue(':name', $data['name']);
    $stmt->bindValue(':description', $data['description']);
    $stmt->bindValue(':size', $data['size']);
    $stmt->bindValue(':time', $data['time']);
    $stmt->bindValue(':place', $data['place']);
    $stmt->bindValue(':id', $id);

    if (isset($data['image'])) {
      $stmt->bindValue(':image', $data['image']);
    }

    $stmt->execute();
  }

  private function updateGroupName(int $eventId, string $groupName): void
  {
    $stmt = $this->db->prepare("UPDATE groups SET name = :group_name WHERE event_id = :event_id");
    $stmt->execute(['group_name' => $groupName, 'event_id' => $eventId]);
  }

  private function updateGuests(int $eventId, array $userIds, array $guestStatuses): void
  {
    $groupId = $this->getGroupIdByEventId($eventId);

    foreach ($userIds as $index => $userId) {
      $status = $guestStatuses[$index];
      $stmt = $this->db->prepare(
        "UPDATE group_users SET status = :status WHERE group_id = :group_id AND user_id = :user_id"
      );
      $stmt->execute([
        'status' => $status,
        'group_id' => $groupId,
        'user_id' => $userId
      ]);
    }
  }

  private function getGroupIdByEventId(int $eventId): int
  {
    $stmt = $this->db->prepare("SELECT id FROM groups WHERE event_id = :event_id");
    $stmt->execute(['event_id' => $eventId]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result['id'];
  }

  public function getLastGroupId(): array
  {
    $stmt = $this->db->query("SELECT id FROM groups ORDER BY id DESC LIMIT 1");
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  public function getLastEventId(): array
  {
    $stmt = $this->db->query("SELECT id FROM events ORDER BY id DESC LIMIT 1");
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  public function getModelType(int $modelId): array
  {
    $stmt = $this->db->prepare("SELECT type FROM models WHERE id = :id");
    $stmt->execute(['id' => $modelId]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  private function processEventResults(array $results): array|stdClass
  {
    if (empty($results)) {
      return new stdClass();
    }

    $event = $this->mapEventData($results[0]);
    $event['guests'] = $this->mapGuestData($results);

    return $event;
  }

  private function mapEventData(array $data): array
  {
    return [
      'event_id' => $data['event_id'],
      'event_name' => $data['event_name'],
      'image' => $data['image'],
      'type' => $data['type'],
      'created_at' => $data['created_at'],
      'time' => $data['time'],
      'place' => $data['place'],
      'description' => $data['description'],
      'size' => $data['size'],
      'author' => [
        'id' => $data['author_id'],
        'firstname' => $data['author_firstname'],
        'lastname' => $data['author_lastname'],
        'email' => $data['author_email']
      ],
      'group' => [
        'id' => $data['group_id'],
        'name' => $data['group_name']
      ]
    ];
  }

  private function mapGuestData(array $results): array
  {
    $guests = [];
    foreach ($results as $data) {
      $guests[] = [
        'id' => $data['guest_id'],
        'firstname' => $data['guest_firstname'],
        'lastname' => $data['guest_lastname'],
        'email' => $data['guest_email'],
        'status' => $data['guest_status'],
        'registered_at' => $data['registered_at'],
        'confirmed_at' => $data['confirmed_at'],
        'canceled_at' => $data['canceled_at']
      ];
    }
    return $guests;
  }
}
