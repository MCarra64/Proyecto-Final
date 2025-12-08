<?php
include "../db.php";

$data = json_decode(file_get_contents("php://input"), true);

$lugar_id = $data["lugar_id"];
$estrellas = $data["estrellas"];
$nota = $data["nota"];

$sql = "INSERT INTO resenas (lugar_id, estrellas, nota) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iis", $lugar_id, $estrellas, $nota);

if ($stmt->execute()) {
    echo json_encode([
        "message" => "Reseña creada",
        "id" => $stmt->insert_id
    ]);
} else {
    echo json_encode([
        "error" => "Error al crear reseña: " . $conn->error
    ]);
}
?>
