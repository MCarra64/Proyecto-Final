<?php
include "../db.php";

$data = json_decode(file_get_contents("php://input"), true);

$lugar1_id = $data["lugar1_id"];
$lugar2_id = $data["lugar2_id"];
$peso = isset($data["peso"]) ? floatval($data["peso"]) : 1;
$tipo = isset($data["tipo"]) ? $data["tipo"] : "cercano";

$sql = "INSERT INTO conexiones (lugar1_id, lugar2_id, peso, tipo)
        VALUES (?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("iids", $lugar1_id, $lugar2_id, $peso, $tipo);

if ($stmt->execute()) {
    echo json_encode([
        "message" => "Conexión creada",
        "id" => $stmt->insert_id
    ]);
} else {
    echo json_encode([
        "error" => "Error al crear conexión: " . $conn->error
    ]);
}
?>
