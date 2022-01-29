let carrito = [] //Será nuestra variable global

const botonAgregarCarritoDeCompras = document.querySelectorAll('.agregarCarrito');
// console.log(botonAgregarCarritoDeCompras); **Arreglo de los botones agregar

botonAgregarCarritoDeCompras.forEach((botonAgregarCarrito) => {
    botonAgregarCarrito.addEventListener('click', agregarCarritoClickeado);
});

const comprarButton = document.querySelector('.comprarButton');
comprarButton.addEventListener('click', botonComprarClickeado);

const contenedorItemsCarritoDeCompras = document.querySelector(
    '.contenedorItemsCarritoDeCompras'
);

inicializarCarrito();

function agregarCarritoClickeado(event) { // Se agregan los productos al carrito cuando el usuario hace click

    button = event.target;
    item = button.closest('.product-container'); //closest agrega el producto mas cercano al clickeado
    itemTitulo = item.querySelector('.nombreProducto').textContent; //textContent nos agrega el texto
    itemPrecio = item.querySelector('.precioProducto').textContent;
    itemImagen = item.querySelector('.imagenProducto').src; // src para que nos muestre la imagen


    agregarItemsCarrito(itemTitulo, itemPrecio, itemImagen); //Agregamos al carrito las caracteristicas del producto

    let _prod = { "titulo": itemTitulo, "precio": itemPrecio, "imagen": itemImagen, "cantidad": 1 };
    guardarProductosLocalStorage(_prod);

}

function agregarItemsCarrito(itemTitulo, itemPrecio, itemImagen) {

    const alert = document.querySelector('.alert')

    setTimeout(function () {
        alert.classList.add('hide')
    }, 1000)
    alert.classList.remove('hide')

    // console.log(itemTitulo, itemPrecio, itemImagen);

    // Agregamos los titulos de los productos al carrito
    const tituloElemento = contenedorItemsCarritoDeCompras.getElementsByClassName('tituloItemCarrito');
    for (let i = 0; i < tituloElemento.length; i++) { // Aumentar la cantidad de productos en el carrito
        if (tituloElemento[i].innerText === itemTitulo) {
            let cantidadElemento = tituloElemento[i].parentElement.parentElement.parentElement.querySelector(
                '.cantidadItemCarrito'
            );
            cantidadElemento.value++;
            actualizarCarritoDeCompras();
            return null;
        }
    }

    visualizarProductosEnCarrito(itemTitulo, itemPrecio, itemImagen);
    actualizarCarritoDeCompras();

}

function visualizarProductosEnCarrito(itemTitulo, itemPrecio, itemImagen) {

    const filaCarritoDeCompras = document.createElement('div'); // Traemos el html del carrito
    const contenidoCarrito = `
    <div class="row itemCarrito">
        <div class="col-6">
            <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <img src=${itemImagen} class="shopping-cart-image">
                <h6 class="shopping-cart-item-title tituloItemCarrito text-truncate ml-3 mb-0">${itemTitulo}</h6>
            </div>
        </div>
        <div class="col-2">
            <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <p class="item-price mb-0 precioItemCarrito">${itemPrecio}</p>
            </div>
        </div>
        <div class="col-4">
            <div
                class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
                <input class="shopping-cart-quantity-input cantidadItemCarrito" type="number"
                    value="1">
                <button class="btn btn-danger buttonDelete" type="button">X</button>
            </div>
        </div>
    </div>`;

    filaCarritoDeCompras.innerHTML = contenidoCarrito;
    contenedorItemsCarritoDeCompras.append(filaCarritoDeCompras);

    filaCarritoDeCompras
        .querySelector('.buttonDelete')
        .addEventListener('click', removerItemsCarrito);

    filaCarritoDeCompras
        .querySelector('.cantidadItemCarrito')
        .addEventListener('change', cambiarCantidades);

}


