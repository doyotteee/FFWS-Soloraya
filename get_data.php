<?php
include 'database.php';

$sql = "SELECT * FROM water_levels ORDER BY timestamp DESC LIMIT 1";
$result = $conn->query($sql);

$data = null;

if ($result && $result->num_rows > 0) {
    $data = $result->fetch_assoc();
} else {
    // Tangani kasus ketika tidak ada data yang ditemukan
    $data = array("error" => "No data found");
}

header('Content-Type: application/json');
echo json_encode($data);

$conn->close();
?>