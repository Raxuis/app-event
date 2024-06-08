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
    try {
      $body = $this->sanitizeInput($this->body);
      $result = $this->event->add($body);
      $this->respond(201, $result);
    } catch (Exception $e) {
      $this->respond(500, ['error' => 'Failed to create event', 'details' => $e->getMessage()]);
    }
  }

  public function putEvent()
  {
    try {
      $eventId = intval($this->params['id']);
      $body = $this->sanitizeInput($this->body);
      $result = $this->event->update($eventId, $body);
      $this->respond(200, $result);
    } catch (Exception $e) {
      $this->respond(500, ['error' => 'Failed to update event', 'details' => $e->getMessage()]);
    }
  }

  public function deleteEvent()
  {
    try {
      $eventId = intval($this->params['id']);
      $this->event->delete($eventId);
      $this->respond(204, ['message' => 'Event deleted successfully']);
    } catch (Exception $e) {
      $this->respond(500, ['error' => 'Failed to delete event', 'details' => $e->getMessage()]);
    }
  }

  public function getEvent()
  {
    try {
      $eventId = intval($this->params['id']);
      $event = $this->event->get($eventId);
      $this->respond(200, $this->sanitizeOutput($event));
    } catch (Exception $e) {
      $this->respond(500, ['error' => 'Failed to retrieve event', 'details' => $e->getMessage()]);
    }
  }
}