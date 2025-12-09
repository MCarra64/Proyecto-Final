class Grafo {
    constructor() { this.vertices = {}; }

    añadirVertice(v) { if (!this.vertices[v]) this.vertices[v] = {}; }

    union(v1, v2, peso = 1) {
        this.añadirVertice(v1);
        this.añadirVertice(v2);
        this.vertices[v1][v2] = peso;
        this.vertices[v2][v1] = peso;
    }

    obtenerAdyacentes(v) { return Object.keys(this.vertices[v] || {}); }

    imprimirGrafo() { 
        for (let v in this.vertices) console.log(v, this.vertices[v]); 
    }
}

// Calcula distancia en km entre dos puntos lat/lng
function distanciaHaversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2-lat1)*Math.PI/180;
    const dLon = (lon2-lon1)*Math.PI/180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
    return 2*R*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

async function cargarRecomendaciones(lugarId) {
    const cont = document.getElementById("recomendaciones");
    cont.innerHTML = "";

    const res = await fetch("../api/lugares/get_lugares.php");
    const lugares = await res.json();

    const grafo = new Grafo();

    // Crear todas las conexiones automáticamente
    for (let i=0;i<lugares.length;i++){
        for (let j=i+1;j<lugares.length;j++){
            const l1=lugares[i], l2=lugares[j];
            const peso = distanciaHaversine(l1.lat,l1.lng,l2.lat,l2.lng);
            grafo.union(l1.id,l2.id,peso);
        }
    }

    // Tomar lugares más cercanos al lugar actual
    const adyacentes = grafo.obtenerAdyacentes(lugarId)
        .map(id => ({id, peso: grafo.vertices[lugarId][id]}))
        .sort((a,b)=>a.peso-b.peso)
        .slice(0,3);

    adyacentes.forEach(a=>{
        const l = lugares.find(x=>x.id==a.id);
        const card = document.createElement("div");
        card.classList.add("card-recomendacion");
        card.innerHTML = `<h4>${l.nombre}</h4><p>${l.descripcion}</p><p><small>${a.peso.toFixed(3)} km</small></p>`;
        cont.appendChild(card);
    });

    grafo.imprimirGrafo();
}

function obtenerLugarId(){
    const p = new URLSearchParams(window.location.search);
    return parseInt(p.get("lugar_id"));
}

document.addEventListener("DOMContentLoaded",()=>{
    const id = obtenerLugarId();
    if(id) cargarRecomendaciones(id);
});
