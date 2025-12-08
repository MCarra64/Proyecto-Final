<?php
include "../db.php";

$lugar_id = $_GET["lugar_id"] ?? null;

if (!$lugar_id) {
    echo json_encode(["error" => "ID no proporcionado"]);
    exit;
}

$sql = "SELECT id, lugar_id, estrellas, nota, fecha 
        FROM resenas
        WHERE lugar_id = ?
        ORDER BY fecha DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $lugar_id);
$stmt->execute();

$result = $stmt->get_result();
$resenas = [];

while ($row = $result->fetch_assoc()) {
    $resenas[] = $row;
}

echo json_encode($resenas);
