

async function obtenerDatosJoyas() {
    try {
        const response = await fetch('./js/joyas.json');
        const datos = await response.json();
        return datos;
    } catch (error) {
        console.error('Error al obtener los datos de las joyas:', error);
        return [];
    }
}

async function cargarProductos() {
    const datosJoyas = await obtenerDatosJoyas();

    datosJoyas.forEach(joya => {
        const div = document.createElement("div");
        div.classList.add("contenedorHome");
        div.innerHTML = `        
            <img class="producto-imagen" src="${joya.imagen}" alt="${joya.joya}">
            <div class="detalle">
            <div class="bolsaProductoTitulo">
            <h3>${joya.joya}</h3>
            <p class="productoPrecio">${joya.precio} S./</p>
            <button class="agregar" id="${joya.id}">Agregar</button>
            </div>
            </div>`;

        contenedorHome.appendChild(div);
    });
}

// Llamamos a la función para cargar los productos cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", cargarProductos);

// const btncategoria = document.querySelectorAll(".btnCategoria")

// btncategoria.forEach(boton => {

//     boton.addEventListener("click", (event) => {
//         event.currentTarget.classList.add("active");
//     })

// })

const btncategoria = document.querySelectorAll(".btnCategoria");

btncategoria.forEach(btn => {
    btn.addEventListener("click", (event) => {
        console.log("Botón clickeado");
        // Remover la clase "active" de todos los botones antes de agregarla al botón clickeado
        btncategoria.forEach(btn => btn.classList.remove("active"));
        
        // Agregar la clase "active" al botón clickeado
        event.currentTarget.classList.add("active");
    });
});
