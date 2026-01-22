import './style.css'
<<<<<<< HEAD
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
  dark: "#705848",
  steel: "#B8B8D0",
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
  stats: [{
    base_stat: number;
    stat: {
      name: string;
    };  
  }]
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
=======
import { getMinStat } from './tool';
import { getMaxStat } from './tool';
import  { typeColors } from './tool';
import { setGenerationAndGame } from './tool';
import { getPokemon } from './api';
import { getEvoChain } from './api';
import type { EvoImages } from './interface';
>>>>>>> 51126e6691e0aa5406c1c123238e61bd0922729d

//Récupération du pokémon
const paramsUrl = new URLSearchParams(window.location.search)
const idString = paramsUrl.get("id")
if(!idString){
    throw console.error("Impossible de trouver ce pokemon");
}
const id = +idString
const currentPokemon = await getPokemon(id)

document.title = `PokPok - ${currentPokemon.name}`

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

<<<<<<< HEAD
//fonction de calcul des stats

function getMinStat(base: number, isHP: boolean): number {
  if (isHP) return Math.floor(2 * base + 110);
  return Math.floor((2 * base + 5) * 0.9);
}

function getMaxStat(base: number, isHP: boolean): number {
  if (isHP) return Math.floor(2 * base + 31 + 63 + 110);
  return Math.floor((2 * base + 31 + 63 + 5) * 1.1);
}

//========================INSERTIONS DU CODE HTML====================================//

=======
>>>>>>> 51126e6691e0aa5406c1c123238e61bd0922729d
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


let statsHTML = `
  <div class="stats-container" style="color: ${color}">
    <h4>Base Stats</h4>
    <div class="stat-line header" style="opacity: 0.7; font-size: 0.7rem; font-weight: bold;">
      <span class="stat-name"></span>
      <span class="stat-value"></span>
      <div class="stat-bar-bg" style="background: transparent;"></div>
      <span class="stat-minmax">Min</span>
      <span class="stat-minmax">Max</span>
    </div>
`;
let totalBST = 0;

currentPokemon.stats.forEach(s => {
  const isHP = s.stat.name === 'hp';
  const min = getMinStat(s.base_stat, isHP);
  const max = getMaxStat(s.base_stat, isHP);
  const barWidth = (s.base_stat / 255) * 100;
  totalBST += s.base_stat;

  statsHTML += `
    <div class="stat-line">
      <span class="stat-name">${s.stat.name.toUpperCase()}</span>
      <span class="stat-value">${s.base_stat}</span>
      <div class="stat-bar-bg">
        <div class="stat-bar-fill" style="width: ${barWidth}%; background-color: ${color}; box-shadow: 0 0 10px ${color}66;"></div>
      </div>
      <span class="stat-minmax">${min}</span>
      <span class="stat-minmax">${max}</span>
    </div>
  `;
});

statsHTML += `<div class="stat-total"><strong>Total: ${totalBST}</strong></div></div>`;
app.insertAdjacentHTML("beforeend", statsHTML);

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