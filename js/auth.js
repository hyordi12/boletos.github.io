async function login() {
    const correo = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    try {
        const response = await fetch("controllers/clienteLogin.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ user: correo, pass: pass })
        });

        const data = await response.json();

        if (data.Codigo === "01") {
            localStorage.setItem("currentUser", JSON.stringify({
                nombre: data.Nombre,  // <- Nombre del servicio web
                correo: correo
            }));
            window.location.href = "home.html";
        } else {
            alert(data.Mensaje);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al conectar con el servidor.");
    }
}

async function registrar() {
    const nombre = document.getElementById("firstName").value.trim();
    const apellido = document.getElementById("lastName").value.trim();
    const correo = document.getElementById("email").value.trim();
    const fecha_nacimiento = document.getElementById("birthdate").value.trim();
    const pass = document.getElementById("newPassword").value.trim();
    const genero = document.querySelector('input[name="genero"]:checked')?.value || '';

    if (!nombre || !apellido || !correo || !fecha_nacimiento || !pass) {
        alert("Por favor completa todos los campos.");
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        alert("Correo electrónico inválido.");
        return;
    }

    if (pass.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return;
    }

    const datos = { nombre, apellido, correo, pass, fecha_nacimiento, genero };

    try {
        const res = await fetch("controllers/clienteRegistro.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos),
        });

        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        const data = await res.json();

        if (data.Codigo === "01") {
            alert("¡Registro exitoso! " + data.Mensaje);

            // Guarda en localStorage el objeto completo con id_usuario
            const usuario = {
                correo: correo,
                nombre: nombre,
                apellido: apellido,
                id_usuario: data.id_usuario  // clave: id_usuario desde backend
            };

            localStorage.setItem("currentUser", JSON.stringify(usuario));
            window.location.href = "home.html";
        } else {
            alert("Error: " + data.Mensaje);
        }
    } catch (error) {
        console.error("Error al registrar:", error);
        alert("Error al conectar con el servidor.");
    }
}
