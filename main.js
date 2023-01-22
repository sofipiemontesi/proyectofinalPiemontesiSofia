let nombre= document.getElementById("nombre");
let evento= document.getElementById("evento");
let invitados= document.getElementById("invitados");
let boton= document.getElementById("btn");
const contenedorLugares= document.querySelector("#lugares");
let costoTotal= 0;
localStorage.setItem("costoTotal", costoTotal);

const lugares= [
    {id:"Marga",
    nombre: "Divina Marga",
    ubicacion: "Maipu",
    img:"./img/divmarga.jpg",
    precio:100},

    {id:"Septima",
    nombre: "Bodega Septima",
    ubicacion: "Tunuyan",
    img:"./img/septima.jpg",
    precio:150},
    
    {id:"Salentein",
    nombre: "Bodega Salentein",
    ubicacion: "Tupungato",
    img:"./img/salentein.jpg",
    precio:200},

    {id:"Atamisque",
    nombre: "Estancia Atamisque",
    ubicacion: "Tupungato",
    img:"./img/atamisque.jpg",
    precio:250},

    {id:"Lscorreas",
    nombre: "Bodega L.S.Correas",
    ubicacion: "Medrano",
    img:"./img/lscorreas.png",
    precio:300},

    {id:"Durigutti",
    nombre: "Bodega Durigutti",
    ubicacion: "Lujan de Cuyo",
    img:"./img/durigutti.jpg",
    precio:350}
]
opcionLugares = lugares;
serviciosContratados = []


/*const servicios = [
    {"id":"catering", "nombre":"catering", "precio": 100},
    {"id":"ambientacion", "nombre":"ambientacion", "precio": 30},
    {"id":"barra", "nombre":"barra", "precio": 40},
    {"id":"personal", "nombre":"personal", "precio": 10},
    {"id":"musica", "nombre":"musica", "precio": 700}
] */

//funcion para guardar en LS
function guardar() {
    localStorage.setItem("nombre", nombre.value);
    localStorage.setItem("evento", evento.value);
    localStorage.setItem("invitados", invitados.value);
    cargarLugares()
};

//funcion para pintar lugares
function cargarLugares(){
    let cantInvitados= localStorage.getItem("invitados");
    let eventoIngresado= localStorage.getItem("evento");
    let nombreIngresado= localStorage.getItem("nombre");
    if (cantInvitados && eventoIngresado && nombreIngresado){
        if(cantInvitados<=150){
            opcionLugares= lugares.splice(0,3); 
        }else{
            opcionLugares= lugares.slice(3);
        } 
        opcionLugares.forEach(lugar => {
            contenedorLugares.innerHTML+= `
            <div class="lugar">
                <img src="${lugar.img}" alt="">
                <div class="detallesLugar">
                    <h3>${lugar.nombre}</h3>
                    <p>Ubicado en ${lugar.ubicacion}</p>
                    <p>Precio: $${lugar.precio}</p>
                    <button id="${lugar.id}" class="select">Seleccionar</button>
                </div>
            </div>`
            elegirLugar();                      
        });               
    }
}

//funcion para elegir lugar
function elegirLugar(){
    const btnSelect= document.querySelectorAll(".select"); 
    btnSelect.forEach(btn => {
        btn.addEventListener ("click", ()=> {
            lugarSeleccionado= opcionLugares.filter(item => item.id == btn.id);
            localStorage.setItem("lugarSeleccionado", JSON.stringify(lugarSeleccionado));
            lugarSeleccionado.forEach(lugar => {
                contenedorLugares.innerHTML= `
                <img src="${lugar.img}" alt="">
                <div class= "detallesLugar">
                    <h3>${lugar.nombre}</h3>
                    <p>Ubicado en ${lugar.ubicacion}</p>
                </div>
                <button id="costo">Ver Costo </button>`;
            costoTotal= costoTotal + lugar.precio;
            localStorage.setItem("costoTotal", costoTotal);
            })
            elegirServicios();
            verCosto();
            
        })
    })
    
};

//funcion para elegir servicios
function elegirServicios(){
    const formServicios= document.getElementById("formServicios");
    fetch('servicios.json')
        .then(respuesta => respuesta.json())
        .then (data => {
            servicios = data;
            servicios.forEach (servicio=>{
                formServicios.innerHTML+= `
                <div>
                    <label for="${servicio.nombre}">${servicio.nombre}, precio ${servicio.precio} usd</label>
                    <input type="checkbox" id="${servicio.id}" class="checkboxes" onchange="selecServicios(this)">
                </div>`
            })
        })
}
//funcion para agregar y quitar servicios (modificando el costoTotal)
function selecServicios (checkboxElem) {
    cantidadInvitados = localStorage.getItem ("invitados");
    if (checkboxElem.checked) {
        let servElegido = servicios.filter(item => item.id == checkboxElem.id);
        const sum = servElegido.reduce((acc, obj) => {
            return acc + obj.precio;
        }, 0);
        costoTotal= costoTotal + sum * cantidadInvitados;
        localStorage.setItem("costoTotal", costoTotal);
        serviciosContratados.push(...servElegido);
        console.log(serviciosContratados);
    }else{
        serviciosContratados = serviciosContratados.filter(item => item.id != checkboxElem.id);
        console.log(serviciosContratados);
        let servQuitado= servicios.filter (item => item.id == checkboxElem.id);
        const res = servQuitado.reduce ((acc, obj) => {
            return acc + obj.precio;
        }, 0);
        costoTotal = costoTotal - res * cantidadInvitados;
        localStorage.setItem("costoTotal", costoTotal);
    }
};

//funcion para obtener un alert con el costo
function verCosto() {
    const verCosto= document.getElementById("costo");
    verCosto.addEventListener("click", ()=>{
        alert(costoTotal);
    })
}

//evento
boton.addEventListener("click", ()=>{
    guardar();
});
cargarLugares(lugares);
