<?php
header("Content-Type: application/json");
require 'db.php';

$stmt = $pdo->query("
    SELECT memes.id, memes.caption, memes.image_path, memes.likes, memes.upvotes, memes.created_at, 
           users.username 
    FROM memes 
    JOIN users ON memes.user_id = users.id 
    ORDER BY memes.created_at DESC
");

$memes = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["status" => "success", "memes" => $memes]);
?>
