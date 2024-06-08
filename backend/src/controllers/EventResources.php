<?php

namespace App\Controllers;

use App\Models\ResourceModel;
use Exception;

class EventResources extends Controller
{
  protected object $event_resources;

  public function __construct($params)
  {
    $this->event_resources = new ResourceModel();

    parent::__construct($params);
  }

  public function getEventResources()
  {
    return $this->event_resources->getAll(intval($this->params['event_id']));
  }

  public function postEventResources()
  {
    $body = $this->sanitizeInput((array) json_decode(file_get_contents('php://input')));
    $this->event_resources->add($body);

    return $this->event_resources->getLast();
  }
}
