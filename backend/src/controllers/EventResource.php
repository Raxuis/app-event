<?php
namespace App\Controllers;

use App\Models\ResourceModel;
use Exception;

class EventResource extends Controller
{
  protected object $event_resource;

  public function __construct($params)
  {
    $this->event_resource = new ResourceModel();
    parent::__construct($params);
  }

  public function getEventResource()
  {
    $resource = $this->event_resource->get(intval($this->params['id']));
    return $this->sanitizeOutput($resource);
  }

  protected function postEventResource()
  {
    $body = $this->sanitizeInput((array) json_decode(file_get_contents('php://input'), true));

    try {
      $this->event_resource->allocateEventResource($body);
      $resource = $this->sanitizeOutput($this->event_resource->getLast());

      if ($resource) {
        http_response_code(200); // OK
        echo json_encode($resource);
      } else {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to retrieve the last event resource.']);

      }
    } catch (Exception $e) {
      $this->respond(500, ['message' => 'Internal Error' . $e->getMessage()]);
    }
  }

  protected function deleteEventResource()
  {
    return $this->event_resource->delete(intval($this->params['id']));
  }

  protected function putEventResource()
  {
    $body = $this->sanitizeInput((array) json_decode(file_get_contents('php://input'), true));

    try {
      $result = $this->event_resource->update($body);
      if ($result) {
        http_response_code(200); // OK
        echo json_encode(['message' => 'Resource updated successfully.']);
      } else {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to update the resource.']);
      }
    } catch (Exception $e) {
      $this->respond(500, ['message' => 'Internal Error' . $e->getMessage()]);
    }
  }
}
