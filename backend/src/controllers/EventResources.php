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
}
