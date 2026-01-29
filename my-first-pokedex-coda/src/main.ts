import './style.css'
import { formatId, typeColors, setLocalStorage, createTeamList } from './tool';
import { getPokemonIndic, getPokemonList } from './api';
import { details } from './pokemon';


const app = document.querySelector<HTMLDivElement>('#poke-liste')!
const modal = document.getElementById(`pokemon-modal`)! as HTMLDivElement
const pokedetails = document.getElementById(`pokemon-details`) as HTMLDivElement
const closeBtn = document.getElementById("close-modal") as HTMLButtonElement
const prevButon = document.getElementById("previous-modal") as HTMLButtonElement
const nextButon = document.getElementById("next-modal") as HTMLButtonElement
const searchBar = document.getElementById("search") as HTMLInputElement
const conteneurPagination = document.querySelector<HTMLElement>('#barre-pagination')!;
const teamCreator = document.getElementById("teamCreator") as HTMLButtonElement
const teamViewer = document.getElementById("teams") as HTMLButtonElement
let debounceTimer: number
let pokemonShown: number
const loader = document.getElementById("loader")!;
const progressBar = document.querySelector<HTMLDivElement>(".progress-bar")!;
const progressText = document.getElementById("progress-text")!;

if(!localStorage.getItem('nb')){
  setLocalStorage()
}
let numberOfTeams = localStorage.getItem('nb')!
console.log(numberOfTeams)
if(+numberOfTeams !== 0){
  document.getElementById("teams")!.classList.remove("hidden")
}

let L = (await getPokemonList()).results;
let hasToBeShown = sessionStorage.getItem('id')

//Fonction pour insérer en html les pokémons séléctionés par la page
async function pokeLoad(gap: number, list: { name: string }[]) {
  let begin
  let end


  if (gap === 0) {
    begin = 1
    end = list.length + 1
  } else {
    begin = (25 * (gap - 1)) + 1
    end = (25 * gap) + 1
  } 
  
  for(let i = begin; i < end; i++){
    const pok = await getPokemonIndic(list[i-1].name);
    app.insertAdjacentHTML('beforeend', `
    <div id="pokemon-${pok.id}" class="pokemon to-pokemon-page" data-id=${pok.id}>
      <input type="checkbox" class="addToTeam hidden">
      <p><img class="pokimage" src=${pok.sprites.front_default} alt="image de ${pok.name}"></p>
      <p>${pok.name}</p>
      <div id="types-${pok.id}" class="types"> </div>
      <p class="pokemon-id">${formatId(pok.id)}</p>
    </div>`)

    for (let type of pok.types) {
      const typeName = type.type.name
      const color = typeColors[typeName] || "";
      document.querySelector<HTMLDivElement>(`#types-${pok.id}`)!.insertAdjacentHTML('beforeend', `
      <div class="type-badge" style="background-color: ${color}">
        ${typeName}
      </div>`);
    }

    const percent = Math.round(((i - (begin - 1)) / (end - begin)) * 100);
    progressBar.style.width = `${percent}%`;
    progressText.textContent = `Loading: ${percent}%`;
  }

  loader.remove();
}

function injectNavigation(){
  if (page > 1) {
    conteneurPagination.insertAdjacentHTML("beforeend", `
      <a href="index.html?page=${page - 1}" class="bouton-page">«</a>
    `);
  }

  let pageDebut = Math.max(1, page - 4);
  let pageFin = Math.min(41, page + 4);

  for (let num = pageDebut; num <= pageFin; num++) {
    const estPageActive = (num === page) ? 'page-actuelle' : '';

    conteneurPagination.insertAdjacentHTML("beforeend", `
      <a href="index.html?page=${num}" class="bouton-page ${estPageActive}">
        ${num}
      </a>
    `);
  }

  if (page < 41 && page !== 0) {
    conteneurPagination.insertAdjacentHTML("beforeend", `
      <a href="index.html?page=${page + 1}" class="bouton-page">»</a>
    `);
  }

  const estToutAfficherActive = (page === 0) ? 'page-actuelle' : '';
  conteneurPagination.insertAdjacentHTML("beforeend", `
    <a href="index.html?page=0" class="bouton-page ${estToutAfficherActive}" style="width: auto; padding: 0 12px;">
      All
    </a>
  `);
}

