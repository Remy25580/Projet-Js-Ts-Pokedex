import './style.css'
import { getMinStat, getMaxStat, setGenerationAndGame, typeColors } from './tool';
import { getPokemon, getEvoChain } from './api';
import type { EvoImages } from './interface';

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

let totalBST = 0;
const statsHTML = currentPokemon.stats.map(s => {
    const isHP = s.stat.name === 'hp';
    totalBST += s.base_stat;
    const barWidth = (s.base_stat / 255) * 100;
    return `
        <div class="stat-line">
            <span class="stat-name">${s.stat.name.toUpperCase()}</span>
            <span class="stat-value">${s.base_stat}</span>
            <div class="stat-bar-bg">
                <div class="stat-bar-fill" style="width: ${barWidth}%; background-color: ${color}"></div>
            </div>
            <span class="stat-minmax">${getMinStat(s.base_stat, isHP)}</span>
            <span class="stat-minmax">${getMaxStat(s.base_stat, isHP)}</span>
        </div>`;
}).join('');

let evochain = ``
for (let evo of chain){
  let imageFetch = await fetch(`https://pokeapi.co/api/v2/pokemon/${evo}/`)
  let image = await imageFetch.json() as EvoImages
  evochain = `${evochain}
  <p> <img src=${image.sprites.front_default} alt=${evo}> </p>
  <p>${evo}</p>`
}

const movesHTML = currentPokemon.moves.map(m => `<span>${m.move.name}</span>`).join(', ');
const abilitiesHTML = currentPokemon.abilities.map(a => `<p>${a.ability.name}</p>`).join('');


app.insertAdjacentHTML("beforeend",`
    <div class="pokemon-container">
      <div class="pokemon-infos">
        <h3 style="color: ${color}">${currentPokemon.name}</h3>

        <div class="pokemon-tabs">
          <button class="tab-btn active" data-target="tab-info" style="color: ${color}">Info</button>
          <button class="tab-btn" data-target="tab-stats" style="color: ${color}">Stats</button>
          <button class="tab-btn" data-target="tab-evo" style="color: ${color}">Évo</button>
          <button class="tab-btn" data-target="tab-moves" style="color: ${color}">Moves</button>
          <button class="tab-btn" data-target="tab-abilities" style="color: ${color}">Abilities</button>
        </div>

        <div id="tab-info" class="tab-content active">
          <p style="color: ${color}">${(currentPokemon.weight)/10}kg | ${(currentPokemon.height)/10}m</p>
          <div style="color: ${color}" id="types"></div>
          <p style="color: ${color}">${genAndGame[0]}</p>
          <p style="color: ${color}">${genAndGame[1]}</p>

          <audio id="audio-${currentPokemon.name}">
            <source src="${currentPokemon.cries.latest}" type="audio/ogg">
          </audio>

          <button class="btn-cry" onclick="document.getElementById('audio-${currentPokemon.name}').play()">
            Écouter ce Pokémon
          </button>
        </div>

        <div id="tab-stats" class="tab-content">
          ${statsHTML}
        </div>

        <div id="tab-evo" class="tab-content">
          <div style="color: ${color}" id="evo-chain">${evochain}</div>
        </div>

        <div id="tab-moves" class="tab-content">
          <div class="moves">${movesHTML}</div>
        </div>
        
        <div id="tab-abilities" class="tab-content">
          ${abilitiesHTML}
        </div>


        <div class="pokecard">
          <img class="pokpokimage" src="${currentPokemon.sprites.other.showdown.front_default}" alt="${currentPokemon.name}">
        </div>
      </div>
    </div>
  `)

const tabs = document.querySelectorAll('.tab-btn');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(btn => {
    btn.addEventListener('click', () => {
        tabs.forEach(b => b.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.getAttribute('data-target');
        document.getElementById(target!)!.classList.add('active');
    });
});
