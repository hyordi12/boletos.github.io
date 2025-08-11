<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json; charset=utf-8");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

date_default_timezone_set('America/Mexico_City');

$id_compra = $_GET['id_compra'] ?? '';

if (empty($id_compra) || !is_numeric($id_compra)) {
    echo json_encode([
        "Codigo" => "97",
        "Mensaje" => "ID de compra no enviado o inválido"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    // Crear cliente SOAP 
    $client = new SoapClient("https://e31c8a1ef2e2.ngrok-free.app/servidorPrueba/ServicioWebEventTick.php?wsdl");

    // Llamar método SOAP pasando id_compra convertido a entero
    $respuesta = $client->__soapCall("ObtenerTicketCompra", [(int)$id_compra]);

    // Decodificar JSON recibido
    $data = json_decode($respuesta, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode([
            "Codigo" => "98",
            "Mensaje" => "Respuesta no es JSON válido",
            "RespuestaOriginal" => $respuesta
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }



    echo json_encode($data, JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    echo json_encode([
        "Codigo" => "99",
        "Mensaje" => "Error en el cliente: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}