//récupération de la page dans l'url pour afficher les pokémons
const paramsUrl = new URLSearchParams(window.location.search)
let pageString = paramsUrl.get("page")
if (!pageString) {
  pageString = "1"
}
let page = +pageString
pokeLoad(page, L);
injectNavigation();

if(hasToBeShown){
  console.log(hasToBeShown)
  modal.classList.remove("hidden")
  document.body.classList.add('modal-open')

  details(+hasToBeShown, pokedetails)
  pokemonShown = +hasToBeShown
  sessionStorage.clear()
}

//Event qui redirige vers la page du pokémon correspondant quand on lui clique dessus


app.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  const card = target.closest(".to-pokemon-page") as HTMLElement | null
  if (!card) {
    return
  }
  event.stopPropagation()

  const id = card.dataset.id;
  if (!id) {
    return
  }

  modal.classList.remove("hidden")
  document.body.classList.add('modal-open')

  details(+id, pokedetails)
  pokemonShown = +id

})

const modalContent = modal.querySelector(".modal-content")!

modalContent.addEventListener("click", e => {
  e.stopPropagation()
})

closeBtn.addEventListener("click", () => {
  modal.classList.add("hidden")
  document.body.classList.remove("modal-open")
})

modal.addEventListener("click", () => {
  modal.classList.add("hidden")
  document.body.classList.remove("modal-open")
})

prevButon.addEventListener("click", () => {
  pokedetails.innerHTML = ""
  pokemonShown = pokemonShown - 1
  if (pokemonShown === 0) {
    modal.classList.add("hidden")
    document.body.classList.remove("modal-open")
  } else {
    details(pokemonShown, pokedetails)
  }
})

nextButon.addEventListener("click", () => {
  pokedetails.innerHTML = ""
  pokemonShown = pokemonShown + 1
  if (pokemonShown === 1026) {
    modal.classList.add("hidden")
    document.body.classList.remove("modal-open")
  } else {
    details(pokemonShown, pokedetails)
  }
})

searchBar.addEventListener('input', () => {
  clearTimeout(debounceTimer)

  debounceTimer = window.setTimeout(() => {
    app.innerHTML= ``
      const querry = searchBar.value.toLowerCase()
      let filteredL
      if (querry !== ''){
        const reg = new RegExp(`^${querry}`, 'i')
        filteredL = L.filter((name) => reg.test(name.name))
        page = 0
        pokeLoad(0, filteredL)
        conteneurPagination.innerHTML = ``
      }else{
        filteredL = L
        page = 1
        pokeLoad(page, filteredL)
        injectNavigation()
      }
  }, 250)
})

teamCreator.addEventListener('click', () => {
  document.querySelectorAll<HTMLInputElement>(".addToTeam").forEach((checkbox) => {
    checkbox.classList.remove("hidden")
  })
  document.querySelector<HTMLDivElement>('#teamList-content')!.innerHTML = ''
  createTeamList('select')
  document.querySelector<HTMLDivElement>('#teamList')!.classList.remove("hidden")
  /*let temp = +numberOfTeams
  temp++
  localStorage.setItem('nb', temp.toString())
  numberOfTeams = localStorage.getItem('nb')!*/
})

teamViewer.addEventListener('click', () => {
  document.querySelector<HTMLDivElement>('#teamList-content')!.innerHTML = ''
  createTeamList('view')
  document.querySelector<HTMLButtonElement>("#close-list")!.classList.remove("hidden")
  document.querySelector<HTMLDivElement>('#teamList')!.classList.remove("hidden")
})

document.querySelector<HTMLButtonElement>("#close-list")!.addEventListener('click', () => {
  document.querySelector<HTMLDivElement>("#teamList")!.classList.add("hidden")
  document.querySelector<HTMLButtonElement>("#close-list")!.classList.add("hidden")
})