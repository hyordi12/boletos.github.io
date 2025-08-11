<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=utf-8");

// Responder preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Función de utilidad para errores
function salidaError($codigo, $mensaje, $extra = []) {
    $resp = array_merge([
        "Codigo" => $codigo,
        "Mensaje" => $mensaje
    ], $extra);
    echo json_encode($resp, JSON_UNESCAPED_UNICODE);
    exit;
}

// URL del WSDL
$wsdlUrl = "https://e31c8a1ef2e2.ngrok-free.app/servidorPrueba/ServicioWebEventTick.php?wsdl";

// Instancia SOAP
try {
    $soapClient = new SoapClient($wsdlUrl, [
        'trace' => 1,
        'exceptions' => true,
        'cache_wsdl' => WSDL_CACHE_NONE,
    ]);
} catch (Exception $e) {
    salidaError("00", "No se pudo instanciar el cliente SOAP: " . $e->getMessage());
}

// === GET: obtener detalles de evento (zonas, filas, asientos) ===
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getEventDetails') {
    $eventId = intval($_GET['eventId'] ?? 0);
    if ($eventId <= 0) {
        salidaError("98", "ID de evento inválido o faltante");
    }

    try {
        $resultJson = $soapClient->obtenerEventoConZonasFilasAsientos(['id_evento' => $eventId]);
        $decoded = json_decode($resultJson, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            salidaError("99", "Respuesta inválida del servicio", ["Raw" => $resultJson]);
        }

        echo json_encode($decoded, JSON_UNESCAPED_UNICODE);
        exit;
    } catch (Exception $e) {
        salidaError("00", "Error al obtener detalles del evento: " . $e->getMessage());
    }
}

// === POST: reservar asientos ===
$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    salidaError("98", "JSON inválido o cuerpo vacío");
}

// Validar campos requeridos
foreach (['id_usuario', 'id_evento', 'asientos'] as $campo) {
    if (!isset($input[$campo])) {
        salidaError("98", "Falta el campo obligatorio: $campo");
    }
}

$id_usuario = intval($input['id_usuario']);
$id_evento = intval($input['id_evento']);
$asientos_raw = $input['asientos'];

if (!is_array($asientos_raw) || count($asientos_raw) === 0) {
    salidaError("98", "El arreglo de asientos debe ser un array no vacío");
}

$asientos = array_map('intval', $asientos_raw);

try {
    $resultJson = $soapClient->ReservarAsientosPorUsuario([
        'id_usuario' => $id_usuario,
        'id_evento' => $id_evento,
        'ids_asientos' => $asientos
    ]);

    $decoded = json_decode($resultJson, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        salidaError("99", "Respuesta inválida del servicio de reserva", ["Raw" => $resultJson]);
    }

    echo json_encode($decoded, JSON_UNESCAPED_UNICODE);
    exit;
} catch (Exception $e) {
    salidaError("00", "Error en la llamada al servicio de reserva: " . $e->getMessage());
}



