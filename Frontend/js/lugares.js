// ========================
// VARIABLES DEL DOM
// ========================
const searchInput = document.getElementById("search");
const categoriaSelect = document.getElementById("categoria");
const lista = document.getElementById("lista-lugares");

// ========================
// CARGAR LUGARES DESDE EL BACKEND
// ========================
async function cargarLugares() {
    const texto = searchInput.value.trim();
    const cat = categoriaSelect.value.trim();

    let url = "http://localhost:3001/api/lugares/get_lugares.php?";

    if (texto) url += `search=${encodeURIComponent(texto)}&`;
    if (cat) url += `categoria=${encodeURIComponent(cat)}&`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        mostrarLugares(data);
    } catch (error) {
        console.error("Error:", error);
        lista.innerHTML = "<p>Error al cargar los lugares.</p>";
    }
}

// ========================
// MOSTRAR TARJETAS
// ========================
function mostrarLugares(data) {
    lista.innerHTML = "";

    if (!data || data.length === 0) {
        lista.innerHTML = "<p>No se encontraron resultados.</p>";
        return;
    }

    data.forEach(lugar => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.addEventListener("click", () => {
            window.location.href = `detalle.html?id=${lugar.id}`;
        });


        card.innerHTML = `
            <img src="img/${lugar.imagen_url || "https://via.placeholder.com/300"}" alt="${lugar.nombre}">
            <h3>${lugar.nombre}</h3>
            <p class="categoria">Categoría: ${lugar.categoria}</p>
        `;

        lista.appendChild(card);
    });
}

// ========================
// CARGAR TODO AL ABRIR
// ========================
window.onload = () => {
    cargarLugares();
};
