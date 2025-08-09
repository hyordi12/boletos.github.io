<?php
require_once 'ServicioWebEventTick.php';

$servicio = new ServicioWebEventTick();
echo $servicio->Login('juan.perez@example.com', '1234pass');
