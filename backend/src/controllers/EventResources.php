<?php

namespace App\Controllers;

use App\Models\ResourceModel;
use Exception;

class EventResources extends Controller
{
  protected object $event_resources;

  public function __construct($params)
  {
    // Initialize the ResourceModel
    $this->event_resources = new ResourceModel();

    // Call the parent constructor
    parent::__construct($params);
  }

  public function getEventResources()
  {
    try {
      $resources = $this->event_resources->getAll(intval($this->params['event_id']));
      return $this->respond(200, $this->sanitizeOutput($resources));
    } catch (Exception $e) {
      return $this->respond(500, ['error' => 'An error occurred while retrieving event resources.']);
    }
  }

  public function postEventResources()
  {
    try {
      $body = $this->sanitizeInput((array) json_decode(file_get_contents('php://input')));
      $this->event_resources->add($body);

      $lastResource = $this->event_resources->getLast();
      return $this->respond(200, $this->sanitizeOutput($lastResource));
    } catch (Exception $e) {
      return $this->respond(500, ['error' => 'An error occurred while adding the event resource.']);
    }
  }
}
