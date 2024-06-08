<?php

namespace App\Controllers;

use App\Models\ModelModel;
use Exception;

class Model extends Controller
{
  protected object $model;

  public function __construct($params)
  {
    $this->model = new ModelModel();

    parent::__construct($params);
  }

  public function getModel()
  {
    try {
      $model = $this->sanitizeOutput($this->model->get(intval($this->params['id'])));
      if (empty((array) $model)) {
        $this->respond(404, ['error' => 'Model not found']);
      } else {
        $this->respond(200, $model);
      }
    } catch (Exception $e) {
      $this->respond(500, ['error' => 'Error fetching model: ' . $e->getMessage()]);
    }
  }
}
