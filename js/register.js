document.getElementById('register-form').addEventListener('submit', function(e){
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const password = document.getElementById('password').value.trim();
    const fecha_nacimiento = document.getElementById('fecha_nacimiento').value;
    const genero = document.querySelector('input[name="genero"]:checked')?.value || null;

    fetch('http://localhost/boletos/api/register.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({nombre, apellido, correo, password, fecha_nacimiento, genero})
    })
    .then(res => res.json())
    .then(data => {
        if(data.success) {
            alert(data.message);
            // redirigir a login, limpiar form, etc.
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(() => alert('Error en conexión'));
});
