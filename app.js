//Variable que mantiene el estado visible del carrito
var carritoVisible = false;

//Espermos que todos los elementos de la pàgina cargen para ejecutar el script
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready();
}


function ready() {
    //Agregremos funcionalidad a los botones eliminar del carrito
    var botonesEliminarItem = document.getElementsByClassName('btn-eliminar');
    for (var i = 0; i < botonesEliminarItem.length; i++) {
        var button = botonesEliminarItem[i];
        button.addEventListener('click', eliminarItemCarrito);
    }

    //agrego funcionalidad al boton sumar cantidad
    var botonesSumarCantidad = document.getElementsByClassName('sumar-cantidad');
    for (var i = 0; i < botonesSumarCantidad.length; i++) {
        var button = botonesSumarCantidad[i];
        button.addEventListener('click', sumarCantidad);
    }

    //agrego funcionalidad al boton restar cantidad
    var botonesRestarCantidad = document.getElementsByClassName('restar-cantidad');
    for (var i = 0; i < botonesRestarCantidad.length; i++) {
        var button = botonesRestarCantidad[i];
        button.addEventListener('click', restarCantidad);
    }

    //agrego funcionalidad a los botoens agregar al carrito
    var botonesAgregarAlCarrito = document.getElementsByClassName('boton-item');
    for (var i = 0; i < botonesAgregarAlCarrito.length; i++) {
        var button = botonesAgregarAlCarrito[i];
        button.addEventListener('click', agregarAlCarritoClicked);
    }

    //Agregamos funcionalidad al boto pagar
    document.getElementsByClassName('btn-pagar')[0].addEventListener('click', pagarClick)
}

//Elimino el item seleccionado del carrito
function eliminarItemCarrito(event) {
    var buttonClicked = event.target;
    swal({
        title: "¿Estas seguro que deseas eliminar?",
        text: "Si eliminas el producto vas a tener que agregarlo nuevamente si lo deseas",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                buttonClicked.parentElement.parentElement.remove();
                swal("Poof! el producto se elimino", {
                    icon: "success",
                });
            } else {
                swal("Eso me imagine :)");
            }
        });

    //Actualizamos el total del carrito una vez que eliminamos todo
    actualizarTotalCarrito();

    //controlar si hay elementos en el carrito una vez se eliminaron
    // si no hay debo actualizar el carrito
    ocultarCarrito();


}

