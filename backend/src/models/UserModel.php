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
            session_start(); // Start the session for session_id

            $verif_query = "SELECT * FROM users WHERE email = :email";
            $verif_req = $this->db->prepare($verif_query);
            $verif_req->execute(["email" => $data['email']]);

            if ($verif_req->rowCount() > 0) {
                throw new Exception('Email already exists', 409);
            }

            $query = "INSERT INTO users (firstname, lastname, email, password, session_id) VALUES (:firstname, :lastname, :email, :password, :session_id)";
            $req = $this->db->prepare($query);
            $req->execute([
                "firstname" => $data['firstname'],
                "lastname" => $data['lastname'],
                "email" => $data['email'],
                "password" => password_hash($data['password'], PASSWORD_BCRYPT), // hashing password with PASSWORD_BCRYPT to make it 60 characters long
                "session_id" => session_id() // Passing session_id to database to check during login authentification
            ]);
        } catch (Exception $e) {
            throw new Exception('Error creating user: ' . $e->getMessage(), 500);
        }
    }

    public function delete(int $id): void
    {
        try {
            $req = $this->db->prepare("DELETE FROM users WHERE id = :id");
            $req->execute(["id" => $id]);
        } catch (Exception $e) {
            throw new Exception('Error deleting user: ' . $e->getMessage(), 500);
        }
    }

    public function get(int $id): array|stdClass
    {
        try {
            $req = $this->db->prepare("SELECT * FROM users WHERE id = :id");
            $req->execute(["id" => $id]);

            $user = $req->rowCount() > 0 ? $req->fetch(PDO::FETCH_ASSOC) : new stdClass();
            if ($user) {
                unset($user['password']);
            }

            return $user;
        } catch (Exception $e) {
            throw new Exception('Error fetching user: ' . $e->getMessage(), 500);
        }
    }

    public function update(array $data): void
    {
        try {
            $query = "UPDATE users SET firstname = :firstname, lastname = :lastname, password = :password, email = :email WHERE id = :id";
            $req = $this->db->prepare($query);
            $req->execute([
                "id" => $data['id'],
                "email" => $data['email'],
                "firstname" => $data['firstname'],
                "lastname" => $data['lastname'],
                "password" => password_hash($data['password'], PASSWORD_BCRYPT) // hashing password with PASSWORD_BCRYPT to make it 60 characters long
            ]);
        } catch (Exception $e) {
            throw new Exception('Error updating user: ' . $e->getMessage(), 500);
        }
    }

    public function getAll(): array
    {
        try {
            $req = $this->db->prepare("SELECT * FROM users");
            $req->execute();

            $users = $req->rowCount() > 0 ? $req->fetchAll(PDO::FETCH_ASSOC) : [];
            foreach ($users as &$user) {
                unset($user['password']);
            }

            return $users;
        } catch (Exception $e) {
            throw new Exception('Error fetching users: ' . $e->getMessage(), 500);
        }
    }

    public function getLast(): array|stdClass
    {
        try {
            $req = $this->db->prepare("SELECT * FROM users ORDER BY id DESC LIMIT 1");
            $req->execute();

            $user = $req->rowCount() > 0 ? $req->fetch(PDO::FETCH_ASSOC) : new stdClass();
            if ($user) {
                unset($user['password']);
            }

            return $user;
        } catch (Exception $e) {
            throw new Exception('Error fetching last user: ' . $e->getMessage(), 500);
        }
    }

    public function userVerification(array $data): array
    {
        try {
            $req = $this->db->prepare("SELECT * FROM users WHERE email = :email");
            $req->execute(["email" => $data['email']]);
            $user = $req->fetch(PDO::FETCH_ASSOC);

            if (!$user || !password_verify($data['password'], $user['password'])) {
                throw new Exception('Session Unauthorized', 401);
            }

            return [
                'code' => '200',
                'message' => 'Session OK',
                'PHP_SESSID' => $user['session_id']
            ];
        } catch (Exception $e) {
            throw new Exception('Error verifying user: ' . $e->getMessage(), 500);
        }
    }

    public function getByEmail(array $data): array|stdClass
    {
        try {
            $req = $this->db->prepare("SELECT * FROM users WHERE email = :email");
            $req->execute(["email" => $data['email']]);
            $user = $req->fetch(PDO::FETCH_ASSOC);
            if ($user) {
                unset($user['password']);
            }
            return $user ?: new stdClass();
        } catch (Exception $e) {
            throw new Exception('Error fetching user by email: ' . $e->getMessage(), 500);
        }
    }

    public function getBySessionId(string $session_id): array|stdClass
    {
        try {
            $req = $this->db->prepare("SELECT * FROM users WHERE session_id = :session_id");
            $req->execute(["session_id" => $session_id]);
            $user = $req->fetch(PDO::FETCH_ASSOC);
            if ($user) {
                unset($user['password']);
                return $user;
            }

            return new stdClass();
        } catch (Exception $e) {
            throw new Exception('Error fetching user by session ID: ' . $e->getMessage(), 500);
        }
    }

    public function sessionVerification(): array
    {
        try {
            session_start(); // Start session

            if (isset($_SESSION['isLogged']) && $_SESSION['isLogged']) {
                return [
                    'code' => '200',
                    'message' => 'Session OK'
                ];
            }
            throw new Exception('Session Unauthorized', 401);
        } catch (Exception $e) {
            throw new Exception('Error verifying session: ' . $e->getMessage(), 500);
        }
    }
}
