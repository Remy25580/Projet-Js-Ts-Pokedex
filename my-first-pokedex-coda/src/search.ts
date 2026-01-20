import './style.css'

interface NameId {
    id: number
    name: string;
    sprites: {
        front_default: string;
    };
}

interface Type {
    name: string;
    pokemon: [{
        pokemon: {
            name: string;
            url: string;
        };
    }];
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
        break;
    case 'type':
        for (let i = 1; i < 20; i++){
            let typeFetch = await fetch(`https://pokeapi.co/api/v2/type/${i}`)
            let type = await typeFetch.json() as Type
            if(type.name.startsWith(search)){
                app.insertAdjacentHTML('beforeend', `
                    <div class="searched-by-type">  
                        <h4>Type ${type.name} : </h4>
                        <div class="type-searched" id="type-searched-${type.name}"> </div>
                    </div>`)
                console.log(`insertion du type ${type.name}`)
                console.log(type.pokemon.length)
                if(type.pokemon.length > 0){
                    for(let t of type.pokemon){
                        document.querySelector<HTMLDivElement>(`#type-searched-${type.name}`)!.insertAdjacentHTML('beforeend', `
                            <div>
                                <a href='pokemon.html?id=${t.pokemon.url.slice(34)}'>${t.pokemon.name}</a>
                            </div>`)
                        console.log(`insertion du pokémon ${t.pokemon.name}`)
                    }

                }else{
                    console.log(`pas d'insertion`)
                    document.querySelector<HTMLDivElement>(`#type-searched-${type.name}`)!.innerHTML = `
                    <p>No pokemon naturally exist with this type</p>`
                }
            }
        }
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