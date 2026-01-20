import './style.css'

interface NameId {
    id: number
    name: string;
    sprites: {
        front_default: string;
    };
}

//Récupération des paramètres de l'url
const paramsUrl = new URLSearchParams(window.location.search)
let search = paramsUrl.get('search')!
let type = paramsUrl.get('type')!

document.title = `PokSearch: ${search}`

const app = document.querySelector<HTMLDivElement>('#recherche')!

app.innerHTML = `You searched the ${type} ${search}`

//Traitement des différents types de recherche
switch(type){
    case 'name':
        for(let i = 1; i < 1026; i++){
            let nameFetch = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
            let name = await nameFetch.json() as NameId
            if(name.name.startsWith(search)){
                app.insertAdjacentHTML('beforeend', `
                    <div class="searched-by-name">
                        <img src=${name.sprites.front_default} alt=${name.name}>
                        <a href='pokemon.html?id=${i}'>${name.name}</a>
                    </div>`)
            }
        }
        break;
    case 'id':
        for (let i = 1; i < 1026; i++){
            let idFetch = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
            let id = await idFetch.json() as NameId
            if(id.id.toString().startsWith(search)){
                app.insertAdjacentHTML('beforeend', `
                    <div class="searched-by-id">
                        <p>${id.id} : </p>
                        <img src=${id.sprites.front_default} alt=${id.name}>
                        <a href='pokemon.html?id=${i}'>${id.name}</a>
                    </div>`)
            }
        }
        //https://pokeapi.co/api/v2/pokemon/{id or name}/
        break;
    case 'type':
        //https://pokeapi.co/api/v2/type/{id or name}/
        break;
    case 'ability':
        //https://pokeapi.co/api/v2/ability/{id or name}/
        break;
    case 'generation':
        //https://pokeapi.co/api/v2/generation/{id or name}/
        break;
    default:
        break;
}

app.insertAdjacentHTML('beforeend', `<h4>Fin de la recherche!</h4>`)