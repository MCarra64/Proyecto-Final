const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const contenedor = document.getElementById("detalle-lugar");
const contenedorResenas = document.getElementById("lista-reseñas");

let estrellasSeleccionadas = 0;
const estrellasElems = document.querySelectorAll("#estrellas-input span");

estrellasElems.forEach(span => {
    span.addEventListener("mouseover", () => {
        const valor = parseInt(span.dataset.valor);
        estrellasElems.forEach(s => s.classList.toggle("hover", parseInt(s.dataset.valor) <= valor));
    });

    span.addEventListener("mouseout", () => {
        estrellasElems.forEach(s => s.classList.remove("hover"));
    });

    span.addEventListener("click", () => {
        estrellasSeleccionadas = parseInt(span.dataset.valor);
        estrellasElems.forEach(s => s.classList.toggle("selected", parseInt(s.dataset.valor) <= estrellasSeleccionadas));
    });
});

document.getElementById("btn-agregar-resena").addEventListener("click", async () => {

    const estrellas = estrellasSeleccionadas;
    const nota = document.getElementById("input-nota").value.trim();

    if (nota === "") {
        alert("Por favor escribe un comentario.");
        return;
    }

    try {
        const res = await fetch("http://localhost:3001/api/resenas/create_resena.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                lugar_id: id,
                estrellas: estrellas,
                nota: nota
            })
        });

        const data = await res.json();

        if (data.id) {
            document.getElementById("input-nota").value = "";
            cargarResenas();
        } else {
            alert("Error al crear reseña: " + (data.error || "Error desconocido"));
        }

    } catch (error) {
        console.error(error);
        alert("Error al conectar con el servidor");
    }
});

// Informacion principal
async function cargarDetalle() {
    if (!id) {
        contenedor.innerHTML = "<p>No se proporcionó ID.</p>";
        return;
    }

    try {
        const res = await fetch(`http://localhost:3001/api/lugares/get_lugar.php?id=${id}`);
        const data = await res.json();

        if (data.error) {
            contenedor.innerHTML = `<p>${data.error}</p>`;
            return;
        }

        mostrarDetalle(data);
        cargarResenas();
        cargarRecomendaciones(parseInt(id));

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = "<p>Error cargando los detalles.</p>";
    }
}

function mostrarDetalle(lugar) {
    let imagenSrc = lugar.imagen_url;

    if (!imagenSrc) {
        imagenSrc = "https://via.placeholder.com/400";
    } else if (!imagenSrc.startsWith("http")) {
        imagenSrc = "img/" + imagenSrc;
    }

    contenedor.innerHTML = `
        <img src="${imagenSrc}" alt="${lugar.nombre}">
        <h2>${lugar.nombre}</h2>
        <p><strong>Categoría:</strong> ${lugar.categoria}</p>
        <p>${lugar.descripcion}</p>

        <p class="info-extra">
            📍 Latitud: ${lugar.lat} <br>
            📍 Longitud: ${lugar.lng}
        </p>

        <h3>Recomendaciones cercanas</h3>
        <div id="recomendaciones"></div>
    `;
}

// Reseñas
async function cargarResenas() {
    try {
        const res = await fetch(`http://localhost:3001/api/resenas/get_resenas.php?lugar_id=${id}`);
        const data = await res.json();

        if (data.error) {
            contenedorResenas.innerHTML = `<p>${data.error}</p>`;
            return;
        }

        mostrarResenas(data);

    } catch (error) {
        console.error(error);
        contenedorResenas.innerHTML = "<p>Error cargando reseñas.</p>";
    }
}

function generarEstrellas(cantidad) {
    return "⭐".repeat(cantidad) + "☆".repeat(5 - cantidad);
}

function mostrarResenas(lista) {
    if (lista.length === 0) {
        contenedorResenas.innerHTML = "<p>No hay reseñas aún.</p>";
        return;
    }

    contenedorResenas.innerHTML = lista.map(r => `
        <div class="resena-card" data-id="${r.id}">
            <p class="estrellas">${generarEstrellas(r.estrellas)}</p>
            <p>${r.nota}</p>
            <small>📅 ${r.fecha}</small>

            <button class="btn-eliminar-resena">Eliminar</button>
        </div>
        <hr>
    `).join("");
}

document.addEventListener("click", async function(e) {
    if (e.target.classList.contains("btn-eliminar-resena")) {
        const card = e.target.closest(".resena-card");
        const resenaId = card.dataset.id;

        if (!confirm("¿Seguro que deseas eliminar esta reseña?")) return;

        try {
            const res = await fetch(`http://localhost:3001/api/resenas/delete_resena.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: resenaId })
            });

            const data = await res.json();

            if (data.success) {
                cargarResenas();
            } else {
                alert("No se pudo eliminar.");
            }

        } catch (error) {
            console.error(error);
        }
    }
});

// Recomendaciones (Grafo)
async function cargarRecomendaciones(lugarId) {
    const cont = document.getElementById("recomendaciones");
    cont.innerHTML = "Cargando...";

    const res = await fetch("http://localhost:3001/api/lugares/get_lugares.php");
    const lugares = await res.json();

    const grafo = new Grafo();

    for (let i = 0; i < lugares.length; i++) {
        for (let j = i + 1; j < lugares.length; j++) {
            const l1 = lugares[i], l2 = lugares[j];
            const peso = distanciaHaversine(l1.lat, l1.lng, l2.lat, l2.lng);
            grafo.union(l1.id, l2.id, peso);
        }
    }

    const adyacentes = grafo.obtenerAdyacentes(lugarId)
        .map(dest => ({ id: dest, peso: grafo.vertices[lugarId][dest] }))
        .sort((a, b) => a.peso - b.peso)
        .slice(0, 3);

    cont.innerHTML = "";

    adyacentes.forEach(a => {
        const lug = lugares.find(x => x.id == a.id);
        const div = document.createElement("div");
        div.classList.add("card-recomendacion");

        div.innerHTML = `
            <h4>${lug.nombre}</h4>
            <p>${lug.descripcion}</p>
            <small>${a.peso.toFixed(2)} km</small>
        `;

        cont.appendChild(div);
    });
}

cargarDetalle();
