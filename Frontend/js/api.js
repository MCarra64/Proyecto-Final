// ===== CONFIGURACIÓN GLOBAL =====

const API_BASE = "http://localhost:3001/api";

// ================================
//     PETICIONES PARA LUGARES
// ================================

export async function obtenerLugares(filtros = {}) {
    let url = `${API_BASE}/lugares/get_lugares.php`;
    const params = [];

    if (filtros.search) params.push(`search=${encodeURIComponent(filtros.search)}`);
    if (filtros.categoria) params.push(`categoria=${encodeURIComponent(filtros.categoria)}`);

    if (params.length > 0) url += "?" + params.join("&");

    const res = await fetch(url);
    return await res.json();
}

export async function obtenerLugar(id) {
    const res = await fetch(`${API_BASE}/lugares/get_lugar.php?id=${id}`);
    return await res.json();
}

export async function crearLugar(data) {
    const res = await fetch(`${API_BASE}/lugares/create_lugar.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return await res.json();
}

export async function actualizarLugar(data) {
    const res = await fetch(`${API_BASE}/lugares/update_lugar.php`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return await res.json();
}

export async function eliminarLugar(id) {
    const res = await fetch(`${API_BASE}/lugares/delete_lugar.php?id=${id}`, {
        method: "DELETE"
    });
    return await res.json();
}
