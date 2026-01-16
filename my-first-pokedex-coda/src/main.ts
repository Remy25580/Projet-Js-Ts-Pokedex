import './style.css'

interface PokeLink {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

async function getPokemonIndic(id: number) {
  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
  const result = await pokemon.json() as PokeLink;
  return result;
}

function formatId(id: number): string {
  return `#${id.toString().padStart(4, '0')}`
}


const app = document.querySelector<HTMLDivElement>('#poke-liste')!

const loader = document.getElementById("loader")!;
const progressBar = document.querySelector<HTMLDivElement>(".progress-bar")!;
const progressText = document.getElementById("progress-text")!; 

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
        <p>${formatId(i)}</p>
        <p>${pok.name}</p>
      </div>`)
    
    const percent = Math.round((i / 1025) * 100);
    progressBar.style.width = `${percent}%`;
    progressText.textContent = `Loading: ${percent}%`;
  }

  loader.remove();
}

const paramsUrl = new URLSearchParams(window.location.search)
let pageString = paramsUrl.get("page")
if(!pageString){
  pageString = "1"
}
const page = +pageString

pokeLoad(page);


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

const pages = document.querySelector<HTMLDivElement>('#pages-list')!
for (let p = 1; p < 42; p++){
  pages.insertAdjacentHTML("beforeend", `
    <a href="index.html?page=${p}">Page ${p}</a>
    `)
}
pages.insertAdjacentHTML("beforeend", `
  <a href="index.html?page=0">All pokemons</a>
  `)

//document.querySelector<HTMLDivElement>('#app')!.innerHTML