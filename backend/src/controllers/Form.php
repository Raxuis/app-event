<?php

namespace App\Controllers;

use App\Models\FormModel;

class Form extends Controller
{
  protected object $form;

  public function __construct($params)
  {
    $this->form = new FormModel();

    parent::__construct($params);
  }

  public function getForm()
  {
    return $this->form->get();
  }
}
