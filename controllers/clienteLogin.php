<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$user = $_POST['user'] ?? '';
$pass = $_POST['pass'] ?? '';

try {
    $client = new SoapClient("https://e31c8a1ef2e2.ngrok-free.app/servidorPrueba/ServicioWebEventTick.php?wsdl");

    // Llamada correcta al método
    $respuesta = $client->__soapCall("Login", [$user, $pass]);

    $partes = explode('|', $respuesta);

  if ($partes[0] === 'Succes') {
    echo json_encode([
        'Codigo' => '01',
        'Mensaje' => $partes[1],           // Bienvenido
        'id' => intval($partes[2] ?? 0),   // ID del usuario
        'nombre' => $partes[3] ?? '',      // Nombre
        'apellido' => $partes[4] ?? '',    // Apellido
        'edad' => intval($partes[5] ?? 0)  // Edad
    ]);


} else {
    echo json_encode([
        'Codigo' => '00',
        'Mensaje' => $partes[1] ?? 'Error desconocido'
    ]);
}
} catch (Exception $e) {
    echo json_encode([
        'Codigo' => '99',
        'Mensaje' => 'Error en el servicio: ' . $e->getMessage()
    ]);
}










