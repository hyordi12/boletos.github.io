<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

try {
    // Recibe y decodifica los datos JSON
    $input = json_decode(file_get_contents("php://input"), true);

    if (!$input) {
        throw new Exception("No se recibió JSON válido");
    }

    $nombre = $input['nombre'] ?? '';
    $apellido = $input['apellido'] ?? '';
    $correo = $input['correo'] ?? '';
    $pass = $input['pass'] ?? '';
    $edad = $input['edad'] ?? '';
    $genero = $input['genero'] ?? null;

    // Validación
    if (!$nombre || !$apellido || !$correo || !$pass || !$edad) {
        throw new Exception("Faltan datos obligatorios.");
    }

    // Calcular fecha de nacimiento aproximada
    $anio_actual = date("Y");
    $anio_nacimiento = $anio_actual - intval($edad);
    $fecha_nacimiento = $anio_nacimiento . "-01-01";

    // URL del servicio SOAP
    $wsdl = "https://e31c8a1ef2e2.ngrok-free.app/servidorPrueba/ServicioWebEventTick.php?wsdl";
    $client = new SoapClient($wsdl, [
        "trace" => 1,
        "exceptions" => true
    ]);

    // Llamada al servicio SOAP
    $respuestaJson = $client->__soapCall("RegistrarUsuarioJson", [
        $nombre,
        $apellido,
        $correo,
        $pass,
        $fecha_nacimiento,
        $genero
    ]);

    // Decodificar respuesta
    $respuesta = json_decode($respuestaJson, true);

    // Si todo va bien, responde con los datos del usuario
    if ($respuesta && isset($respuesta['status']) && $respuesta['status'] === 'Succes') {
        echo json_encode([
            "Codigo" => "01",
            "Mensaje" => $respuesta['message'],
            "id" => $respuesta['id_usuario'] ?? null  
        ]);
    } else {
        echo json_encode([
            "Codigo" => "02",
            "Mensaje" => $respuesta['message'] ?? "Error desconocido en el servidor."
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        "Codigo" => "99",
        "Mensaje" => "Error: " . $e->getMessage()
    ]);
}
?>












