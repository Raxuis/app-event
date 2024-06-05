<?php
namespace App\Controllers;

use App\Models\EventModel;

class Event extends Controller
{
  protected object $event;

  public function __construct($params)
  {
    $this->event = new EventModel();
    parent::__construct($params);
  }

  public function postEvent()
  {
    $body = $this->sanitizeInput($this->body);
    return $this->event->add($body);
  }

  public function putEvent()
  {
    $eventId = intval($this->params['id']);
    $body = $this->sanitizeInput($this->body);
    return $this->event->update($eventId, $body);
  }

  public function deleteEvent()
  {
    $eventId = intval($this->params['id']);
    $this->event->delete($eventId);
    return $this->sanitizeOutput($this->event->get($eventId));
  }

  public function getEvent()
  {
    $eventId = intval($this->params['id']);
    return $this->sanitizeOutput($this->event->get($eventId));
  }
}
