import type { PokeLink } from "./interface";
import type { Pokemon } from "./interface";
import type { Specie } from "./interface";
import type { Evolution } from "./interface";
import type { NameId } from "./interface";
import type { TypeAbility } from "./interface";
import type { Generation } from "./interface";
import { setGenName } from "./tool";

export async function getPokemonIndic(id: number) {
  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
  const result = await pokemon.json() as PokeLink;
  return result;
}

export async function getPokemon(id: number) {
  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
  const result = await pokemon.json() as Pokemon;
  return result;
}

export async function getEvoChain(id: number) {
  const specieFetch = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
  const specie = await specieFetch.json() as Specie
  
  const evoChainFetch = await fetch(specie.evolution_chain.url)
  const evoChain = await evoChainFetch.json() as Evolution

  const chain = [evoChain.chain.species.name]
  if(evoChain.chain.evolves_to.length > 0){
    chain.push(evoChain.chain.evolves_to[0].species.name)
    if(evoChain.chain.evolves_to[0].evolves_to.length > 0){
      chain.push(evoChain.chain.evolves_to[0].evolves_to[0].species.name)
    }
  }
  return chain
}

export async function searchByName(search: string, app: HTMLDivElement): Promise<void>{
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
}

export async function searchById(search: string, app: HTMLDivElement): Promise<void>{
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
}

export async function searchByType(search: string, app: HTMLDivElement): Promise<void>{
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
}

export async function searchByAbility(search: string, app: HTMLDivElement): Promise<void>{
    for(let i = 1; i < 308; i++){
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
}

export async function searchByGeneration(search: string, app: HTMLDivElement): Promise<void>{
    if(+search < 1 || +search > 9){
        app.insertAdjacentHTML('beforeend', `
            <p>This generation hasn't been found</p>`)
        return
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
}