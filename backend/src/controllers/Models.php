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
    $body = (array) json_decode(file_get_contents('php://input'));

    $this->models->add($body);

    return $this->models->getLast();
  }

  public function deleteModels()
  {
    return $this->models->delete(intval($this->params['id']));
  }

  public function getModels()
  {
    return $this->models->getAll();
  }
}
