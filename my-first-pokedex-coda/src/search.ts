import './style.css'

interface NameId {
    id: number
    name: string;
    sprites: {
        front_default: string;
    };
}

interface TypeAbility {
    name: string;
    pokemon: [{
        pokemon: {
            name: string;
            url: string;
        };
    }];
}

interface Generation {
    pokemon_species: [{
        name: string;
        url: string;
    }];
}

function setGenName(id: number): string {
    const generations = [
        "first",
        "second",
        "third",
        "fourth",
        "fifth",
        "sixth",
        "seventh",
        "eigth",
        "ninth"
    ]
    return generations[id-1];
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
            let type = await typeFetch.json() as TypeAbility
            if(type.name.startsWith(search)){
                app.insertAdjacentHTML('beforeend', `
                    <div class="searched-by-type">  
                        <h4>Type ${type.name} : </h4>
                        <div class="type-searched" id="type-searched-${type.name}"> </div>
                    </div>`)
                if(type.pokemon.length > 0){
                    for(let t of type.pokemon){
                        if(t.pokemon.url.slice(34).length < 6){
                            document.querySelector<HTMLDivElement>(`#type-searched-${type.name}`)!.insertAdjacentHTML('beforeend', `
                                <div>
                                    <a href='pokemon.html?id=${t.pokemon.url.slice(34, t.pokemon.url.length-1)}'>${t.pokemon.name}</a>
                                </div>
                                `)
                        }else{
                            document.querySelector<HTMLDivElement>(`#type-searched-${type.name}`)!.insertAdjacentHTML('beforeend', `
                                <div>
                                    <p>${t.pokemon.name}</p>
                                </div>`)
                        }
                    }
                }else{
                    document.querySelector<HTMLDivElement>(`#type-searched-${type.name}`)!.innerHTML = `
                    <p>No pokemon naturally exist with this type</p>`
                }
            }
        }
        break;
    case 'ability':
        for(let i = 1; i < 308; i++){
            console.log(i)
            let abFetch = await fetch(`https://pokeapi.co/api/v2/ability/${i}`)
            let ab = await abFetch.json() as TypeAbility
            if(ab.name.startsWith(search)){
                app.insertAdjacentHTML('beforeend', `
                    <div class="searched-by-ability">  
                        <h4>Ability ${ab.name} used by : </h4>
                        <div class="ability-searched" id="ability-searched-${ab.name}"> </div>
                    </div>`)
                if(ab.pokemon.length > 0){
                    for(let a of ab.pokemon){
                        if(a.pokemon.url.slice(34).length < 6){
                            document.querySelector<HTMLDivElement>(`#ability-searched-${ab.name}`)!.insertAdjacentHTML('beforeend', `
                                <div>
                                    <a href='pokemon.html?id=${a.pokemon.url.slice(34, a.pokemon.url.length-1)}'>${a.pokemon.name}</a>
                                </div>`)
                        }else{
                            document.querySelector<HTMLDivElement>(`#ability-searched-${ab.name}`)!.insertAdjacentHTML('beforeend', `
                                <div>
                                    <p>${a.pokemon.name}</p>
                                </div>`)
                        }
                    }
                }      
            }
        }
        break;
    case 'generation':
        if(+search < 1 || +search > 9){
            app.insertAdjacentHTML('beforeend', `
                <p>This generation hasn't been found</p>`)
            break;
        }
        const genFetch = await fetch(`https://pokeapi.co/api/v2/generation/${+search}`)
        const gen = await genFetch.json() as Generation
        app.insertAdjacentHTML('beforeend', `
            <h4>Pokemons of the ${setGenName(+search)} generation :</h4>
            <div class="searched-by-gen"> </div>`)
        for(let p of gen.pokemon_species){
            document.querySelector<HTMLDivElement>('.searched-by-gen')!.insertAdjacentHTML('beforeend', `
                <div>
                    <a href='pokemon.html?id=${p.url.slice(42, p.url.length-1)}'>${p.name}</a>
                </div>`)
        }
        break;
    default:
        break;
}

app.insertAdjacentHTML('beforeend', `<h4>Fin de la recherche!</h4>`)