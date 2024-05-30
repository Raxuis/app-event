<?php

namespace App\Controllers;

use App\Models\ResourceModel;

class EventResource extends Controller
{
  protected object $event_resource;

  public function __construct($params)
  {
    $this->event_resource = new ResourceModel();

    parent::__construct($params);
  }
  public function getEventRessource()
  {
    return $this->event_resource->getEventResources(intval($this->params['event_id']));
  }

  public function postEventResource()
  {
    $body = (array) json_decode(file_get_contents('php://input'));

    $this->event_resource->add($body);

    return $this->event_resource->getLast();
  }

  public function deleteEventResource()
  {
    return $this->event_resource->delete(intval($this->params['id']));
  }
  public function putEventResource()
  {

    $this->event_resource->update($this->body);

    return $this->event_resource->getLast();
  }
}
