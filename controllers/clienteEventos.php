<?php
// clienteEventos.php

// Permitir peticiones desde cualquier origen (ajusta para producción)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

// Responder correctamente a preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$categoria = $_GET['categoria'] ?? 'all';

try {
    // Ruta correcta a tu servicio SOAP WSDL
    $wsdl = "http://localhost/servidorPrueba/ServicioWebEventTick.php?wsdl";

    $client = new SoapClient($wsdl);

    if ($categoria === 'listar-categorias') {
        // Obtener todos los eventos para extraer categorías únicas
        $response = $client->GetTodosEventos();

        $eventos = is_string($response) ? json_decode($response, true) : $response;

        if (!isset($eventos['Eventos']) || !is_array($eventos['Eventos'])) {
            echo json_encode([
                "Codigo" => "00",
                "Mensaje" => "No se pudieron obtener eventos para extraer categorías"
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // Extraer y limpiar categorías únicas
        $categorias = array_unique(array_map(function($ev) {
            return $ev['categoria'];
        }, $eventos['Eventos']));

        echo json_encode([
            "Codigo" => "01",
            "Categorias" => array_values($categorias)
        ], JSON_UNESCAPED_UNICODE);
        exit;
    } else {
        // Obtener todos los eventos
        $response = $client->GetTodosEventos();

        $decoded = is_string($response) ? json_decode($response, true) : $response;

        if (!isset($decoded['Eventos']) || !is_array($decoded['Eventos'])) {
            echo json_encode([
                'Codigo' => '00',
                'Mensaje' => 'No se pudieron obtener eventos'
            ], JSON_UNESCAPED_UNICODE);
            exit;
        }

        // Si la categoría no es 'all' ni 'listar-categorias', filtrar eventos
        if ($categoria !== 'all') {
            $filteredEventos = array_filter($decoded['Eventos'], function($evento) use ($categoria) {
                return mb_strtolower($evento['categoria']) === mb_strtolower($categoria);
            });
            $decoded['Eventos'] = array_values($filteredEventos); // Reindexar array
        }

        echo json_encode($decoded, JSON_UNESCAPED_UNICODE);
        exit;
    }
} catch (Exception $e) {
    echo json_encode([
        "Codigo" => "99",
        "Mensaje" => "Error: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}











