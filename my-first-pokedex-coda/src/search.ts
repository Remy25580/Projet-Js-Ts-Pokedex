import './style.css'
import { searchByAbility, searchByGeneration, searchById, searchByType } from './api'
import { setGenName } from './tool'


//Récupération des paramètres de l'url
const paramsUrl = new URLSearchParams(window.location.search)
let search = paramsUrl.get('search')!
let type = paramsUrl.get('type')!

document.title = `PokPok Search: ${search}`

const app = document.querySelector<HTMLDivElement>('#recherche')!

app.innerHTML = `<h3>You searched the ${type} ${search}</h3>`

//Traitement des différents types de recherche
switch(type){
    case 'id':
        for (let i = 1; i < 1026; i++){
            let id = await searchById(i)
            if(id.id.toString().startsWith(search)){
                app.insertAdjacentHTML('beforeend', `
                    <div class="searched-by-id">
                        <p>${id.id} : </p>
                        <img src=${id.sprites.front_default} alt=${id.name}>
                        <a href='index.html?page=${Math.ceil(i/25)}' data-id=${i} class="link-to-pokemon">${id.name}</a>
                    </div>`)
            }
        }
        break;
    case 'type':
        for (let i = 1; i < 20; i++){
            let type = await searchByType(i)
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
                                    <a href='index.html?page=${Math.ceil(+(t.pokemon.url.slice(34,t.pokemon.url.length-1))/25)}' class="link-to-pokemon" data-id=${t.pokemon.url.slice(34,t.pokemon.url.length-1)}>${t.pokemon.name}</a>
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
            let ab = await searchByAbility(i)
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
                                    <a href='index.html?page=${Math.ceil(+(a.pokemon.url.slice(34,a.pokemon.url.length-1))/25)}' class="link-to-pokemon" data-id=${a.pokemon.url.slice(34,a.pokemon.url.length-1)}>${a.pokemon.name}</a>
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
            console.log(ab.name)
        }
        break;
    case 'generation':
        if(+search < 1 || +search > 9){
            app.insertAdjacentHTML('beforeend', `
                <p>This generation hasn't been found</p>`)
            break
        }
        let gen = await searchByGeneration(+search)
        app.insertAdjacentHTML('beforeend', `
            <h4>Pokemons of the ${setGenName(+search)} generation :</h4>
            <div class="searched-by-gen"> </div>`)
        for(let p of gen.pokemon_species){
            document.querySelector<HTMLDivElement>('.searched-by-gen')!.insertAdjacentHTML('beforeend', `
                <div>
                    <a href='index.html?page=${Math.ceil(+(p.url.slice(42,p.url.length-1))/25)}' class="link-to-pokemon" data-id=${p.url.slice(42,p.url.length-1)}>${p.name}</a>
                </div>`)
        }
        break;
    default:
        break;
}

app.insertAdjacentHTML('beforeend', `<h4>End of your research!</h4>`)

document.querySelectorAll<HTMLAnchorElement>(".link-to-pokemon")!.forEach(link => {
    link.addEventListener('click', () => {
        const id = link.dataset.id!
        sessionStorage.setItem('id', id)
        console.log(`affichage du pokemon ${id}`)
    })
})