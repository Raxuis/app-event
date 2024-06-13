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

  public function getEvents()
  {
    $vents = $this->events->getAll();
    // Sanitizing the resources to prevent injection like script ones
    return $this->sanitizeOutput($vents);
  }
}
