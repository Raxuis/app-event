<?php
namespace App\Models;

use \PDO;
use stdClass;
use Exception;

class ResourceModel extends SqlConnect
{
  public function allocateEventResource(array $data): void
  {
    try {
      $insertResourceQuery = "INSERT INTO resources (name, cost, type) VALUES (:name, :cost, :type)";
      $reqInsertResource = $this->db->prepare($insertResourceQuery);
      $reqInsertResource->execute([
        "name" => $data['name'],
        "cost" => $data['cost'],
        "type" => $data['type']
      ]);
      $resourceId = $this->getLastResourceInserted()['id'];

      $query = "INSERT INTO event_resources (event_id, resource_id, quantity) 
                VALUES (:event_id, :resource_id, :quantity)";
      $req = $this->db->prepare($query);
      $req->execute([
        "event_id" => $data['event_id'],
        "resource_id" => $resourceId,
        "quantity" => $data['quantity']
      ]);
    } catch (Exception $e) {
      throw new Exception("Error allocating event resource: " . $e->getMessage());
    }
  }

  public function delete(int $id): void
  {
    $req = $this->db->prepare("DELETE FROM event_resources WHERE id =:id");
    $req->execute(["id" => $id]);
  }

  public function getEventResources(int $event_id)
  {
    $req = $this->db->prepare(
      "SELECT r.id as resource_id, er.id as event_resource_id, r.name as resource_name, r.type as resource_type, r.cost as resource_cost,
      r.updated_at as resource_updated_at, er.quantity as resource_quantity, er.status as resource_status,
      e.id as event_id, e.name as event_name, e.description as event_description, e.user_id as event_author_id
      FROM resources as r
      INNER JOIN event_resources as er ON r.id = er.resource_id
      INNER JOIN events as e ON er.event_id = e.id
      WHERE event_id = :event_id"
    );
    $req->execute(["event_id" => $event_id]);

    return $req->rowCount() > 0 ? $req->fetchAll(PDO::FETCH_ASSOC) : new stdClass();
  }

  public function update(array $data)
  {
    // Update method logic
  }

  public function getLastResourceInserted()
  {
    $req = $this->db->prepare("SELECT * FROM resources ORDER BY id DESC LIMIT 1");
    $req->execute();

    return $req->rowCount() > 0 ? $req->fetch(PDO::FETCH_ASSOC) : new stdClass();
  }

  public function getLast()
  {
    $req = $this->db->prepare("SELECT * FROM event_resources ORDER BY id DESC LIMIT 1");
    $req->execute();

    return $req->rowCount() > 0 ? $req->fetch(PDO::FETCH_ASSOC) : new stdClass();
  }
}
