<?php
$conn = new mysqli("localhost", "root", "Playstation@1", "zedmemes");
if ($conn->connect_error) {
    die("❌ DB connection failed: " . $conn->connect_error);
} else {
    echo "✅ DB Connected!";
}
?>
