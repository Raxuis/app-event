<?php

namespace App\Controllers;

use App\Models\EventModel;

class UserEventInteraction extends Controller
{
  protected object $event;

  public function __construct($params)
  {
    $this->event = new EventModel();

    parent::__construct($params);
  }
  public function putUserEventInteraction()
  {

    return $this->event->userEventInteraction($this->body);
  }
}
