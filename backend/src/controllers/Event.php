<?php
namespace App\Controllers;

use App\Models\EventModel;
use Exception;

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
    $this->event->add($body);
  }

  public function putEvent()
  {
    $eventId = intval($this->params['id']);
    $body = $this->sanitizeInput($this->body);
    $result = $this->event->update($eventId, $body);
  }

  public function deleteEvent()
  {
    $eventId = intval($this->params['id']);
    $this->event->delete($eventId);
  }

  public function getEvent()
  {
    $eventId = intval($this->params['id']);
    return $this->event->get($eventId);
  }
}