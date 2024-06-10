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

    protected function postAuth()
    {
        return $this->user->userVerification($this->body);
    }

    public function getAuth()
    {
        $userInfos = $this->user->getBySessionId($this->params['id']);
        if (!empty($userInfos)) {
            header('HTTP/1.0 200 OK');
            return [
                'code' => '200',
                'message' => 'Session OK',
                'user_id' => $userInfos['id'],
            ];
        }
        header('HTTP/1.0 401 Unauthorized');
        return [
            'code' => '401',
            'message' => 'Session Unauthorized'
        ];
    }

}
