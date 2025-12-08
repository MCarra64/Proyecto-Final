<?php
include "../db.php";

$id = $_GET["id"] ?? null;
if (!$id) {
    echo json_encode(["error" => "ID no proporcionado"]);
    exit;
}

$sql = "SELECT * FROM resenas WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();
$resena = $result->fetch_assoc();

if ($resena) {
    echo json_encode($resena);
} else {
    echo json_encode(["error" => "Reseña no encontrada"]);
}
?>
