<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

// Obtener el ID del evento desde la URL
$id_evento = $_GET['id'] ?? null;

if (!$id_evento) {
    echo json_encode([
        "Codigo" => "98", 
        "Mensaje" => "Falta ID del evento"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Crear cliente SOAP
    $client = new SoapClient("http://localhost/servidorPrueba/ServicioWebEventTick.php?wsdl");

    // Llamar al método del servicio web
    $result = $client->GetDetalleEvento($id_evento); // Ya regresa un JSON como string

    // Decodificar la respuesta JSON
    $decodedResult = json_decode($result, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode([
            "Codigo" => "99", 
            "Mensaje" => "Error al procesar respuesta del servicio"
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Validar campo 'imagen' para evitar URLs inválidas
    if (isset($decodedResult['imagen'])) {
        $url = trim($decodedResult['imagen']);
        if ($url === "" || strpos($url, 'via.placeholder.com') !== false) {
            $decodedResult['imagen'] = 'img/teatro.jpg'; // Ruta local por defecto
        }
    } else {
        $decodedResult['imagen'] = 'img/teatro.jpg'; // Si no existe el campo
    }

    // Respuesta final al frontend
    echo json_encode($decodedResult, JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    echo json_encode([
        "Codigo" => "99", 
        "Mensaje" => "Error: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}

