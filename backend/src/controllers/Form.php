<?php

namespace App\Controllers;

use App\Models\FormModel;
use stdClass;

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
    $forms = $this->form->get();
    return $this->sanitizeOutput($forms);
  }
}
