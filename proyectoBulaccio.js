//DESAFIO CLASE 9: AGREGAR EVENTO - SE AGREGA AL BOTON ENVIAR DE LA PAGINA DE CONTACTO

function enviar() {
    alert("Mensaje enviado");
}

let botonEnvio = document.getElementById("botonEnviar");

botonEnvio.addEventListener("click", enviar);






//DESAFIO CLASE 14: SUMAR UNA API:

let urlDISNEY = "https://api.disneyapi.dev/characters";

$("#botonDISNEY").click(function () {
    $.get(urlDISNEY, function (datos) {
        $.each(datos.data, function (indice, personaje) {
            $("body").prepend(`<div>
                <p>${personaje.name}</p>
                <img src="${personaje.imageUrl}"></img>
            </div>`);
        });
    });
});
