<?php

namespace App\Controllers;

use App\Models\ResourceModel;
use Exception;

class RessourceQuantityInteraction extends Controller
{
  protected object $event_resource;

  public function __construct($params)
  {
    $this->event_resource = new ResourceModel();

    parent::__construct($params);
  }
  public function putRessourceQuantityInteraction()
  {
    try {
      $result = $this->event_resource->updateRessourceQuantity($this->body);

      header('Content-Type: application/json');
      if ($result['status'] === 'success') {
        header('HTTP/1.1 200 OK');
        echo json_encode([
          'status' => 'success',
          'data' => $result
        ]);
      } else {
        header('HTTP/1.1 400 Bad Request');
        echo json_encode([
          'status' => 'error',
          'message' => $result['message']
        ]);
      }
    } catch (Exception $e) {
      $this->respond(500, ['message' => 'Internal Error' . $e->getMessage()]);
    }
  }
}