function actualizarCarritoDeCompras() { // Totalizar carrito
    let Total = 0;
    const totalCarrito = document.querySelector('.totalCarrito');
    const itemCarrito = document.querySelectorAll('.itemCarrito');
    itemCarrito.forEach((itemCarrito) => {
        const precioItemCarritoElemento = itemCarrito.querySelector('.precioItemCarrito');
        const precioItemCarrito = Number(precioItemCarritoElemento.textContent.replace('$', ''));
        const cantidadItemCarritoElemento = itemCarrito.querySelector('.cantidadItemCarrito');
        const cantidadItemCarrito = Number(cantidadItemCarritoElemento.value);
        Total = Total + precioItemCarrito * cantidadItemCarrito;
    })

    totalCarrito.innerHTML = `${Total.toFixed(3)}$`;
    
}

function removerItemsCarrito(event) { // Remover productos del carrito presionando la X 
    const buttonClicked = event.target;
    buttonClicked.closest('.itemCarrito').remove();
    let elemento = buttonClicked.closest('.itemCarrito');
    let titulo = elemento.getElementsByClassName('shopping-cart-item-title')[0].innerText;
    eliminarProductoLocalStorage(titulo);
    elemento.remove();
    actualizarCarritoDeCompras();
}


function cambiarCantidades(event) {
    const input = event.target; // Cambiar cantidad de productos en el input
    input.value <= 0 ? (input.value = 1) : null;
    let elemento = input.closest('.itemCarrito');
    let titulo = elemento.getElementsByClassName('shopping-cart-item-title')[0].innerText;

    actualizarCantidadProductoLocalStorage(titulo, input.value);
    actualizarCarritoDeCompras();
}

function botonComprarClickeado() {
    contenedorItemsCarritoDeCompras.innerHTML = ''; // Vacía el carrito una vez que el usuario haga click en comprar
    actualizarCarritoDeCompras(); // El importe total del carrito vuelve a cero  

}


function guardarProductosLocalStorage(_agregarItemsCarrito) {

    let itemsCarrito = obtenerProductosLocalStorage();
    let posicion = existeProductoEnCarrito(_agregarItemsCarrito.titulo);

    if (posicion > 0) {
        //sumo 1 a la cantidad que ya tenia
        actualizarCantidadProductoLocalStorage(_agregarItemsCarrito.titulo, parseInt(itemsCarrito[posicion].cantidad) + 1);
        //traigo la info nueva
        itemsCarrito = obtenerProductosLocalStorage();
    } else {
        itemsCarrito.push(_agregarItemsCarrito);
    }

    localStorage.setItem('agregarItemsCarrito', JSON.stringify(itemsCarrito));
}

function existeProductoEnCarrito(tituloABuscar) {
    //retorno su posicion para luego actualizarlo
    let retorno = 0;
    let prods = obtenerProductosLocalStorage();
    for (let idx = 0; idx < prods.length; idx++) {
        let obj = prods[idx];
        if (obj.titulo === tituloABuscar) {
            retorno = idx;
        }
    }
    return retorno;
}

function obtenerProductosLocalStorage() {
    let productosLS;

    if (localStorage.getItem('agregarItemsCarrito') === null) {
        productosLS = [];
    } else {
        productosLS = JSON.parse(localStorage.getItem('agregarItemsCarrito'));
    }
    return productosLS;

}

function actualizarCantidadProductoLocalStorage(tituloProdParaActualizar, cantidadNueva) {
    let prods = obtenerProductosLocalStorage();
    for (let idx = 0; idx < prods.length; idx++) {
        let obj = prods[idx];
        if (obj.titulo === tituloProdParaActualizar) {
            prods[idx].cantidad = cantidadNueva;
        }
    }
    localStorage.setItem('agregarItemsCarrito', JSON.stringify(prods));
}

function eliminarProductoLocalStorage(tituloProdAEliminar) {
    let prods = obtenerProductosLocalStorage();
    for (let idx = 0; idx < prods.length; idx++) {
        let obj = prods[idx];
        if (obj.titulo === tituloProdAEliminar) {
            //elimino el producto puntual
            prods.splice(idx, 1);
        }
    }
    localStorage.setItem('agregarItemsCarrito', JSON.stringify(prods));
}

function inicializarCarrito() {
    let carrito = obtenerProductosLocalStorage();

    for (let idx = 0; idx < carrito.length; idx++) {
        let obj = carrito[idx];
        agregarItemsCarrito(obj.titulo, obj.precio, obj.imagen, obj.cantidad);
    }

    actualizarCarritoDeCompras();
}

