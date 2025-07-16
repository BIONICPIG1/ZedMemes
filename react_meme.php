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

$user_id = $_POST['user_id'] ?? '';
$meme_id = $_POST['meme_id'] ?? '';
$reaction_type = $_POST['reaction_type'] ?? '';

if (!$user_id || !$meme_id || !$reaction_type) {
    echo json_encode(["status" => "error", "message" => "Missing fields"]);
    exit;
}

// Check if already reacted
$stmt = $pdo->prepare("SELECT id FROM meme_reactions WHERE meme_id = ? AND user_id = ? AND reaction_type = ?");
$stmt->execute([$meme_id, $user_id, $reaction_type]);

if ($stmt->fetch()) {
    // Remove reaction
    $pdo->prepare("DELETE FROM meme_reactions WHERE meme_id = ? AND user_id = ? AND reaction_type = ?")
        ->execute([$meme_id, $user_id, $reaction_type]);
    $pdo->prepare("UPDATE memes SET {$reaction_type}s = {$reaction_type}s - 1 WHERE id = ?")
        ->execute([$meme_id]);

    echo json_encode(["status" => "removed", "message" => "Reaction removed"]);
} else {
    // Add reaction
    $pdo->prepare("INSERT INTO meme_reactions (meme_id, user_id, reaction_type) VALUES (?, ?, ?)")
        ->execute([$meme_id, $user_id, $reaction_type]);
    $pdo->prepare("UPDATE memes SET {$reaction_type}s = {$reaction_type}s + 1 WHERE id = ?")
        ->execute([$meme_id]);

    echo json_encode(["status" => "added", "message" => "Reaction added"]);
}
?>
