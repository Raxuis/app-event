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

  public function postModels()
  {
    try {
      $body = $this->sanitizeInput($this->body);
      $this->models->add($body);

      $lastModel = $this->models->getLast();
      $sanitizedModel = $this->sanitizeOutput($lastModel);

      $this->respond(201, $sanitizedModel);
    } catch (Exception $e) {
      $this->respond(500, ['message' => 'Error creating model: ' . $e->getMessage()]);
    }
  }

  public function deleteModels()
  {
    try {
      $this->models->delete(intval($this->params['id']));
      $this->respond(204, ['message' => 'Model deleted successfully']);
    } catch (Exception $e) {
      $this->respond(500, ['message' => 'Error deleting model: ' . $e->getMessage()]);
    }
  }

  public function getModels()
  {
    try {
      $models = $this->models->getAll();
      $sanitizedModels = $this->sanitizeOutput($models);

      $this->respond(200, $sanitizedModels);
    } catch (Exception $e) {
      $this->respond(500, ['message' => 'Error fetching models: ' . $e->getMessage()]);
    }
  }
}
