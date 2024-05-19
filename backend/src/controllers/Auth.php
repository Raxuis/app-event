<?php

namespace App\Controllers;

use App\Models\UserModel;

class Auth extends Controller
{
    protected object $user;

    public function __construct($params)
    {
        $this->user = new UserModel();

        parent::__construct($params);
    }

    public function postAuth()
    {
        return $this->user->userVerification($this->body);
    }

    public function getAuth()
    {
        session_start();
        $user = $this->user->getByEmail($this->body);
        if (isset($_COOKIE["PHPSESSID"]) && $_COOKIE["PHPSESSID"] === $user["session_id"]) {
            header('HTTP/1.0 200 OK');
            return [
                'code' => '200',
                'message' => 'Session OK'
            ];
        }
        header('HTTP/1.0 401 Unauthorized');
        return [
            'code' => '401',
            'message' => 'Session Unauthorized'
        ];
    }
}
