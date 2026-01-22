import './style.css'

//Définitions des couleurs pour les différents types
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


//Interface stockant les infos relatives au pokémon
interface PokeLink {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types:[{
    type: {
      name: string;
    };
  }];
}

//Fonction pour récupérer les infos du pokémon
async function getPokemonIndic(id: number) {
  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
  const result = await pokemon.json() as PokeLink;
  return result;
}

//Fonction pour réécrire l'id au format #xxxx
function formatId(id: number): string {
  return `#${id.toString().padStart(4, '0')}`
}


const app = document.querySelector<HTMLDivElement>('#poke-liste')!

const loader = document.getElementById("loader")!;
const progressBar = document.querySelector<HTMLDivElement>(".progress-bar")!;
const progressText = document.getElementById("progress-text")!; 

//Fonction pour insérer en html les pokémons séléctionés par la page
async function pokeLoad(gap: number) {
  let begin
  let end

  if(gap === 0){
    begin = 1
    end = 1026
  }else{
    begin = (25*(gap-1)) + 1
    end = (25*gap) +1
  }

  for (let i = begin; i < end; i++){
    const pok = await getPokemonIndic(i);
    app.insertAdjacentHTML('beforeend',`
    <div class="pokemon to-pokemon-page" data-id=${i}>
      <p><img class="pokimage" src=${pok.sprites.front_default} alt="image de ${pok.name}"></p>
      <p>${pok.name}</p>
      <div id="types-${i}" class="types"> </div>
      <p class="pokemon-id">${formatId(i)}</p>
    </div>`)
    
    for (let type of pok.types){
      const typeName = type.type.name
      const color = typeColors[typeName] || "";
      document.querySelector<HTMLDivElement>(`#types-${i}`)!.insertAdjacentHTML('beforeend', `
      <div class="type-badge" style="background-color: ${color}">
        ${typeName}
      </div>`);
    }
      
    
    const percent = Math.round(((i-(begin-1)) / (end-begin)) * 100);
    progressBar.style.width = `${percent}%`;
    progressText.textContent = `Loading: ${percent}%`;
  }

  loader.remove();
}

//récupération de la page dans l'url pour afficher les pokémons
const paramsUrl = new URLSearchParams(window.location.search)
let pageString = paramsUrl.get("page")
if(!pageString){
  pageString = "1"
}
const page = +pageString

pokeLoad(page);

//Event qui redirige vers la page du pokémon correspondant quand on lui clique dessus
app.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;

  const card = target.closest(".to-pokemon-page") as HTMLElement | null
  if(!card){
    return
  }
  const id = card.dataset.id;
  if(!id){
    return
  }
  window.location.href = `pokemon.html?id=${id}`
})

/*numérotation + choix des pages, demande moi si tu n'as pas compris ! */
/* bar pagination est le seul changement que j'ai fais dans index .html !*/

const conteneurPagination = document.querySelector<HTMLElement>('#barre-pagination')!;

if (page > 1) {
  conteneurPagination.insertAdjacentHTML("beforeend", `
    <a href="index.html?page=${page - 1}" class="bouton-page">«</a>
  `);
}

/* calcul des nombres avant et apres ici 4 de chaque coté 
par exemple on aurait : [<, 5, 6, 7, 8, 9, 10, 11, 12, 13, >] */

let pageDebut = Math.max(1, page - 4); 
let pageFin = Math.min(41, page + 4);

/* on met les num */

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

/* bouton pour tout les pokemon */

const estToutAfficherActive = (page === 0) ? 'page-actuelle' : '';
conteneurPagination.insertAdjacentHTML("beforeend", `
  <a href="index.html?page=0" class="bouton-page ${estToutAfficherActive}" style="width: auto; padding: 0 12px;">
    Tous
  </a>
`);

