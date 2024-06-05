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
    $vents = $this->events->getAll();
    return $this->sanitizeOutput($vents);
  }
}
