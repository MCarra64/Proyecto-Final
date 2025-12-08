<?php
include "../db.php";

$data = json_decode(file_get_contents("php://input"), true);

$nombre = $data["nombre"];
$descripcion = $data["descripcion"];
$categoria = $data["categoria"];
$lat = floatval($data["lat"]);
$lng = floatval($data["lng"]);
$imagen_url = isset($data["Imagen_url"]) ? $data["Imagen_url"] : null;

$sql = "INSERT INTO lugares (nombre, descripcion, categoria, lat, lng, imagen_url)
        VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssdds", $nombre, $descripcion, $categoria, $lat, $lng, $imagen_url);

if ($stmt->execute()) {
    echo json_encode([
        "message" => "Lugar creado",
        "id" => $stmt->insert_id
    ]);
} else {
    echo json_encode([
        "error" => "Error al crear lugar: " . $conn->error
    ]);
}
?>
