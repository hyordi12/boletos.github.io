<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

try {
    $client = new SoapClient("https://e31c8a1ef2e2.ngrok-free.app/servidorPrueba/ServicioWebEventTick.php?wsdl");
    $result = $client->GetMetodosPago([]);
    echo json_encode($result);
} catch (Exception $e) {
    echo json_encode(["Codigo" => "99", "Mensaje" => "Error: " . $e->getMessage()]);
}
