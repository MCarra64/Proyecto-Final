<?php
include "../db.php";

$categoria = isset($_GET["categoria"]) ? $_GET["categoria"] : null;
$search = isset($_GET["search"]) ? $_GET["search"] : null;

$sql = "SELECT id, nombre, descripcion, categoria, lat, lng, imagen_url
        FROM lugares
        WHERE 1=1";

if ($categoria) {
    $sql .= " AND categoria = ?";
}

if ($search) {
    $sql .= " AND (nombre LIKE ? OR descripcion LIKE ? OR categoria LIKE ?)";
}

$stmt = $conn->prepare($sql);

$types = "";
$params = [];

if ($categoria) {
    $types .= "s";
    $params[] = $categoria;
}

if ($search) {
    $searchParam = "%" . $search . "%";
    $types .= "sss";
    $params[] = $searchParam;
    $params[] = $searchParam;
    $params[] = $searchParam;
}

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$lugares = [];
while ($row = $result->fetch_assoc()) {
    $lugares[] = $row;
}

echo json_encode($lugares);
?>
