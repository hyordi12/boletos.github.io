async function fetchEvents(categoria = 'all') {
    const url = `http://localhost/boletos/controllers/clienteEventos.php?categoria=${encodeURIComponent(categoria)}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();

        if (data.Codigo !== '01') {
            console.error('Error del servicio:', data.Mensaje);
            return [];
        }

        return data.Eventos || [];
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        return [];
    }
}

function renderEvents(events) {
    const container = document.getElementById('events-container');
    container.innerHTML = '';

    if (events.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <h4>No hay eventos en esta categoría</h4>
                <button class="btn btn-primary mt-3" onclick="filterEvents('all')">Ver todos los eventos</button>
            </div>`;
        return;
    }

    events.forEach(event => {
        const eventDate = new Date(event.fecha + 'T' + event.hora);
        const formattedDate = eventDate.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let imageUrl = '';
        switch(event.categoria.toLowerCase()) {
            case 'música':
            case 'musica':
                imageUrl = 'https://www.verneripohjola.com/wp-content/uploads/2023/03/1_rock.jpg';
                break;
            case 'teatro':
                imageUrl = 'https://via.placeholder.com/800x400?text=Teatro';
                break;
            default:
                imageUrl = 'https://via.placeholder.com/800x400?text=Evento';
        }

        container.innerHTML += `
            <div class="col-md-6 mb-4">
                <div class="card h-100 position-relative">
                    <img src="${imageUrl}" class="card-img-top" alt="${event.tipo_evento}">
                    <span class="category-badge">${event.categoria}</span>
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${event.tipo_evento}</h5>
                        <p class="card-text">${formattedDate}</p>
                        <p class="card-text">${event.lugar}</p>
                        <p class="card-text">${event.descripcion}</p>
                        <a href="event-detail.html?id=${event.id_evento}" class="btn btn-primary mt-auto">Ver Detalles</a>
                    </div>
                </div>
            </div>`;
    });
}

async function filterEvents(categoria) {
    const events = await fetchEvents(categoria);
    renderEvents(events);

    const dropdownToggle = document.querySelector('#categoriesDropdown');
    dropdownToggle.textContent = categoria === 'all' ? 'Categorías' : `Categoría: ${categoria}`;
}

// Evento para botón cerrar sesión
document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});

// Carga todos los eventos al inicio
window.onload = () => filterEvents('all');












