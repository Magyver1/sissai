
//PROYECTO JOYERÍA SISSAI

// Función asincrónica para obtener los datos de las joyas desde el archivo JSON
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

// Función para cargar los productos de una categoría específica en la página
async function cargarProductos(categoriaSeleccionada = '') {
    const datosJoyas = await obtenerDatosJoyas();

    // Filtrar los productos según la categoría seleccionada
    const productosFiltrados = categoriaSeleccionada
        ? datosJoyas.filter(joya => joya.categoria.id === categoriaSeleccionada)
        : datosJoyas;

    // Actualizar el contenido del títuloHome con el nombre de la categoría seleccionada
    if (categoriaSeleccionada === '' || categoriaSeleccionada === 'catalogo') {
        tituloHome.textContent = "Joyería Sissai | Catálogo";
    } else {
        const categoria = datosJoyas.find(joya => joya.categoria.id === categoriaSeleccionada)?.categoria.nombre;
        tituloHome.textContent = "Joyería Sissai | " + (categoria || "Categoría no encontrada");
    }

    // Limpiar el contenedor antes de cargar los nuevos productos
    contenedorHome.innerHTML = "";

    // Agregar los productos filtrados al contenedor
    productosFiltrados.forEach(joya => {
        const div = document.createElement("div");
        div.classList.add("contenedorHome");
        div.innerHTML = `        
            <img class="producto-imagen" src="${joya.imagen}" alt="${joya.joya}">
            <div class="detalle">
                <div class="bolsaProductoTitulo">
                    <h3>${joya.joya}</h3>
                    <p class="productoPrecio">${joya.precio} S./</p>
                    <button class="agregar" id="${joya.id}" data-nombre="${joya.joya}" data-precio="${joya.precio}">Agregar</button>
                </div>
            </div>`;

        contenedorHome.appendChild(div);
    });

    // Agregar eventos click a los botones "Agregar"
    btnAgregar = document.querySelectorAll(".agregar");
    btnAgregar.forEach(btn => {
        btn.addEventListener("click", agregarProductoABolsa);
    });
}

// Llamamos a la función para cargar todos los productos al inicio
document.addEventListener("DOMContentLoaded", () => {
    cargarProductos(); // Dejar vacío para cargar todos los productos
});

// Variable global para almacenar la categoría actual
let categoriaActual = '';

// Obtener todos los botones de categoría y agregarles el evento click
const btnCategoria = document.querySelectorAll(".btncat");

btnCategoria.forEach(btn => {
    btn.addEventListener("click", (event) => {
        // Obtener la categoría seleccionada del botón clickeado
        const categoriaSeleccionada = event.currentTarget.id;

        // Si se selecciona "Catálogo" y la categoría actual no está vacía, cargar los productos de la última categoría seleccionada
        if (categoriaSeleccionada === 'catalogo' && categoriaActual !== '') {
            cargarProductos(categoriaActual);
        } else {
            // Actualizar la categoría actual
            categoriaActual = categoriaSeleccionada;

            // Remover la clase "active" de todos los botones antes de agregarla al botón clickeado
            btnCategoria.forEach(btnItem => btnItem.classList.remove("active"));

            // Agregar la clase "active" al botón clickeado
            event.currentTarget.classList.add("active");

            // Cargar los productos de la categoría seleccionada
            cargarProductos(categoriaSeleccionada);
        }
    });
});

// Obtener el botón de "Catálogo"
const btnCatalogo = document.getElementById("catalogo");

// Agregar el evento click al botón de "Catálogo"
btnCatalogo.addEventListener("click", () => {
    // Remover la clase "active" del botón seleccionado
    btnCategoria.forEach(btnItem => btnItem.classList.remove("active"));

    // Agregar la clase "active" al botón de "Catálogo" nuevamente
    btnCatalogo.classList.add("active");

    // Cargar todos los productos
    cargarProductos();
});

// Obtener el elemento del títuloHome
const tituloHome = document.getElementById("tituloHome");
// Obtener el contenedor donde se cargarán los productos
const contenedorHome = document.getElementById("contenedorHome");

// Función para agregar un producto a la bolsa
function agregarProductoABolsa(event) {
    const id = event.target.id;
    const nombre = event.target.dataset.nombre;
    const precio = event.target.dataset.precio;

    // Obtener la bolsa actual del almacenamiento local o inicializarla si está vacía
    const bolsa = JSON.parse(localStorage.getItem('bolsa')) || [];

    // Obtener el contenedor del producto que contiene la imagen
    const contenedorProducto = event.target.closest(".contenedorHome");

    // Obtener la URL de la imagen del producto desde el contenedor
    const imagen = contenedorProducto.querySelector(".producto-imagen").src;

    // Verificar si el producto ya está en la bolsa por su id
    const productoExistente = bolsa.find(producto => producto.id === id);

    if (productoExistente) {
        // Si el producto ya existe en la bolsa, incrementar su cantidad en 1
        productoExistente.cantidad += 1;
    } else {
        // Si el producto no existe en la bolsa, agregarlo con cantidad 1
        bolsa.push({ id, nombre, precio, cantidad: 1, imagen }); // Agregamos la propiedad "imagen" al objeto
    }

    // Guardar la bolsa actualizada en el almacenamiento local
    localStorage.setItem('bolsa', JSON.stringify(bolsa));

    // Mostrar SweetAlert de producto agregado a la bolsa
    Swal.fire({
        icon: 'success',
        title: '¡Producto Agregado!',
        text: `Se ha agregado ${nombre} a tu bolsa.`,
        confirmButtonText: 'Aceptar'
    });

    // Actualizar el número de productos en el botón de la bolsa
    actualizarNumeroBolsa();
}

// Función para actualizar el número de productos en el botón de la bolsa
function actualizarNumeroBolsa() {
    // Obtener la bolsa actual del almacenamiento local
    const bolsa = JSON.parse(localStorage.getItem('bolsa')) || [];

    // Obtener el elemento del número de la bolsa
    const numeroBolsa = document.querySelector('.numero');

    // Calcular el total de productos en la bolsa
    const totalProductos = bolsa.reduce((total, producto) => total + producto.cantidad, 0);

    // Actualizar el número de la bolsa en el botón
    numeroBolsa.textContent = totalProductos;
}

// Llamamos a la función para actualizar el número de la bolsa al cargar la página
actualizarNumeroBolsa();
