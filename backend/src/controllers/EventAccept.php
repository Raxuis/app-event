<?php

namespace App\Controllers;

use App\Models\EventModel;

class EventAccept extends Controller
{
  protected object $event;

  public function __construct($params)
  {
    $this->event = new EventModel();

    parent::__construct($params);
  }
  public function putEventAccept()
  {

    $this->event->accept($this->body);

    return $this->event->getLast();
  }
}
