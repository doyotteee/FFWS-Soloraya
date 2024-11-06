<?php
include 'database.php';

$host = 'localhost';
$port = 8080;

$socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
socket_bind($socket, $host, $port);
socket_listen($socket);

$clients = [];

while (true) {
    $newClient = socket_accept($socket);
    $clients[] = $newClient;

    $sql = "SELECT * FROM water_levels ORDER BY id DESC LIMIT 1";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $data = $result->fetch_assoc();
        foreach ($clients as $client) {
            socket_write($client, json_encode($data));
        }
    }

    usleep(1000000);
}

socket_close($socket);
$conn->close();
?>