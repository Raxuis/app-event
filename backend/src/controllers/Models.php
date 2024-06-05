<?php

namespace App\Controllers;

use App\Models\ModelModel;

class Models extends Controller
{
  protected object $models;

  public function __construct($params)
  {
    $this->models = new ModelModel();

    parent::__construct($params);
  }

  public function postModels()
  {
    $body = $this->sanitizeInput($this->body);
    $this->models->add($body);

    $lastModel = $this->models->getLast();
    return $this->sanitizeOutput($lastModel);
  }

  public function deleteModels()
  {
    return $this->models->delete(intval($this->params['id']));
  }

  public function getModels()
  {
    $models = $this->models->getAll();
    return $this->sanitizeInput($models);
  }
}
