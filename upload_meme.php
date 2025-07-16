<?php
header("Content-Type: application/json");

// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

// Check if file was uploaded
if (!isset($_FILES['memeFile']) || $_FILES['memeFile']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(["status" => "error", "message" => "No file uploaded or upload error"]);
    exit;
}

// Get form data
$user_id = $_POST['user_id'] ?? null;
$caption = $_POST['caption'] ?? '';

if (!$user_id) {
    echo json_encode(["status" => "error", "message" => "User not authenticated"]);
    exit;
}

// File upload handling
$uploadDir = "uploads/";
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        echo json_encode(["status" => "error", "message" => "Failed to create upload directory"]);
        exit;
    }
}

// Validate file type
$file = $_FILES['memeFile'];
$fileType = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$allowed = ["jpg", "jpeg", "png", "gif"];
if (!in_array($fileType, $allowed)) {
    echo json_encode(["status" => "error", "message" => "Only JPG, JPEG, PNG & GIF files are allowed"]);
    exit;
}

// Generate unique filename
$filename = uniqid() . '_' . preg_replace('/[^a-zA-Z0-9\.]/', '_', $file['name']);
$targetFile = $uploadDir . $filename;

// Move uploaded file
if (move_uploaded_file($file['tmp_name'], $targetFile)) {
    // Save to database
    try {
        $stmt = $pdo->prepare("INSERT INTO memes (user_id, caption, image_path) VALUES (?, ?, ?)");
        $stmt->execute([$user_id, $caption, $targetFile]);
        
        echo json_encode([
            "status" => "success", 
            "message" => "Meme uploaded successfully", 
            "file_path" => $targetFile
        ]);
    } catch (PDOException $e) {
        unlink($targetFile); // Remove the uploaded file if DB insert fails
        echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Failed to move uploaded file"]);
}
?>