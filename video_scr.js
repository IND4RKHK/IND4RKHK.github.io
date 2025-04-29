// Las constantes declaradas dentro de funciones son inmutables, para mutabilidad se usa let
// const reasing = document.getElementById("resultados_html") ver si cambiar a nav bar flotante y dejar elementos como videoplayer en pantalla principal

const reasing = document.getElementById("video_player")
const error_404 = document.getElementById("error_404")
const specialChar = ["<", ">", "\"", "'", "/", "\\", "(", ")", ";", "--", "#", "&", "=", "%", "{", "}", "[", "]", ":", "|", "^", "~", "$", "*", "+", "@", "?", ".."]
let jsonData = ""

fetch("video_index.json")
    .then(response => response.text())
    .then(data => {
        jsonData = JSON.parse(data)
    })

let test_parm = new URLSearchParams(window.location.search)
let id_ = test_parm.get("id")

const error_res = `<div class="menu-content">
<a href="./main.html">
<h1>[ ERR0R ]</h1>
<p>:: Recurso no encontrado :c =>> [404]</p>
</a>
</div>
`


if (id_){

    // Obtenemos el parametro enviado desde la url, lo limpiamos y cortamos
    id_ = clean_char(id_).slice(0, 7)

    reasing.innerHTML = `
        <div class="menu-content">
        <p>El uso de esta plataforma es responsabilidad del usuario. Se recomienda adherirse a prácticas éticas y cumplir con las leyes aplicables.</p>

        <nav class="nav-section">
            <div class="search-bar">
            <button class="search-button" onclick="video_id('${id_}')">V3R V1D30</button>
            </div>
        </nav>
        </div>`
}

function error_vew(){
    error_404.innerHTML = error_res
}

function video_id(id_obj){

    // Iteramos sobre el json una vez ya descargado localmente en cache y buscamos coincidencias
    for (let block_ of jsonData){

        // Si el id es diferente se salta la iteracion
        if (block_["id_"] != id_obj){
            continue
        }

        // Si coinciden se ejecuta ver video
        let index_ = jsonData.indexOf(block_)
        ver_video(index_)
        return
    }

    error_vew()
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&');
}

function clean_char(str_){

    // Por cada caracter dentro de caracteres especiales reemplazamos en la cadena original por nada !! RegExp es para reeemplazar todas las coincidencias
    for (let char_clean of specialChar){
        expression_ = new RegExp(escapeRegExp(char_clean), "g")
        str_ = str_.replace(expression_, "")
    }

    // Retornamos la cadena limpia
    return str_
}

function search_video(){

    let palabras_claves = document.getElementById("search").value.slice(0, 80)

    if (palabras_claves == "" || palabras_claves.length <= 2){
        document.getElementById("search").value = ""
        error_vew()
        return
    }

    palabras_claves = clean_char(palabras_claves)

    // Creamos una constante para almacenar las palabras claves de busqueda en un array
    let palabras_claves_ = palabras_claves.split(" ")

    // Se la enviamos a la funcion para que ejecute la busqueda
    get_video(palabras_claves_)

}

function ver_video(index_video){

    // document.getElementById("watch").style.display = "none"
    let json_video = jsonData[index_video]

    reasing.innerHTML = `
        <section class="video-section">
            <video controls>
            <source src="${json_video['video_file_catbox']}" type="video/mp4">
            Tu navegador no soporta el elemento de video.
            </video>

            <h2 class="video-title">${json_video['title']}</h2>
            <p class="video-author">Autor: <span>${json_video['author']}</span></p>
            <p class="video-description">
            ${json_video["description"]}
            </p>
        </section>`
}

function get_video(test){
    
    // Inicializamos la variable results como con resultados
    let results = `
    <section class="video-list">
    <h2>📂 Videos Disponibles</h2>
    <div class="video-grid">`

    // Por cada seccion de la lista en el json se obtiene el bloque
    for (const elem_ of jsonData){
        
        // Una vez esto obtenimos el titulo del video del bloque y reemplazamos los espacios y lo dejamos en lower
        let elem_use = elem_["title"].toLowerCase().replace(/ /g, "")
        
        // Por cada palabra de la busqueda ingresada se intenta encontrar un resultado
        for (let try_match of test){

            // Mientras el elemento de la lista sea menor a 0 no se salta iteracion
            if (try_match.length <= 2){
                continue
            }

            // Si el elemento no incluye coincidencia se salta iteracion
            if (!elem_use.includes(try_match.toLowerCase())){
                continue
            }

            // Si pasa los filtros se almacena el indice del la variable index_in_json
            let index_in_json = jsonData.indexOf(elem_)

            // Se almacena un posible resultado en la variable result
            results += `
            <div class="video-item">
            <h3>${elem_["title"]}</h3>
            <p>Autor: <span>${elem_["author"]}</span></p>
            <button class="watch-button" onclick="ver_video(${index_in_json})">W4TCH</button>
            </div>`
        }
    }

    // Si la variable results no incluye el elemento button significa que no tiene resultados se retorna
    if (!results.includes("button")){
        error_vew()
        return
    }

    // Finalmente mostramos los elementos dentro del div resultados_html
    reasing.innerHTML = results + "</div></section>"
}

function generarCodigo(){

    // Establecemos las variables para su uso mas comodo limitando caracteres correspondientes a su uso
    let title_ = clean_char(document.getElementById("title").value).slice(0, 80)
    let description_ = clean_char(document.getElementById("description").value).slice(0, 5000).replace(/[\r\n]+/g, " ")
    let author_ = clean_char(document.getElementById("author").value).slice(0, 15)
    let url_video_ = document.getElementById("video_url").value

    // Verificar que los campos tengan la longitud adecuada antes de iniciar el resto de check
    // ()...

    // Si el enlace no tiene el formato correcto, se retorna la funcion
    if (!url_video_.includes("https://files.catbox.moe/") || !url_video_.includes(".mp4") || url_video_.length > 40){
        alert("[ERROR] El enlace del video no cumple con el formato establecido:\nhttps://files.catbox.moe/example.mp4")
        return
    }

    let resultado_video_upload = `video_file_catbox:${url_video_}
title:${title_}
author:${author_} 
description:${description_}`

    document.getElementById("resultado").value = resultado_video_upload
}

function como_indexar(){
    let dynamic_res = `
    <section class="video-section">
    <h2 class="video-title">[INFO] Formato de Video =>> [IN]</h2>

    <div class="formulario-indexar">
        <input type="text" placeholder="TÍTULO DEL VIDEO" id="title" minlength="3" maxlength="80" required/>
        <input type="text" placeholder="DESCRIPCIÓN DEL VIDEO" id="description" minlength="10" maxlength="5000"required/>
        <input type="text" placeholder="AUTOR DEL VIDEO" id="author" minlength="3" maxlength="15" required/>
        <a href="https://catbox.moe/" target="blank_"><p>[ UPLOAD VIDEO HERE ]</p></a>
        <input type="text" placeholder="URL DEL VIDEO" id="video_url" minlength="10" maxlength="40" required/>
        <button onclick="generarCodigo()">INDE3X</button>
        
        <textarea id="resultado" placeholder="Aquí se generará el código..." readonly></textarea>
    </div>
        <a href="https://t.me/h4cktub3" target="blank_"><h6>[ TELEGRAM HERE ] == [ TUT0R14L ]</h6></a>
        <video width="350" controls>
        <source src="https://files.catbox.moe/o1turs.mp4" type="video/mp4">
        Tu navegador no soporta el elemento de video.
        </video>
    </section>
    `

    reasing.innerHTML = dynamic_res
}