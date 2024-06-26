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
    // Step 1: Check if user_ids are provided, indicating a group event
    if (isset($data['user_ids'])) {
      // Step 2: If user_ids provided, handle group creation
      return $this->handleGroupCreation($data);
    } else {
      // Step 3: If user_ids not provided, create a regular event
      return $this->createEvent($data);
    }
  }

  // Passing array &$data => The data for the event, passed by reference to modify the original array.
  private function handleGroupCreation(array &$data): array
  {
    // Checking if the number of guests is bigger than the number of places
    // If so returning HTTP response 400
    if (count($data['user_ids']) > $data['size']) {
      header('HTTP/1.0 400 Too many Users');
      return ['code' => '400', 'message' => 'Too many users'];
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
  // Useful function to add users to a group when creating an event
  private function addUsersToGroup(array $data): void
  {
    foreach ($data['user_ids'] as $userId) {
      $groupUserStmt = $this->db->prepare(
        "INSERT INTO group_users (group_id, user_id, status) VALUES (:group_id, :user_id, :status)"
      );
      $status = ($data['user_id'] === $userId) ? 'confirmed' : 'registered'; // Making the event admin already confirmed
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
    // INSERT INTO SQL query using %s to fill it with values
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

    header('HTTP/1.0 201 Created');
    return ['code' => '201', 'message' => 'Event created'];
  }
  // Using bindValue() to had conditions like if the user sent an image in a form
  private function bindEventParams($stmt, $data): void
  {
    $stmt->bindValue(':name', $data['name']);
    $stmt->bindValue(':description', $data['description']);
    $stmt->bindValue(':size', $data['size']);
    $stmt->bindValue(':time', $data['time']);
    $stmt->bindValue(':place', $data['place']);

    if (isset($data['user_id'])) {
      $stmt->bindValue(':user_id', $data['user_id']);
    }
    if (isset($data['image'])) {
      $stmt->bindValue(':image', $data['image']);
    }
    if (isset($data['id'])) {
      $stmt->bindValue(':id', $data['id']);
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
  // A function useful for eventCreations
  private function updateGroupEventId(int $groupId, int $eventId): void
  {
    $groupStmt = $this->db->prepare("UPDATE groups SET event_id = :event_id WHERE id = :id");
    $groupStmt->execute(['event_id' => $eventId, 'id' => $groupId]);
  }

  public function delete(int $id): void
  {
    $stmt = $this->db->prepare("DELETE FROM events WHERE id = :id");
    $stmt->execute(["id" => $id]);
  }

  public function get(int $id): array
  {
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
  }
  // A function to get the events from a user by their id
  // It checks if their are in the guests or simply the author of the event
  public function getUserEvents(int $userId): array
  {
    $stmt = $this->db->prepare(
      "SELECT e.id AS event_id, e.name AS event_name, e.image, e.type, e.created_at, e.time, e.place, e.description, e.size, 
      e.user_id AS author_id, e.group_id,
      u.firstname AS author_firstname, u.lastname AS author_lastname, u.email AS author_email,
      gu.status AS guest_status, gu.registered_at, gu.confirmed_at, gu.canceled_at, us.id AS guest_id, g.name as group_name,
      us.firstname AS guest_firstname, us.lastname AS guest_lastname, us.email AS guest_email
      FROM events AS e
      LEFT JOIN users AS u ON e.user_id = u.id
      LEFT JOIN groups AS g ON e.group_id = g.id
      LEFT JOIN group_users AS gu ON gu.group_id = g.id
      LEFT JOIN users AS us ON gu.user_id = us.id
      WHERE e.user_id =:user_id OR gu.user_id =:user_id
      ORDER BY e.time ASC"
    );

    $stmt->execute(["user_id" => $userId]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return $this->processMultipleEventResults($results);
  }


  private function processEventResults(array $results): array
  {
    if (empty($results)) {
      return [];
    }

    $event = $this->initializeEventArray($results[0]);

    $guestsAdded = [];
    foreach ($results as $row) {
      if (!in_array($row['guest_id'], $guestsAdded)) {
        $event['guests'][] = $this->extractGuestData($row);
        $guestsAdded[] = $row['guest_id'];
      }

      if ($row['resource_id'] !== null) {
        $event['event_resources'][] = ['resource_id' => $row['resource_id']];
      }
    }

    $event['custom_fields'] = $this->fetchCustomFields($event['event_id']);

    return $event;
  }
  // A function to fetch the event fields
  private function initializeEventArray(array $row): array
  {
    return [
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
      'group_name' => $row['group_name'],
      'guests' => [],
      'event_resources' => []
    ];
  }

  // A function to get a guest information
  private function extractGuestData(array $row): array
  {
    return [
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
  // A function to get an event custom fields if present
  private function fetchCustomFields(int $eventId): array
  {
    $stmt = $this->db->prepare("SELECT field_name, field_value, id FROM custom_fields WHERE event_id = :event_id");
    $stmt->execute(['event_id' => $eventId]);

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
  }

  public function getAll(): array|stdClass
  {
    $stmt = $this->db->prepare(
      "SELECT e.id AS event_id, e.name AS event_name, e.image, e.type, e.created_at, e.time, e.place, 
      e.description, e.size, e.user_id AS author_id, e.group_id,
      u.firstname AS author_firstname, u.lastname AS author_lastname, u.email AS author_email,
      gu.status AS guest_status, gu.registered_at, gu.confirmed_at, gu.canceled_at, us.id AS guest_id,
      us.firstname AS guest_firstname, us.lastname AS guest_lastname, us.email AS guest_email, g.name AS group_name
      FROM events AS e
      INNER JOIN users AS u ON e.user_id = u.id
      LEFT JOIN groups AS g ON e.group_id = g.id
      LEFT JOIN group_users AS gu ON gu.group_id = g.id
      LEFT JOIN users AS us ON gu.user_id = us.id
      ORDER BY e.time ASC"
    );

    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return $this->processMultipleEventResults($results);
  }

  private function processMultipleEventResults(array $results): array|stdClass
  {
    if (empty($results)) {
      return new stdClass();
    }

    $events = [];
    foreach ($results as $row) {
      if (!isset($events[$row['event_id']])) {
        $events[$row['event_id']] = $this->initializeEventArray($row);
      }

      if (!isset($events[$row['event_id']]['guests'][$row['guest_id']])) {
        $events[$row['event_id']]['guests'][] = $this->extractGuestData($row);
      }

      if (isset($row['resource_id']) && $row['resource_id'] !== null && !isset($events[$row['event_id']]['event_resources'][$row['resource_id']])) {
        $events[$row['event_id']]['event_resources'][] = ['resource_id' => $row['resource_id']];
      }
    }

    foreach ($events as &$event) {
      $event['custom_fields'] = $this->fetchCustomFields($event['event_id']);
    }

    return array_values($events);
  }

  private function getLastGroupId(): array
  {
    return $this->db->query("SELECT id FROM groups ORDER BY id DESC LIMIT 1")->fetch(PDO::FETCH_ASSOC);
  }

  private function getLastEventId(): array
  {
    return $this->db->query("SELECT id FROM events ORDER BY id DESC LIMIT 1")->fetch(PDO::FETCH_ASSOC);
  }

  private function getModelType(int $modelId): array
  {
    $stmt = $this->db->prepare("SELECT type FROM models WHERE id = :model_id");
    $stmt->execute(['model_id' => $modelId]);

    return $stmt->fetch(PDO::FETCH_ASSOC);
  }
  public function update(int $id, array $data): array
  {
    try {
      // Step 1: Validate user IDs and size
      if (isset($data['user_ids']) && (count($data['user_ids']) > $data['size'])) {
        header('HTTP/1.0 400 Too many Users'); // Bad Request
        return [
          'code' => '400',
          'message' => 'Too many users'
        ];
      }

      // Step 2: Update the event details
      $this->updateEventDetails($id, $data);

      // Step 3: Update the group name if provided
      if (isset($data['group_name'])) {
        $this->updateGroupName($id, $data['group_name']);
      }

      // Step 4: Update guests if provided
      if (isset($data['user_ids']) && isset($data['guest_statuses'])) {
        $this->updateGuests($id, $data);
      }

      // Step 5: Handle custom fields
      if (isset($data['custom_fields']) && is_array($data['custom_fields'])) {
        $this->handleCustomFields($id, $data['custom_fields']);
      }

      header('HTTP/1.0 201 Created'); // Created
      return [
        'code' => '201',
        'message' => 'Event updated',
      ];
    } catch (Exception $e) {
      throw $e;
    }
  }

  private function updateEventDetails(int $id, array $data): void
  {
    $requiredDatas = array(
      'name' => $data['name'],
      'description' => $data['description'],
      'size' => $data['size'],
      'time' => $data['time'],
      'place' => $data['place']
    );

    $query = "UPDATE events SET name = :name, description = :description, size = :size, time = :time, place = :place, image = :image WHERE id = :id";

    $stmt = $this->db->prepare($query);

    // Bind parameters using bindEventParams
    $this->bindEventParams($stmt, $requiredDatas);

    // Binding parameter image if set to avoid conflicts with add function
    if (isset($data['image'])) {
      $stmt->bindValue(':image', $data['image']);
    } else {
      $stmt->bindValue(':image', null);
    }

    $stmt->bindValue(':id', $id);
    $stmt->execute();
  }

  private function updateGroupName(int $id, string $groupName): void
  {
    $groupQuery = "UPDATE groups SET name = :group_name WHERE id = (SELECT group_id FROM events WHERE id = :event_id)";
    $groupStmt = $this->db->prepare($groupQuery);
    $groupStmt->execute(['group_name' => $groupName, 'event_id' => $id]);
  }

  private function updateGuests(int $id, array $data): void
  {
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

  private function handleCustomFields(int $id, array $customFields): void
  {
    $deleteQuery = "DELETE FROM custom_fields WHERE event_id = :event_id";
    $deleteStmt = $this->db->prepare($deleteQuery);
    $deleteStmt->execute(['event_id' => $id]);

    $customFieldQuery = "INSERT INTO custom_fields (event_id, field_name, field_value) VALUES (:event_id, :field_name, :field_value)";
    $customFieldStmt = $this->db->prepare($customFieldQuery);

    foreach ($customFields as $field) {
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
  public function userEventInteraction(array $body): void
  {
    $validStatuses = ['accepted', 'registered', 'canceled'];

    // Checking if the provided status is valid
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
}