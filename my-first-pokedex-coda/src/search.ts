import './style.css'

//Récupération des paramètres de l'url
const paramsUrl = new URLSearchParams(window.location.search)
let search = paramsUrl.get('search')

document.title = `PokSearch: ${search}`

document.querySelector<HTMLDivElement>('#recherche')!.innerHTML = `Vous avez recherché : ${search}`