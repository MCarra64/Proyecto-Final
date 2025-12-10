// ========================
// INICIALIZAR MAPA
// ========================
const map = L.map('map').setView([15.772, -86.797], 13);

// Capa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// ========================
// MARCADORES
// ========================
let markers = [];
let lugaresGlobal = []; // Guardará todos los lugares cargados

function limpiarMarcadores() {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
}

function agregarMarcadores(data) {
    limpiarMarcadores();

    if (!data || data.length === 0) return;

    const bounds = [];

    data.forEach(lugar => {
        if (!lugar.lat || !lugar.lng) return;

        const marker = L.marker([parseFloat(lugar.lat), parseFloat(lugar.lng)])
            .addTo(map)
            .bindPopup(`
                <b>${lugar.nombre}</b><br>
                ${lugar.categoria}<br>
                <a href="detalle.html?id=${lugar.id}">Ver detalles</a>
            `);

        markers.push(marker);
        bounds.push([parseFloat(lugar.lat), parseFloat(lugar.lng)]);
    });

    if (bounds.length > 0) map.fitBounds(bounds, { padding: [50, 50] });
}

// ========================
// FILTRO POR BÚSQUEDA Y CATEGORÍA
// ========================
function filtrarLugares() {
    const texto = document.getElementById("search").value.toLowerCase();
    const categoria = document.getElementById("categoria").value.toLowerCase();

    const filtrados = lugaresGlobal.filter(lugar => {
        const nombreCoincide = lugar.nombre.toLowerCase().includes(texto);
        const categoriaCoincide = categoria === "" || lugar.categoria.toLowerCase() === categoria;

        return nombreCoincide && categoriaCoincide;
    });

    agregarMarcadores(filtrados);
}

// ========================
// CARGAR LUGARES
// ========================
async function cargarLugaresMapa() {
    try {
        const res = await fetch("http://localhost:3001/api/lugares/get_lugares.php");
        const data = await res.json();

        lugaresGlobal = data;   // Guardamos los lugares originales
        agregarMarcadores(data); // Mostrar todos al inicio

    } catch (error) {
        console.error("Error cargando marcadores:", error);
    }
}

// ========================
// EVENTOS
// ========================
window.addEventListener("load", cargarLugaresMapa);
document.getElementById("search").addEventListener("input", filtrarLugares);
document.getElementById("categoria").addEventListener("change", filtrarLugares);

// ========================
// AGREGAR LUGAR CON CLIC EN EL MAPA
// ========================
let marcadorTemporal = null;

map.on("click", function(e) {
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);

    console.log("📌 Clic en el mapa:", lat, lng);

    // Eliminar marcador previo si existía
    if (marcadorTemporal) {
        map.removeLayer(marcadorTemporal);
    }

    // Crear marcador temporal donde el usuario hizo clic
    marcadorTemporal = L.marker([lat, lng]).addTo(map)
        .bindPopup("Nuevo lugar aquí").openPopup();

    // Abrir el modal de agregar lugar
    document.getElementById("modalLugar").style.display = "block";

    // Llenar automáticamente la latitud y longitud
    const form = document.getElementById("formAgregarLugar");
    form.lat.value = lat;
    form.lng.value = lng;
});
