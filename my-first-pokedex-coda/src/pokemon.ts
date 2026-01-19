import './style.css'

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  abilities: [{
    is_hidden: boolean;
    slot: number;
    ability: {
      name: string;
    };
  }];
  moves: [{
    move: {
      name: string;
    };
  }];
  sprites: {
    front_default: string;
    other: {
      showdown: {
        front_default: string;
      };
    };
  };
  cries: {
    latest: string;
  };
  types:[{
    type: {
      name: string;
    };
  }];
  species:{
    name: string;
  };
}

interface Specie {
  evolution_chain: {
    url: string;
  };
}

interface Evolution {
  chain: {
    species: {
      name: string;
    };
    evolves_to: [{
      species: {
        name: string;
      };
      evolves_to: [{
        species: {
          name: string;
        };
      }];
    }];
  };
}




//ajouter une interface pour sa génération

async function getPokemon(id: number) {
  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
  const result = await pokemon.json() as Pokemon;
  return result;
}



const paramsUrl = new URLSearchParams(window.location.search)
const idString = paramsUrl.get("id")
if(!idString){
    throw console.error("Impossible de trouver ce pokemon");
}

const id = +idString
const currentPokemon = await getPokemon(id)
document.title = `PokPok - ${currentPokemon.name}`

async function getEvoChain(id: number) {
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
  console.log(chain)
  return chain
}


function setGenerationAndGame(id: number): string[]{
  if(id < 152){
    return ["First generation", "Pokemon Red, Blue & Yellow"]
  }else if(id < 252){
    return ["Second generation", "Pokemon Gold, Silver & Crystal"]
  }else if(id < 387){
    return ["Third generation", "Pokemon Ruby, Sapphire & Emerald"]
  }else if(id < 494){
    return ["Fourth generation", "Pokemon Diamond, Pearl & Platinium"]
  }else if(id < 650){
    return ["Fifth generation", "Pokemon Black & White"]
  }else if(id < 722){
    return ["Sixth generation", "Pokemon X & Y"]
  }else if(id < 810){
    return ["Seventh generation", "Pokemon Sun & Moon"]
  }else if(id < 906){
    return ["Eighth generation", "Pokemon Sword & Shield"]
  }else{
    return ["Ninth generation", "Pokemon Scarlet & Violet"]
  }
}
const genAndGame = setGenerationAndGame(id)
const chain = await getEvoChain(id)

const app = document.querySelector<HTMLDivElement>("#card")!

app.insertAdjacentHTML("beforeend", `
    <h3>${currentPokemon.name}</h3>
    <p><img class="pokpokimage" src=${currentPokemon.sprites.other.showdown.front_default} alt=${currentPokemon.name}></p>
    <p>${(currentPokemon.weight)/10}kg | ${(currentPokemon.height)/10}m</p>
    <div id="types"> </div>
    <p>${genAndGame[0]}</p>
    <p>${genAndGame[1]}</p>
    <p><audio controls>
      <source src=${currentPokemon.cries.latest} type="audio/ogg">
    </audio></p>
    <div id="evo-chain"> </div>
    `)

let typesList = ``
for (let type of currentPokemon.types){
  typesList = `${typesList}
  <p>${type.type.name}</p>`
}
document.querySelector<HTMLDivElement>('#types')!.innerHTML = `
  <h4>Types :</h4>
  ${typesList}`

let evochain = ``
for (let evo of chain){
  evochain = `${evochain}
  <p>${evo}</p>`
}
document.querySelector<HTMLDivElement>('#evo-chain')!.innerHTML = `
  <h4>Evolution chain: </h4>
  ${evochain}`

if(currentPokemon.moves.length > 0){
  app.insertAdjacentHTML("beforeend", `
    <div id="moves"> </div>`)
  let moves = ``
  for(let i = 0; i < currentPokemon.moves.length; i++){
    moves = `${moves}
    <p>${currentPokemon.moves[i].move.name}</p>
    `
  }
  document.querySelector<HTMLDivElement>('#moves')!.innerHTML = `
  <h4>Moves :</h4>
  ${moves}`
}

if(currentPokemon.abilities.length > 0){
  app.insertAdjacentHTML("beforeend", `
    <div id="abilities"> </div>`)
  let abilities = ``
  for (let i = 0; i < currentPokemon.abilities.length; i++){
    abilities = `${abilities}
    <p>${currentPokemon.abilities[i].ability.name}</p>`
  }
  document.querySelector<HTMLDivElement>('#abilities')!.innerHTML = `
  <h4>Abilities :</h4>
  ${abilities}`
}