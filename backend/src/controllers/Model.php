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
      return $this->sanitizeOutput($this->model->get(intval($this->params['id'])));
  }
}
