// Variables para el proceso de compra
let selectedEvent = null;
let selectedSection = null;
let selectedSeats = [];
let totalPrice = 0;

// Cargar datos para el checkout
function loadCheckoutData() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = parseInt(urlParams.get('eventId'));
    
    selectedEvent = events.find(e => e.id === eventId);
    if (!selectedEvent) {
        window.location.href = 'events.html';
        return;
    }
    
    // Mostrar información del evento
    document.getElementById('checkout-event-title').textContent = selectedEvent.title;
    document.getElementById('checkout-event-date').textContent = new Date(selectedEvent.date).toLocaleString();
    document.getElementById('checkout-event-location').textContent = selectedEvent.location;
    
    // Cargar secciones
    const sectionSelect = document.getElementById('section-select');
    sectionSelect.innerHTML = '<option value="">Selecciona una sección</option>';
    
    selectedEvent.sections.forEach((section, index) => {
        sectionSelect.innerHTML += `<option value="${index}">${section.name} - $${section.price.toFixed(2)} (${section.available} disponibles)</option>`;
    });
    
    // Configurar evento para cambio de sección
    sectionSelect.addEventListener('change', function() {
        selectedSection = this.value !== "" ? selectedEvent.sections[parseInt(this.value)] : null;
        selectedSeats = [];
        totalPrice = 0;
        updateSeatMap();
        updateSummary();
    });
    
    // Configurar botón de compra
    document.getElementById('complete-purchase').addEventListener('click', completePurchase);
}

// Actualizar mapa de asientos
function updateSeatMap() {
    const seatMap = document.getElementById('seat-map');
    if (!seatMap || !selectedSection) return;
    
    seatMap.innerHTML = '';
    
    // Crear asientos
    for (let row = 1; row <= selectedSection.rows; row++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row mb-2';
        rowDiv.innerHTML = `<strong>Fila ${row}:</strong> `;
        
        for (let seat = 1; seat <= selectedSection.seatsPerRow; seat++) {
            const seatId = `R${row}S${seat}`;
            const isOccupied = Math.random() < 0.2; // 20% de probabilidad de estar ocupado
            
            const seatElement = document.createElement('span');
            seatElement.className = `seat ${isOccupied ? 'occupied' : 'available'}`;
            seatElement.textContent = seat;
            seatElement.dataset.id = seatId;
            seatElement.dataset.row = row;
            seatElement.dataset.seat = seat;
            
            if (!isOccupied) {
                seatElement.addEventListener('click', toggleSeatSelection);
            }
            
            rowDiv.appendChild(seatElement);
        }
        
        seatMap.appendChild(rowDiv);
    }
}

// Alternar selección de asiento
function toggleSeatSelection(e) {
    const seatId = e.target.dataset.id;
    const seatIndex = selectedSeats.findIndex(s => s.id === seatId);
    
    if (seatIndex === -1) {
        // Seleccionar asiento
        selectedSeats.push({
            id: seatId,
            row: e.target.dataset.row,
            seat: e.target.dataset.seat
        });
        e.target.classList.add('selected');
    } else {
        // Deseleccionar asiento
        selectedSeats.splice(seatIndex, 1);
        e.target.classList.remove('selected');
    }
    
    totalPrice = selectedSeats.length * selectedSection.price;
    updateSummary();
}

// Actualizar resumen
function updateSummary() {
    const summary = document.getElementById('order-summary');
    summary.innerHTML = '';
    
    if (!selectedSection || selectedSeats.length === 0) {
        summary.innerHTML = '<p>Selecciona al menos un asiento</p>';
        document.getElementById('complete-purchase').disabled = true;
        return;
    }
    
    summary.innerHTML = `
        <h4>Resumen de Compra</h4>
        <p><strong>Evento:</strong> ${selectedEvent.title}</p>
        <p><strong>Sección:</strong> ${selectedSection.name}</p>
        <p><strong>Asientos:</strong> ${selectedSeats.map(s => `Fila ${s.row}, Asiento ${s.seat}`).join(', ')}</p>
        <p><strong>Precio por boleto:</strong> $${selectedSection.price.toFixed(2)}</p>
        <p><strong>Cantidad:</strong> ${selectedSeats.length}</p>
        <hr>
        <h5>Total: $${totalPrice.toFixed(2)}</h5>
    `;
    
    document.getElementById('complete-purchase').disabled = false;
}

// Completar compra
function completePurchase() {
    if (!currentUser || !selectedEvent || !selectedSection || selectedSeats.length === 0) return;
    
    // Crear tickets
    const newTickets = selectedSeats.map(seat => {
        return {
            id: Date.now() + Math.floor(Math.random() * 1000),
            eventId: selectedEvent.id,
            userId: currentUser.id,
            section: selectedSection.name,
            row: seat.row,
            seat: seat.seat,
            price: selectedSection.price,
            purchaseDate: new Date().toISOString(),
            qrCode: `TICKET-${selectedEvent.id}-${currentUser.id}-${Date.now()}`
        };
    });
    
    tickets.push(...newTickets);
    saveData();
    
    // Redirigir a la página de tickets
    const ticketIds = newTickets.map(t => t.id).join(',');
    window.location.href = `ticket.html?tickets=${ticketIds}`;
}

// Cargar ticket
function loadTicket() {
    const urlParams = new URLSearchParams(window.location.search);
    const ticketIds = urlParams.get('tickets').split(',').map(id => parseInt(id));
    
    const ticketList = tickets.filter(t => ticketIds.includes(t.id));
    if (ticketList.length === 0) {
        window.location.href = 'profile.html';
        return;
    }
    
    const firstTicket = ticketList[0];
    const event = events.find(e => e.id === firstTicket.eventId);
    
    // Mostrar información del ticket
    document.getElementById('ticket-event-title').textContent = event.title;
    document.getElementById('ticket-event-date').textContent = new Date(event.date).toLocaleString();
    document.getElementById('ticket-event-location').textContent = event.location;
    document.getElementById('ticket-section').textContent = firstTicket.section;
    document.getElementById('ticket-row').textContent = firstTicket.row;
    document.getElementById('ticket-seat').textContent = firstTicket.seat;
    document.getElementById('ticket-price').textContent = `$${firstTicket.price.toFixed(2)}`;
    document.getElementById('ticket-order-number').textContent = `#${firstTicket.id}`;
    document.getElementById('ticket-user-name').textContent = `${currentUser.firstName} ${currentUser.lastName}`;
    document.getElementById('ticket-user-email').textContent = currentUser.email;
    
    // Generar QR
    const qrCodeImg = document.getElementById('qr-code-img');
    qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${firstTicket.qrCode}`;
    
    // Configurar botón de descarga
    document.getElementById('download-ticket').addEventListener('click', () => {
        alert('En una implementación real, esto descargaría un PDF del ticket');
    });
}

// Inicialización de checkout
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('checkout.html')) {
        loadCheckoutData();
    } else if (window.location.pathname.includes('ticket.html')) {
        loadTicket();
    }
});