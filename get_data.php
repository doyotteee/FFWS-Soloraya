<?php
include 'database.php';

$sql = "SELECT * FROM water_levels ORDER BY id DESC LIMIT 1";
$result = $conn->query($sql);

$data = null;

if ($result->num_rows > 0) {
    $data = $result->fetch_assoc();
}

header('Content-Type: application/json');
echo json_encode($data);

$conn->close();
?>