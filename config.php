<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

// ✅ Database Config for XAMPP Default (no password)
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', 'Playstation@1'); // Leave empty for XAMPP default
define('DB_NAME', 'zedmemes');

try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

    if ($conn->connect_error) {
        die("❌ Database connection failed: " . $conn->connect_error);
    }
    echo "✅ Database connected successfully!"; // Uncomment for testing
} catch (Exception $e) {
    die("❌ Exception: " . $e->getMessage());
}
?>
