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
    $body = (array) json_decode(file_get_contents('php://input'));

    $this->model->add($body);

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
    $body = (array) json_decode(file_get_contents('php://input'));

    $this->model->update($body);

    return $this->model->getLast();
  }
}
