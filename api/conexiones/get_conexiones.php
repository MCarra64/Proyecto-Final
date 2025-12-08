<?php
include "../db.php";

$lugar_id = $_GET["lugar_id"] ?? null;

$sql = "SELECT * FROM conexiones";
$params = [];
$types = "";

if ($lugar_id) {
    $sql .= " WHERE lugar1_id = ? OR lugar2_id = ?";
    $types = "ii";
    $params = [$lugar_id, $lugar_id];
}

$stmt = $conn->prepare($sql);

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$conexiones = [];
while ($row = $result->fetch_assoc()) {
    $conexiones[] = $row;
}

echo json_encode($conexiones);
?>
