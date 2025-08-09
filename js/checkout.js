async function comprarBoletos() {
    try {
        // Obtener usuario real desde localStorage si está logueado
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('Debes iniciar sesión primero.');
            window.location.href = 'index.html';
            return;
        }
        const id_usuario = currentUser.id_usuario || 1; // fallback

        const id_evento = obtenerIdEventoDesdeURL();
        if (!id_evento) {
            alert('No se encontró el ID del evento en la URL.');
            return;
        }

        const asientos = obtenerAsientosSeleccionados();
        if (!Array.isArray(asientos) || asientos.length === 0) {
            alert('Selecciona al menos un asiento.');
            return;
        }

   
        const comprarBtn = document.getElementById('complete-purchase');
        const originalText = comprarBtn.textContent;
        comprarBtn.disabled = true;
        comprarBtn.textContent = 'Procesando...';

        const payload = {
            id_usuario: parseInt(id_usuario, 10),
            id_evento: parseInt(id_evento, 10),
            asientos: asientos.map(a => parseInt(a, 10))
        };

        const res = await fetch("controllers/clienteCheckout.php?action=reserveSeats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            throw new Error(`Error de red: ${res.status}`);
        }

        const data = await res.json();

        // Restaurar botón
        comprarBtn.disabled = false;
        comprarBtn.textContent = originalText;

        if (data.Codigo !== "01") {
            // Error de reserva
            alert(data.Mensaje || 'No se pudo completar la reserva.');
            return;
        }

        // Todo bien: construir ticket y guardarlo
        const orderId = data.id_compra ? `TICK-${data.id_compra}` : ('TICK-' + Math.floor(100000 + Math.random() * 900000));
        const ticket = {
            eventId: id_evento,
            userId: id_usuario,
            asientos: asientos,
            compra_id: data.id_compra,
            total: data.total,
            orderId: orderId,
            fecha_reserva: new Date().toISOString()
        };
        localStorage.setItem('currentTicket', JSON.stringify(ticket));

        // Redirigir a ticket con query para mostrarlo
        window.location.href = `ticket.html?orderId=${encodeURIComponent(orderId)}`;
    } catch (err) {
        console.error(err);
        alert('Ocurrió un error al procesar la compra: ' + (err.message || 'desconocido'));
        const comprarBtn = document.getElementById('complete-purchase');
        if (comprarBtn) {
            comprarBtn.disabled = false;
            comprarBtn.textContent = 'Pagar y Generar Boleto';
        }
    }
}

function obtenerIdEventoDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

function obtenerAsientosSeleccionados() {
    const seleccionados = [];
    const checkboxes = document.querySelectorAll("input[type='checkbox']:checked");
    checkboxes.forEach(c => {
        seleccionados.push(c.value);
    });
    return seleccionados;
}