//Actualizamos el total del carrito
function actualizarTotalCarrito() {
    //seleccionamo el contenedor carrito
    var carritoContenedor = document.getElementsByClassName('carrito')[0];
    var carritoItems = carritoContenedor.getElementsByClassName('carrito-item');
    var total = 0;

    //Recorremos cada elemento del carrito para actualizar el total 
    for (var i = 0; i < carritoItems.length; i++) {
        var item = carritoItems[i];
        var precioElemento = item.getElementsByClassName('carrito-item-precio')[0];
        console.log(precioElemento);
        //quitamos el simbolo y el punto de milesimo
        var precio = parseFloat(precioElemento.innerText.replace('$', '').replace('.', ''));
        console.log(precio)
        var cantidadItem = item.getElementsByClassName('carrito-item-cantidad')[0];
        var cantidad = cantidadItem.value;
        console.log(cantidad);
        total = total + (precio * cantidad);
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('carrito-precio-total')[0].innerText = '$' + total.toLocaleString("es") + ',00';
}

function sumarCantidad(event) {
    var buttonClicked = event.target
    var selector = buttonClicked.parentElement;
    var cantidadAcutal = selector.getElementsByClassName('carrito-item-cantidad')[0].value
    console.log(cantidadAcutal)
    cantidadAcutal++;
    selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadAcutal;
    //Actualizamos el total
    actualizarTotalCarrito();

}

function restarCantidad(event) {
    var buttonClicked = event.target
    var selector = buttonClicked.parentElement;
    var cantidadAcutal = selector.getElementsByClassName('carrito-item-cantidad')[0].value
    console.log(cantidadAcutal)
    cantidadAcutal--;

    //controlamos que no sea menor que 
    if (cantidadAcutal >= 1) {
        selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadAcutal;
        //Actualizamos el total
        actualizarTotalCarrito();
    }

}

function agregarAlCarritoClicked(event) {
    var button = event.target;
    var item = button.parentElement;
    var titulo = item.getElementsByClassName('titulo-item')[0].innerText;
    var precio = item.getElementsByClassName('precio-item')[0].innerText
    var imagenSrc = item.getElementsByClassName('img-item')[0].src;

    //La siguiente funcion agregar el elemento al carrito. le mando por parametros los valores
    agregarItemAlCarrito(titulo, precio, imagenSrc);
}

function agregarItemAlCarrito(titulo, precio, imagenSrc) {
    var item = document.createElement('div');
    item.classList.add = ('item');
    var itemsCarrito = document.getElementsByClassName('carrito-items')[0];

    //Vamos a controlar que el item que esta ingresando no se encuentre ya en el carrito 
    var nombreItemsCarrito = itemsCarrito.getElementsByClassName('carrito-item-titulo');
    for (var i = 0; i < nombreItemsCarrito.length; i++) {
        if (nombreItemsCarrito[i].innerText == titulo) {
            alert("El item ya se encuentra en el carrito");
            return;
        }
    }

    var itemCarritoContenido = `
    <div class="carrito-item">
        <img src="${imagenSrc}" width="80px" alt="">
        <div class="carrito-item-detalles">
            <span class="carrito-item-titulo">${titulo}</span>
            <div class="selector-cantidad">
                <i class="fa-solid fa-minus restar-cantidad"></i>
                <input type="text" value="1" class="carrito-item-cantidad" disabled>
                <i class="fa-solid fa-plus sumar-cantidad"></i>
            </div>
            <span class="carrito-item-precio">${precio}</span>
        </div>
        <span class="btn-eliminar">
            <i class="fa-solid fa-trash"></i>
        </span>
    </div>
    `
    item.innerHTML = itemCarritoContenido;
    itemsCarrito.append(item);

    //Agregamo la funcionalidad eliminar del nuevo item 
    var botonEliminarItem = item.getElementsByClassName('btn-eliminar')[0];
    botonEliminarItem.addEventListener('click', eliminarItemCarrito);

    //Agregamos la funcionalidad de sumar del nuevo item
    var botonSumarCantidad = item.getElementsByClassName('sumar-cantidad')[0];
    botonSumarCantidad.addEventListener('click', sumarCantidad);

    //Agregamos la funcionalidad de restar del nuevo item
    var botonRestarCantidad = item.getElementsByClassName('restar-cantidad')[0];
    botonRestarCantidad.addEventListener('click', restarCantidad);
}

function pagarClick(event) {
    alert("Gracias por su compra");
    //eliminar todos los elementos del carrito
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    while (carritoItems.hasChildNodes()) {
        carritoItems.removeChild(carritoItems.firstChild);
    }
    actualizarTotalCarrito();
}



function AgregarInfoCuestionario(event) {
    var button = event.target;
    var item = button.parentElement;
    var nombre = item.getElementsByClassName('nomb')[0].innerText;
    var email = item.getElementsByClassName('email')[0].innerText
    var phone = item.getElementsByClassName('telefono')[0].innerText;
    var msj = item.getElementsByClassName('msj')[0].innerText;

    //La siguiente funcion agregar el elemento al post le mando por parametros los valores
    envairCuestionario(nombre, email, phone, msj);
}

function envairCuestionario(nombre, email, phone, msj) {
    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
            title: nombre,
            body: email,
            id: phone,
            userId: 1,
        }),

        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then((response) => response.json())
        .then((data) => console.log(data))

    var botonEnviarFormulario = item.getElementsByClassName('boton-form')[0];
    botonEnviarFormulario.addEventListener('click', envairCuestionario);

}


