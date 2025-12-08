<?php
include "../db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"] ?? null;
$nombre = $data["nombre"] ?? null;
$descripcion = $data["descripcion"] ?? null;
$categoria = $data["categoria"] ?? null;
$lat = isset($data["lat"]) ? floatval($data["lat"]) : null;
$lng = isset($data["lng"]) ? floatval($data["lng"]) : null;
$imagen_url = isset($data["Imagen_url"]) ? $data["Imagen_url"] : null;

if (!$id) {
    echo json_encode(["error" => "ID no proporcionado"]);
    exit;
}

$sql = "UPDATE lugares 
        SET nombre = ?, descripcion = ?, categoria = ?, lat = ?, lng = ?, imagen_url = ?
        WHERE id = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssddsi", $nombre, $descripcion, $categoria, $lat, $lng, $imagen_url, $id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Lugar actualizado"]);
} else {
    echo json_encode(["error" => "Error al actualizar lugar: " . $conn->error]);
}
?>
