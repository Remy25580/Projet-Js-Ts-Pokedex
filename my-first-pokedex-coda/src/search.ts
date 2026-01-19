import './style.css'

//Récupération des paramètres de l'url
const paramsUrl = new URLSearchParams(window.location.search)
let search = paramsUrl.get('search')
let type = paramsUrl.get('type')

document.title = `PokSearch: ${search}`

const test = await fetch('https://pokeapi.co/api/v2/pokemon/1/')
console.log(test.text())

document.querySelector<HTMLDivElement>('#recherche')!.innerHTML = `Vous avez recherché : ${search} par ${type}`

switch(type){
    case 'name':
        break;
    case 'id':
        break;
    case 'type':
        break;
    case 'ability':
        break;
    case 'generation':
        break;
    default:
        break;
}