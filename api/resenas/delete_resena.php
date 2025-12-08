<?php
include "../db.php";

$data = json_decode(file_get_contents("php://input"), true);
$id = $data["id"] ?? null;

if (!$id) {
    echo json_encode(["error" => "ID no proporcionado"]);
    exit;
}

$sql = "DELETE FROM resenas WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Reseña eliminada"]);
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["error" => "Error al eliminar reseña: " . $conn->error]);
}
?>
