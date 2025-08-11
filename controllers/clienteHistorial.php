<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json; charset=utf-8");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

date_default_timezone_set('America/Mexico_City');

$user = $_GET['user'] ?? '';
$pass = $_GET['pass'] ?? '';

if (empty($user) || empty($pass)) {
    echo json_encode([
        "Codigo" => "97",
        "Mensaje" => "Usuario o contraseña no enviados"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $client = new SoapClient("https://e31c8a1ef2e2.ngrok-free.app/servidorPrueba/ServicioWebEventTick.php?wsdl");
    $respuesta = $client->__soapCall("GetHistorialCompras", [$user, $pass]);

    $data = json_decode($respuesta, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode([
            "Codigo" => "98",
            "Mensaje" => "Respuesta no es JSON válido",
            "RespuestaOriginal" => $respuesta
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Añadir fecha ISO con zona horaria para cada compra
    if (isset($data['Compras']) && is_array($data['Compras'])) {
        foreach ($data['Compras'] as &$compra) {
            $fechaHora = $compra['fecha'] . ' ' . ($compra['hora'] ?? '00:00:00');
            $dt = DateTime::createFromFormat('Y-m-d H:i:s', $fechaHora, new DateTimeZone('America/Mexico_City'));
            if ($dt) {
                $compra['fechaISO'] = $dt->format('c'); // ISO 8601 completo con offset
            } else {
                $compra['fechaISO'] = $fechaHora; // fallback
            }
        }
    }

    echo json_encode($data, JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    echo json_encode([
        "Codigo" => "99",
        "Mensaje" => "Error en el cliente: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}











