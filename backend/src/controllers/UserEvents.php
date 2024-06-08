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
}
