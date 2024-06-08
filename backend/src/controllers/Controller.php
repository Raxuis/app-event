<?php

namespace App\Controllers;

class Controller
{
  protected array $params;
  protected string $reqMethod;
  protected array $body;
  protected string $className;

  public function __construct($params)
  {
    $this->className = $this->getCallerClassName();
    $this->params = $params;
    $this->reqMethod = strtolower($_SERVER['REQUEST_METHOD']);
    $this->body = (array) json_decode(file_get_contents('php://input'));

    $this->header();
    $this->ifMethodExist();
  }

  protected function getCallerClassName()
  {
    $backtrace = debug_backtrace(DEBUG_BACKTRACE_PROVIDE_OBJECT, 2);

    if (isset($backtrace[1]['object'])) {
      $fullClassName = get_class($backtrace[1]['object']);
      $className = basename(str_replace('\\', '/', $fullClassName));

      return $className;
    }

    return 'Unknown';
  }

  protected function header()
  {
    header('Access-Control-Allow-Origin: *');
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Methods: PUT, DELETE, PATCH, POST, OPTIONS");
    header('Content-type: application/json; charset=utf-8');

    if ($this->reqMethod === 'options') {
      header('Access-Control-Max-Age: 86400');
      exit;
    }
  }

  protected function ifMethodExist()
  {
    $method = $this->reqMethod . '' . $this->className;

    if (method_exists($this, $method)) {
      echo json_encode($this->$method());

      return;
    }

    header('HTTP/1.0 404 Not Found');
    echo json_encode([
      'code' => '404',
      'message' => 'Not Found'
    ]);

    return;
  }
  protected function sanitizeInput($data)
  {
    $sanitizedData = [];
    foreach ($data as $key => $value) {
      if (is_string($value)) {
        $sanitizedData[$key] = htmlspecialchars(strip_tags($value), ENT_QUOTES, 'UTF-8');
      } else {
        $sanitizedData[$key] = $value;
      }
    }
    return $sanitizedData;
  }

  protected function sanitizeOutput($data)
  {
    if (is_array($data)) {
      foreach ($data as $key => $value) {
        $data[$key] = $this->sanitizeOutput($value);
      }
    } else if (is_string($data)) {
      $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    }
    return $data;
  }

  protected function respond(int $statusCode, array $data)
  {
    header("HTTP/1.0 $statusCode");
    echo json_encode($data);
    exit;
  }
}