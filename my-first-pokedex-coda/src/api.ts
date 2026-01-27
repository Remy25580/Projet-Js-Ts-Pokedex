import type { PokeNames, PokeLink, Pokemon, Specie, Evolution, NameId, TypeAbility, Generation } from "./interface";

export async function getPokemonList(){
  let list = []
  for (let i = 1; i < 1026; i++){
    let pfetch = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`)
    let pdata = await pfetch.json() as PokeNames
    list.push(pdata.name)
  }
  return list
}

export async function getPokemonIndic(name: string) {
  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`)
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


export async function searchById(id: number): Promise<NameId>{
    let idFetch = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    let idValue = await idFetch.json() as NameId
    return idValue
}

export async function searchByType(id: number): Promise<TypeAbility>{
    let typeFetch = await fetch(`https://pokeapi.co/api/v2/type/${id}`)
    let typeValue = await typeFetch.json() as TypeAbility
    return typeValue
}

export async function searchByAbility(id: number): Promise<TypeAbility>{
    let abFetch = await fetch(`https://pokeapi.co/api/v2/ability/${id}`)
    let abValue = await abFetch.json() as TypeAbility
    return abValue
}

export async function searchByGeneration(id: number): Promise<Generation>{
    const genFetch = await fetch(`https://pokeapi.co/api/v2/generation/${id}`)
    const genValue = await genFetch.json() as Generation
    return genValue
}
