<?php

namespace App\Models;

use Exception;
use PDO;
use stdClass;

class UserModel extends SqlConnect
{
    public function add(array $data): void
    {
        try {
            session_start();

            $verif_query = "SELECT * FROM users WHERE email = :email";
            $verif_req = $this->db->prepare($verif_query);
            $verif_req->execute(["email" => $data['email']]);

            if ($verif_req->rowCount() > 0) {
                header('HTTP/1.0 409 Conflict');
                echo json_encode(['error' => 'Email already exists']);
                return;
            }

            $query = "INSERT INTO users (firstname, lastname, email, password, session_id) VALUES (:firstname, :lastname, :email, :password, :session_id)";
            $req = $this->db->prepare($query);
            $req->execute([
                "firstname" => $data['firstname'],
                "lastname" => $data['lastname'],
                "email" => $data['email'],
                "password" => password_hash($data['password'], PASSWORD_BCRYPT),
                "session_id" => session_id()
            ]);

            header('HTTP/1.0 201 Created');
            echo json_encode(['success' => 'User created successfully']);
        } catch (Exception $e) {
            header('HTTP/1.0 500 Internal Server Error');
            echo json_encode(['error' => 'An error occurred', 'details' => $e->getMessage()]);
        }
    }

    public function delete(int $id): void
    {
        $req = $this->db->prepare("DELETE FROM users WHERE id = :id");
        $req->execute(["id" => $id]);
    }

    public function get(int $id)
    {
        $req = $this->db->prepare("SELECT * FROM users WHERE id = :id");
        $req->execute(["id" => $id]);

        $user = $req->rowCount() > 0 ? $req->fetch(PDO::FETCH_ASSOC) : new stdClass();
        unset($user['password']);

        return $user;
    }

    public function update(array $data): void
    {
        $query = "UPDATE users SET firstname = :firstname, lastname = :lastname, password = :password, email = :email WHERE id = :id";
        $req = $this->db->prepare($query);
        $req->execute([
            "id" => $data['id'],
            "email" => $data['email'],
            "firstname" => $data['firstname'],
            "lastname" => $data['lastname'],
            "password" => password_hash($data['password'], PASSWORD_BCRYPT)
        ]);
    }

    public function getAll()
    {
        $req = $this->db->prepare("SELECT * FROM users");
        $req->execute();

        $users = $req->rowCount() > 0 ? $req->fetchAll(PDO::FETCH_ASSOC) : [];

        foreach ($users as &$user) {
            unset($user['password']);
        }

        return $users;
    }

    public function getLast()
    {
        $req = $this->db->prepare("SELECT * FROM users ORDER BY id DESC LIMIT 1");
        $req->execute();

        return $req->rowCount() > 0 ? $req->fetch(PDO::FETCH_ASSOC) : new stdClass();
    }

    public function userVerification(array $data): array
    {
        session_start();

        $req = $this->db->prepare("SELECT * FROM users WHERE email = :email");
        $req->execute(["email" => $data['email']]);
        $user = $req->fetch(PDO::FETCH_ASSOC);

        if (!$user || !password_verify($data['password'], $user['password'])) {
            header('HTTP/1.0 401 Unauthorized');
            return [
                'code' => '401',
                'message' => 'Session Unauthorized'
            ];
        }

        unset($user['password']); // Remove password from the response for security reasons
        $_SESSION['isLogged'] = true;
        $_SESSION['user']['email'] = $user['email'];
        $_SESSION['user']['firstname'] = $user['firstname'];
        $_SESSION['user']['lastname'] = $user['lastname'];
        return $_SESSION;
    }

    public function getByEmail(array $data)
    {
        $req = $this->db->prepare("SELECT * FROM users WHERE email = :email");
        $req->execute(["email" => $data['email']]);
        $user = $req->fetch(PDO::FETCH_ASSOC);
        unset($user['password']);
        return $user;
    }

    public function sessionVerification(): array
    {
        session_start(); // Start session

        if (isset($_SESSION['isLogged']) && $_SESSION['isLogged']) {
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
