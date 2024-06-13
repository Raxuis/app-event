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

  protected function postEvent(): array
  {
    $body = $this->sanitizeInput($this->body);
    return $this->event->add($body);
  }

  protected function putEvent(): void
  {
    $eventId = intval($this->params['id']);
    $body = $this->sanitizeInput($this->body);
    $this->event->update($eventId, $body);
  }

  protected function deleteEvent(): void
  {
    $eventId = intval($this->params['id']);
    $this->event->delete($eventId);
  }

  public function getEvent(): array|string
  {
    $eventId = intval($this->params['id']);
    $res = $this->event->get($eventId);
    if ($res !== '') {
      return $this->sanitizeOutput($res);
    }
    return '';
  }
}