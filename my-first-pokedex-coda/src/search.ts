import './style.css'
import { searchByName } from './api';
import { searchById } from './api';
import { searchByType } from './api';
import { searchByAbility } from './api';
import { searchByGeneration } from './api';

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
        await searchByName(search, app)
        break;
    case 'id':
        await searchById(search, app)
        break;
    case 'type':
        await searchByType(search, app)
        break;
    case 'ability':
        await searchByAbility(search, app)
        break;
    case 'generation':
        await searchByGeneration(search, app)
        break;
    default:
        break;
}

app.insertAdjacentHTML('beforeend', `<h4>Fin de la recherche!</h4>`)