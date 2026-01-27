import './style.css'
import { getMinStat, getMaxStat, setGenerationAndGame, typeColors } from './tool';
import { getPokemon, getEvoChain } from './api';
import type { EvoImages, Pokemon } from './interface';

function stats(currentPokemon: Pokemon, color: string): string[]{
  let totalBST = 0;
  const statsHTML = currentPokemon.stats.map(s => {
    const isHP = s.stat.name === 'hp';
    totalBST += s.base_stat;
    const barWidth = (s.base_stat / 255) * 100;
    return `
      <div class="stat-line">
          <span style="color: ${color}" class="stat-name">${s.stat.name.toUpperCase()}</span>
          <span style="color: ${color}" class="stat-value">${s.base_stat}</span>
          <div class="stat-bar-bg">
            <div class="stat-bar-fill" style="width: ${barWidth}%; background-color: ${color}"></div>
          </div>
            <span style="color: ${color}" class="stat-minmax">${getMinStat(s.base_stat, isHP)}</span>
            <span style="color: ${color}" class="stat-minmax">${getMaxStat(s.base_stat, isHP)}</span>
        </div>`;
  });
  return statsHTML
}

async function evoChain(chain: string[]): Promise<string>{
  let evochain = ``
  for (let evo of chain){
    let imageFetch = await fetch(`https://pokeapi.co/api/v2/pokemon/${evo}/`)
    let image = await imageFetch.json() as EvoImages
    evochain = `${evochain}
    <p> <img src=${image.sprites.front_default} alt=${evo}> </p>
    <p>${evo}</p>`
  }
  return evochain
}

async function mainInjection(currentPokemon: Pokemon, color: string, id: number): Promise<string>{
  const genAndGame = setGenerationAndGame(id)
  const chain = await getEvoChain(id)
  const evochain = await evoChain(chain)
  const statsHTML = stats(currentPokemon, color)
  const movesHTML = currentPokemon.moves.map(m => `<span style="color: ${color}">${m.move.name}</span>`).join(' ');
  const abilitiesHTML = currentPokemon.abilities.map(a => `<p style="color: ${color}">${a.ability.name}</p>`).join('');
  let image = currentPokemon.sprites.front_default
  if(currentPokemon.sprites.other.showdown.front_default){
    image = currentPokemon.sprites.other.showdown.front_default;
  }


  return `
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
          <img class="pokpokimage" src="${image}" alt="${currentPokemon.name}">
        </div>
      </div>
    </div>
  `
}

export async function details(id: number, app: HTMLDivElement) {
  const currentPokemon = await getPokemon(id)

  const mainType = currentPokemon.types[0].type.name; //utile
  const color = typeColors[mainType] || ""; //utile

  const primaryType = currentPokemon.types[0].type.name;
  app.className = ''; //utile
  app.classList.add(`card-${primaryType}`);
  
  const mainContent = await mainInjection(currentPokemon, color, id)
  app.innerHTML = mainContent

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
}