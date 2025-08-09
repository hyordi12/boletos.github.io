<?php
header("Content-Type: application/json; charset=utf-8");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ======= Datos a probar =======
$user = "maria.gonzalez@example.com";  // Cambia por un correo real que esté en tu BD
$pass = "securepass";            // Cambia por la contraseña real en tu BD

try {
    // Conexión al servicio SOAP
    $client = new SoapClient("http://localhost/servidorPrueba/ServicioWebEventTick.php?wsdl");

    // Llamada al método Login
    $respuesta = $client->__soapCall("Login", [$user, $pass]);

    // Mostrar la respuesta original
    echo json_encode([
        "RespuestaOriginal" => $respuesta
    ], JSON_UNESCAPED_UNICODE);

    // Procesar si es del tipo "Succes|Mensaje|ID|Nombre|Apellido|Edad"
    $partes = explode("|", $respuesta);

    if ($partes[0] === "Succes") {
        echo json_encode([
            "Codigo" => "01",
            "Mensaje" => $partes[1] ?? "",
            "ID"      => intval($partes[2] ?? 0),
            "Nombre"  => $partes[3] ?? "",
            "Apellido"=> $partes[4] ?? "",
            "Edad"    => intval($partes[5] ?? 0)
        ], JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode([
            "Codigo" => "00",
            "Mensaje" => $partes[1] ?? "Credenciales incorrectas"
        ], JSON_UNESCAPED_UNICODE);
    }

} catch (Exception $e) {
    echo json_encode([
        "Codigo" => "99",
        "Mensaje" => "Error en el cliente: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
