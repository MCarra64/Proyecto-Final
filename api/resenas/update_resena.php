<?php
include "../db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = $data["id"];
$estrellas = $data["estrellas"];
$nota = $data["nota"];

$sql = "UPDATE resenas SET estrellas = ?, nota = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("isi", $estrellas, $nota, $id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Reseña actualizada"]);
} else {
    echo json_encode(["error" => "Error al actualizar reseña: " . $conn->error]);
}
?>
