// Registrar nuevo usuario (ahora opcional)
function registerUser(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName')?.value.trim() || 'Usuario';
    const lastName = document.getElementById('lastName')?.value.trim() || 'Anónimo';
    const email = document.getElementById('email')?.value.trim() || 'usuario@example.com';
    
    // Crear usuario automáticamente
    const newUser = {
        id: Date.now(),
        firstName,
        lastName,
        email
    };
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    window.location.href = 'home.html';
}

// Iniciar sesión (acepta cualquier credencial)
function loginUser(event) {
    event.preventDefault();
    
    // Crear usuario automáticamente
    currentUser = {
        id: Date.now(),
        firstName: 'Usuario',
        lastName: 'Demo',
        email: 'demo@eventtick.com'
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    window.location.href = 'home.html';
}

// Configurar formularios
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', registerUser);
    }
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', loginUser);
    }
    
    // Opción para entrar sin registro
    const skipLogin = document.createElement('div');
    skipLogin.className = 'text-center mt-3';
    skipLogin.innerHTML = '<a href="home.html" class="btn btn-outline-secondary">Entrar sin registrar</a>';
    
    const loginBox = document.querySelector('.login-box');
    if (loginBox) {
        loginBox.appendChild(skipLogin);
    }
});