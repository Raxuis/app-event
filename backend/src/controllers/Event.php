<?php

namespace App\Controllers;

use App\Models\EventModel;

class Event extends Controller
{
  protected object $event;

  public function __construct($params)
  {
    $this->event = new EventModel();

    parent::__construct($params);
  }
  public function postEvent()
  {
    $body = (array) json_decode(file_get_contents('php://input'));

    $this->event->add($body);

    return $this->event->getLast();
  }

  public function deleteEvent()
  {
    return $this->event->delete(intval($this->params['id']));
  }

  public function getEvent()
  {
    return $this->event->get(intval($this->params['id']));
  }

  protected
    function run(
  ) {
    $this->header();
    $this->ifMethodExist();
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

  protected function ifMethodExist(): void
  {
    $method = $this->reqMethod . 'event';

    if (method_exists($this, $method)) {
      header("HTTP/1.0 200 OK");
      echo json_encode($this->$method());
      return;
    }

    header("HTTP/1.0 404 Not Found");

    echo json_encode([
      'code' => '404',
      'event' => 'Not Found'
    ]);
  }

  // protected function getevent(): array
  // {
  //   return [
  //     'id' => '1',
  //     'event' => 'Bonjour ! Je viens de la base de données',
  //     'author' => 'Mr. Robot',
  //     'bot' => true,
  //     'avatar' => 'https://i.pinimg.com/736x/a3/b3/1a/a3b31a3d62d7643ebd97c49dc8c43ffa.jpg',
  //     'image' => null,
  //     'date' => 1711375196
  //   ];
  // }
}
