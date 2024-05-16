<?php

namespace App\Controllers;

use App\Models\EventModel;

class Events extends Controller
{
  protected object $events;

  public function __construct($params)
  {
    $this->events = new EventModel();

    parent::__construct($params);
  }

  protected function getEvents()
  {
    return $this->events->getAll();
  }
}
