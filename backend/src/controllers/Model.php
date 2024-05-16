<?php

namespace App\Controllers;

use App\Models\ModelModel;

class Model extends Controller
{
  protected object $model;

  public function __construct($params)
  {
    $this->model = new ModelModel();

    parent::__construct($params);
  }

  public function postModel()
  {

    $this->model->add($this->body);

    return $this->model->getLast();
  }

  public function deleteModel()
  {
    return $this->model->delete(intval($this->params['id']));
  }

  public function getModel()
  {
    return $this->model->get(intval($this->params['id']));
  }
  public function putModel()
  {

    $this->model->update($this->body);

    return $this->model->getLast();
  }
}
