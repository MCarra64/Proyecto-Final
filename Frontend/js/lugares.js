const searchInput = document.getElementById("search");
const categoriaSelect = document.getElementById("categoria");
const lista = document.getElementById("lista-lugares");

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

window.onload = () => {
    cargarLugares();
};