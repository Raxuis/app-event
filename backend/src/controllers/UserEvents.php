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
    return $this->event->getUserEvents(intval($this->params['user_id']));
  }

  public function postUserEvents()
  {
    $body = (array) json_decode(file_get_contents('php://input'));

    $this->event->add($body);

    return $this->event->getLast();
  }

  public function deleteUserEvents()
  {
    return $this->event->delete(intval($this->params['id']));
  }
  public function putUserEvents()
  {

    $this->event->update($this->body);

    return $this->event->getLast();
  }
}
