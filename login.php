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

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

if (!$username || !$password) {
    echo json_encode(["status" => "error", "message" => "All fields required"]);
    exit;
}

// Find user
$stmt = $pdo->prepare("SELECT id, username, email, password_hash FROM users WHERE username = ? OR email = ?");
$stmt->execute([$username, $username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password_hash'])) {
    echo json_encode(["status" => "error", "message" => "Invalid credentials"]);
    exit;
}

// Return user info (you can also start PHP session if needed)
echo json_encode([
    "status" => "success",
    "message" => "Login successful",
    "user" => [
        "id" => $user['id'],
        "username" => $user['username'],
        "email" => $user['email']
    ]
]);
?>
