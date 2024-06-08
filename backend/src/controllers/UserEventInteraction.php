<?php

namespace App\Controllers;

use App\Models\EventModel;
use Exception;

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
    try {
      $sanitizedData = $this->sanitizeInput($this->body);

      $result = $this->event->userEventInteraction($sanitizedData);
      $sanitizedOutput = $this->sanitizeOutput($result);
      return $this->respond(200, $sanitizedOutput);
    } catch (Exception $e) {
      $this->respond(500, ['error' => 'An error occurred while processing the request.' . $e->getMessage()]);
    }
  }
}
