<?php
include "../db.php";

$id = $_GET["id"] ?? null;

if (!$id) {
    echo json_encode(["error" => "ID no proporcionado"]);
    exit;
}

$sql = "SELECT id, nombre, descripcion, categoria, lat, lng, imagen_url
        FROM lugares
        WHERE id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();
$lugar = $result->fetch_assoc();

if ($lugar) {
    echo json_encode($lugar);
} else {
    echo json_encode(["error" => "Lugar no encontrado"]);
}
?>
