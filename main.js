// Datos en memoria
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let events = JSON.parse(localStorage.getItem('events')) || [
    {
        id: 1,
        title: "Concierto de Rock",
        description: "El mejor concierto de rock del año con bandas internacionales.",
        category: "Concierto",
        date: "2023-12-15T20:00:00",
        location: "Estadio Nacional",
        address: "Av. Principal 123, Ciudad",
        imageUrl: "https://via.placeholder.com/800x400?text=Concierto+de+Rock",
        isFeatured: true,
        sections: [
            {
                name: "General",
                price: 50,
                rows: 10,
                seatsPerRow: 20,
                available: 200
            }
        ]
    }
];

// Guardar datos en localStorage
function saveData() {
    localStorage.setItem('events', JSON.stringify(events));
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

// Cargar eventos destacados
function loadFeaturedEvents() {
    const container = document.getElementById('featured-events-container');
    if (!container) return;
    
    const featured = events.filter(event => event.isFeatured);
    container.innerHTML = '';
    
    featured.forEach(event => {
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        container.innerHTML += `
            <div class="col-md-6 mb-4">
                <div class="card event-card">
                    <img src="${event.imageUrl}" class="card-img-top" alt="${event.title}">
                    <div class="card-body">
                        <h5 class="card-title">${event.title}</h5>
                        <p class="card-text">${formattedDate}</p>
                        <p class="card-text">${event.location}</p>
                        <p class="card-text">Desde $${event.sections[0].price.toFixed(2)}</p>
                        <a href="event-detail.html?id=${event.id}" class="btn btn-primary mt-auto">Ver más</a>
                    </div>
                </div>
            </div>
        `;
    });
}

// Inicialización simplificada
document.addEventListener('DOMContentLoaded', () => {
    // Crear usuario automático si no existe
    if (!currentUser && window.location.pathname.includes('home.html')) {
        currentUser = {
            id: Date.now(),
            firstName: 'Usuario',
            lastName: 'Demo',
            email: 'demo@eventtick.com'
        };
        saveData();
    }
    
    // Cargar contenido según la página
    if (window.location.pathname.includes('home.html')) {
        loadFeaturedEvents();
        if (currentUser) {
            document.getElementById('user-greeting').textContent = currentUser.firstName;
        }
    }
});