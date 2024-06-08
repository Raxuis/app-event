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
    $body = $this->sanitizeInput($this->body);
    $this->model->add($body);

    $lastModel = $this->sanitizeOutput($this->model->getLast());
    return $lastModel;
  }

  public function deleteModel()
  {
    $this->model->delete(intval($this->params['id']));
  }

  public function getModel()
  {
    return $this->sanitizeOutput($this->model->get(intval($this->params['id'])));
  }
  public function putModel()
  {
    $body = $this->sanitizeInput($this->body);
    $this->model->update($body);
  }
}
