// --- MODAL ---
const modal = document.getElementById("modalLugar");
const btn = document.getElementById("btnAgregarLugar");
const span = document.querySelector(".cerrar");

btn.onclick = () => modal.style.display = "block";
span.onclick = () => modal.style.display = "none";
window.onclick = e => { if(e.target == modal) modal.style.display = "none"; }

// --- FORMULARIO ---
document.getElementById("formAgregarLugar").addEventListener("submit", async function(e){
    e.preventDefault();

    const formData = new FormData(this);
    
    // Los nombres DEBEN coincidir exactamente con lo que espera create_lugar.php
    const data = {
        nombre: formData.get("nombre"),
        descripcion: formData.get("descripcion"),
        categoria: formData.get("categoria"),
        lat: parseFloat(formData.get("lat")),
        lng: parseFloat(formData.get("lng")),
        imagen_url: formData.get("imagen_url") || null  // minúscula, como en el PHP
    };

    console.log("📤 Datos a enviar:", data);
    
    // Validación básica
    if(!data.nombre || !data.categoria || isNaN(data.lat) || isNaN(data.lng)){
        alert("❌ Completa todos los campos obligatorios (nombre, categoría, latitud y longitud)");
        return;
    }

    try {
        // IMPORTANTE: Usa la ruta correcta según tu estructura
        // Si create_lugar.php está en api/ folder
        const response = await fetch("../api/lugares/create_lugar.php", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(data)
        });

        console.log("📥 Status de respuesta:", response.status, response.statusText);
        
        // Primero obtenemos el texto para ver qué viene
        const responseText = await response.text();
        console.log("📄 Respuesta cruda del servidor:", responseText);
        
        // Intenta parsear como JSON
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (jsonError) {
            console.error("❌ Error parseando JSON:", jsonError);
            console.error("📄 Contenido recibido:", responseText.substring(0, 200) + "...");
            
            // Si recibimos HTML, probablemente sea una página de error
            if(responseText.includes("<!DOCTYPE") || responseText.includes("<html")) {
                alert("⚠️ El servidor devolvió una página HTML. Verifica:\n1. La ruta api/create_lugar.php es correcta\n2. No hay errores en el PHP\n3. Revisa la consola para más detalles");
            } else {
                alert("⚠️ Respuesta inesperada del servidor. Revisa la consola.");
            }
            return;
        }
        
        console.log("✅ Respuesta parseada:", result);

        if(result.error){
            alert("❌ Error del servidor: " + result.error);
            return;
        }

        // Éxito
        alert("✅ Lugar agregado correctamente! ID: " + result.id);
        modal.style.display = "none";
        this.reset();

        // Actualizar el mapa si existe
        if(typeof window.map !== "undefined" && window.map){
            const marker = L.marker([data.lat, data.lng]).addTo(window.map)
                .bindPopup(`<b>${data.nombre}</b><br>${data.descripcion || 'Sin descripción'}`);
            
            // Opcional: centrar el mapa en el nuevo lugar
            window.map.setView([data.lat, data.lng], 13);
        }

        // Si existe función para recargar lugares, llamarla
        if(typeof window.cargarLugares === "function"){
            window.cargarLugares();
        }

    } catch(err){
        console.error("💥 Error completo:", err);
        alert("🚫 Error de conexión: " + err.message + "\nVerifica la consola para más detalles.");
    }
});

// Función de depuración: prueba la conexión al hacer clic en el botón
btn.addEventListener("click", function() {
    console.log("📍 Modal abierto. Ruta del PHP esperada: api/create_lugar.php");
    console.log("📍 Ubicación actual:", window.location.href);
});