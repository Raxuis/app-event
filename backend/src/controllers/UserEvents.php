<?php

namespace App\Controllers;

use App\Models\EventModel;

class UserEvents extends Controller
{
  protected object $event;

  public function __construct($params)
  {
    $this->event = new EventModel();

    parent::__construct($params);
  }
  public function getUserEvents()
  {
    $userEvents = $this->event->getUserEvents(intval($this->params['user_id']));
    return $this->sanitizeOutput($userEvents);
  }

  public function postUserEvents()
  {
    $body = $this->sanitizeInput($this->body);
    $this->event->add($body);

    $lastUserEvent = $this->sanitizeOutput($this->event->getLast());
    return $lastUserEvent;
  }

  public function deleteUserEvents()
  {
    return $this->event->delete(intval($this->params['id']));
  }
  public function putUserEvents()
  {
    $body = $this->sanitizeInput($this->body);
    $this->event->update($body);
  }
}
