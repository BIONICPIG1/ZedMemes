<?php
$host = "localhost";
$dbname = "zedmemes";
$user = "root";     // change if needed
$pass = "Playstation@1";         // change if needed

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["status" => "error", "message" => "DB Connection failed: " . $e->getMessage()]));
}
?>
