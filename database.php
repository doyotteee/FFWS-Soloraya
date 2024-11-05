<?php
$servername = "localhost";
$username = "ffws7025_doyotteee";
$password = "doyot123456789";
$dbname = "ffws7025_ffws_soloraya";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>