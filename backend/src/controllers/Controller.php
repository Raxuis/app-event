<?php

namespace App\Controllers;

class Controller
{
  protected array $params;
  protected string $reqMethod;
  protected array $body;
  protected string $className;

  public function __construct(array $params)
  {
    $this->className = $this->getCallerClassName();
    $this->params = $params;
    $this->reqMethod = strtolower($_SERVER['REQUEST_METHOD']);
    $this->body = (array) json_decode(file_get_contents('php://input'), true);

    $this->header();
    $this->ifMethodExist();
  }

  protected function getCallerClassName(): string
  {
    $backtrace = debug_backtrace(DEBUG_BACKTRACE_PROVIDE_OBJECT, 2);

    if (isset($backtrace[1]['object'])) {
      $fullClassName = get_class($backtrace[1]['object']);
      $className = basename(str_replace('\\', '/', $fullClassName));

      return $className;
    }

    return 'Unknown';
  }

  protected function header(): void
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

  protected function ifMethodExist(): void
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

  // A function to secure the value written by user using htmlspecialchars
  protected function sanitizeInput(array $data): array
  {
    $sanitizedData = [];
    foreach ($data as $key => $value) {
      if (is_string($value)) {
        // Decoding HTML entities in the value
        $decodedValue = htmlspecialchars_decode($value);
        // Sanitizing the decoded value
        $sanitizedValue = htmlspecialchars($decodedValue, ENT_QUOTES, 'UTF-8');
        // Replacing & with &amp; to prevent XSS attacks and to prevent issues with &amp; duplicates
        $sanitizedData[$key] = preg_replace('/&(?!#\d+;)/', '&amp;', $sanitizedValue);
      } else {
        $sanitizedData[$key] = $value;
      }
    }
    return $sanitizedData;
  }

  // A function to secure the getter value using htmlspecialchars
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

  // A function to respond to the client with a status code and data => Useful for error handling
  // Could be used for HTTP status codes 200 but did find it useful
  protected function respond(int $statusCode, array $data): void
  {
    header("HTTP/1.0 $statusCode");
    echo json_encode($data);
    exit;
  }
}
