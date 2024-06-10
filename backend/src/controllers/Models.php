<?php

namespace App\Controllers;

use App\Models\ModelModel;
use Exception;

class Models extends Controller
{
  protected object $models;

  public function __construct($params)
  {
    $this->models = new ModelModel();
    parent::__construct($params);
  }
  public function getModels()
  {
      return $this->sanitizeOutput($this->models->getAll());
  }
}
