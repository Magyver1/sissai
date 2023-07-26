
// Variable global para almacenar la bolsa
let bolsa = [];

// Función para obtener la bolsa almacenada en el almacenamiento local
function obtenerBolsaDelLocalStorage() {
    const bolsaGuardada = localStorage.getItem('bolsa');
    return bolsaGuardada ? JSON.parse(bolsaGuardada) : [];
}

// Función para guardar la bolsa en el almacenamiento local
function guardarBolsaEnLocalStorage() {
    localStorage.setItem('bolsa', JSON.stringify(bolsa));
}

// Función para cargar los productos en la bolsa en la página bolsa.html
function cargarProductosEnBolsa() {
    const contenedorBolsa = document.querySelector('.productosBolsa');
    const totalElement = document.getElementById('total');
    const bolsaVaciaElement = document.querySelector('.bolsaVacia');
    const bolsaAccionElement = document.querySelector('.bolsaAccion');
    const bolsaCompradaElement = document.querySelector('.bolsaComprada');

    // Limpiar el contenido actual del contenedor de productos en la bolsa
    contenedorBolsa.innerHTML = '';

    // Verificar si la bolsa está vacía
    if (bolsa.length === 0) {
        bolsaVaciaElement.classList.remove('disabled');
        bolsaAccionElement.classList.add('disabled');
        bolsaCompradaElement.classList.add('disabled');
        totalElement.textContent = '0 S/.';
        return;
    }

    bolsaVaciaElement.classList.add('disabled');
    bolsaAccionElement.classList.remove('disabled');
    bolsaCompradaElement.classList.add('disabled');

    let total = 0;

    // Recorrer la bolsa y agregar los productos al contenedor de la bolsa
    bolsa.forEach(producto => {
        total += producto.precio * producto.cantidad;

        const productoDiv = document.createElement('div');
        productoDiv.classList.add('productoBolsa');

        productoDiv.innerHTML = `
            <img class="imgBolsa" src="${producto.imagen}" alt="${producto.nombre}">
            <div class="bolsaProductoTitulo">
                <h3>${producto.nombre}</h3>
            </div>
            <div class="bolsaCantidad">
                <small>Cantidad</small>
                <p>${producto.cantidad}</p>
            </div>
            <div class="precioBolsa">
                <small>Precio</small>
                <p>${producto.precio}</p>
            </div>
            <div class="subtotalBolsa">
                <small>Subtotal</small>
                <p>${producto.precio * producto.cantidad}</p>
            </div>
            <button class="borrar" data-id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
        `;

        contenedorBolsa.appendChild(productoDiv);
    });

    totalElement.textContent = `${total} S/.`;

    // Agregar evento click a los botones "borrar"
    const btnBorrar = document.querySelectorAll('.borrar');
    btnBorrar.forEach(btn => {
        btn.addEventListener('click', borrarProductoDeBolsa);
    });
}

// Función para agregar un producto a la bolsa
function agregarProductoABolsa(event) {
    const id = event.target.id;
    const nombre = event.target.dataset.nombre;
    const precio = event.target.dataset.precio;
    const imagen = event.target.parentNode.parentNode.querySelector(".producto-imagen").src;

    // Verificar si el producto ya está en la bolsa
    const productoExistente = bolsa.find(producto => producto.id === id);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        bolsa.push({ id, nombre, precio, cantidad: 1, imagen });
    }

    // Guardar la bolsa actualizada en el almacenamiento local
    guardarBolsaEnLocalStorage();

    // Mostrar SweetAlert y actualizar el número de productos en el botón de la bolsa ...
}

// Función para borrar un producto de la bolsa
function borrarProductoDeBolsa(event) {
    const id = event.target.dataset.id;

    // Filtrar la bolsa para eliminar el producto con el ID dado
    bolsa = bolsa.filter(producto => producto.id !== id);

    // Guardar la bolsa actualizada en el almacenamiento local
    guardarBolsaEnLocalStorage();

    cargarProductosEnBolsa();
}

// Función para vaciar la bolsa
function vaciarBolsa() {
    bolsa = [];

    // Guardar la bolsa vacía en el almacenamiento local
    guardarBolsaEnLocalStorage();

    cargarProductosEnBolsa();
}

// Obtener la bolsa del almacenamiento local al cargar la página bolsa.html
document.addEventListener('DOMContentLoaded', () => {
    bolsa = obtenerBolsaDelLocalStorage();
    cargarProductosEnBolsa();
});
