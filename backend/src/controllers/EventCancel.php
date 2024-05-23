<?php

namespace App\Controllers;

use App\Models\EventModel;

class EventCancel extends Controller
{
  protected object $event;

  public function __construct($params)
  {
    $this->event = new EventModel();

    parent::__construct($params);
  }
  public function putEventCancel()
  {

    $this->event->cancel($this->body);

    return $this->event->getLast();
  }
}
