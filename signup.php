<?php
// Allow CORS from anywhere (for development)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>


<?php
header("Content-Type: application/json");
require 'db.php';

// Get data from AJAX
$username = trim($_POST['username'] ?? '');
$email = trim($_POST['email'] ?? '');
$password = trim($_POST['password'] ?? '');

if (!$username || !$email || !$password) {
    echo json_encode(["status" => "error", "message" => "All fields are required"]);
    exit;
}


// Check if user already exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
$stmt->execute([$username, $email]);
if ($stmt->fetch()) {
    echo json_encode(["status" => "error", "message" => "Username or Email already taken"]);
    exit;
}

// Hash password
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

// Insert user
$stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
$stmt->execute([$username, $email, $passwordHash]);

echo json_encode(["status" => "success", "message" => "User registered successfully"]);
?>
