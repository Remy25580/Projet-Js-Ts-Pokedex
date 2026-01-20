import './style.css'
const typeColors: { [key: string]: string } = {
  grass: "#48d056",
  fire: "#f03535",
  water: "#3a9af4",
  electric: "#ffc62b",
  poison: "#b046db",
  bug: "#A8B820",
  normal: "#aeae93",
  ground: "#E0C068",
  fairy: "#EE99AC",
  fighting: "#C03028",
  psychic: "#F85888",
  rock: "#B8A038",
  ghost: "#705898",
  ice: "#98D8D8",
  dragon: "#7038F8",
  flying: "#8ce0de",
};
//===================================INTERFACES=======================================//

export interface Pokemon {
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

interface EvoImages {
  sprites: {
    front_default: string;
  };
}

//======================================FONCTIONS==========================================//

//Fonction pour récupérer les informations du pokémon ciblé
async function getPokemon(id: number) {
  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
  const result = await pokemon.json() as Pokemon;
  return result;
}

//Récupération du pokémon
const paramsUrl = new URLSearchParams(window.location.search)
const idString = paramsUrl.get("id")
if(!idString){
    throw console.error("Impossible de trouver ce pokemon");
}
const id = +idString
const currentPokemon = await getPokemon(id)


document.title = `PokPok - ${currentPokemon.name}`

//Fonction pour récupérer la chaîne d'évolution du pokémon
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

//Fonction pour prendre le jeu et la génération associé
function setGenerationAndGame(id: number): string[]{
  const generations = [
    { max: 152, data: ["First generation", "Pokemon Red, Blue & Yellow"] },
    { max: 252, data: ["Second generation", "Pokemon Gold, Silver & Crystal"]},
    { max: 387, data: ["Third generation", "Pokemon Ruby, Sapphire & Emerald"]},
    { max: 494, data: ["Fourth generation", "Pokemon Diamond, Pearl & Platinium"]},
    { max: 650, data: ["Fifth generation", "Pokemon Black & White"]},
    { max: 722, data: ["Sixth generation", "Pokemon X & Y"]},
    { max: 810, data: ["Seventh generation", "Pokemon Sun & Moon"]},
    { max: 906, data: ["Eighth generation", "Pokemon Sword & Shield"]},
  ]
  const gen = generations.find(g => id < g.max);
  return gen ? gen.data : ["Ninth generation", "Pokemon Scarlet & Violet"];
}

const genAndGame = setGenerationAndGame(id)
const chain = await getEvoChain(id)

const app = document.querySelector<HTMLDivElement>("#card")!

const primaryType = currentPokemon.types[0].type.name;

const mainType = currentPokemon.types[0].type.name;
    const color = typeColors[mainType] || "";

app.className = '';
app.classList.add(`card-${primaryType}`);

const title = app.querySelector('h3');
if (title) {
    title.style.textShadow = `0 0 10px var(--neon-color)`;
    title.style.color = 'white';
}

//========================INSERTIONS DU CODE HTML====================================//

app.insertAdjacentHTML("beforeend", `
    <div class="pokemon-container">
      <div class="pokemon-infos">
        <h3 style="color: ${color}">${currentPokemon.name}</h3>
        <p style="color: ${color}">${(currentPokemon.weight)/10}kg | ${(currentPokemon.height)/10}m</p>
        <div style="color: ${color}" id="types"></div>
        <p style="color: ${color}">${genAndGame[0]}</p>
        <p style="color: ${color}">${genAndGame[1]}</p>
      </div>

      <div class="pokecard">
        <img class="pokpokimage" src="${currentPokemon.sprites.other.showdown.front_default}" alt="${currentPokemon.name}">
        
        <audio id="audio-${currentPokemon.name}">
          <source src="${currentPokemon.cries.latest}" type="audio/ogg">
        </audio>

        <button class="btn-cry" onclick="document.getElementById('audio-${currentPokemon.name}').play()">
          Écouter ce Pokémon
        </button>
      </div>
    </div>

    
    <div style="color: ${color}" id="evo-chain"></div>
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
  let imageFetch = await fetch(`https://pokeapi.co/api/v2/pokemon/${evo}/`)
  let image = await imageFetch.json() as EvoImages
  evochain = `${evochain}
  <p> <img src=${image.sprites.front_default} alt=${evo}> </p>
  <p>${evo}</p>`
}
document.querySelector<HTMLDivElement>('#evo-chain')!.innerHTML = `
  <h4>Evolution chain: </h4>
  ${evochain}`


if(currentPokemon.moves.length > 0){
  app.insertAdjacentHTML("beforeend", `
    <div style="color: ${color}" id="moves"> </div>`)
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
    <div style="color: ${color}" id="abilities"> </div>`)
  let abilities = ``
  for (let i = 0; i < currentPokemon.abilities.length; i++){
    abilities = `${abilities}
    <p>${currentPokemon.abilities[i].ability.name}</p>`
  }
  document.querySelector<HTMLDivElement>('#abilities')!.innerHTML = `
  <h4>Abilities :</h4>
  ${abilities}`
}