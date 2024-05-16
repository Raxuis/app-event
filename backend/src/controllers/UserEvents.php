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
  public function getEvent()
  {
    return $this->event->getUserEvents(intval($this->params['user_email']));
  }

  public function postEvent()
  {
    $body = (array) json_decode(file_get_contents('php://input'));

    $this->event->add($body);

    return $this->event->getLast();
  }

  public function deleteEvent()
  {
    return $this->event->delete(intval($this->params['id']));
  }
  public function putEvent()
  {

    $this->event->update($this->body);

    return $this->event->getLast();
  }
}
