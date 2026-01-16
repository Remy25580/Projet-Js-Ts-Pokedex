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

const app = document.querySelector<HTMLDivElement>('#poke-liste')!

const loader = document.getElementById("loader")!;
const progressBar = document.querySelector<HTMLDivElement>(".progress-bar")!;
const progressText = document.getElementById("progress-text")!; 

async function pokeLoad() {
  for (let i = 1; i < 1026; i++){
    const pok = await getPokemonIndic(i);
    app.insertAdjacentHTML('beforeend',`
      <div class="pokemon">
        <p><img class="pokimage" src=${pok.sprites.front_default} alt="image de ${pok.name}"></p>
        <p>${i}</p>
        <p><button class="poke-btn" data-id=${i}>${pok.name}</button></p>
      </div>`)
    
    const percent = Math.round((i / 1025) * 100);
    progressBar.style.width = `${percent}%`;
    progressText.textContent = `Loading: ${percent}%`;
  }

  loader.remove();
}

pokeLoad();

app.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;

  if (target.classList.contains("poke-btn")) {
    const id = target.dataset.id;
    if (!id) return;

    window.location.href = `pokemon.html?id=${id}`;
  }
});


//document.querySelector<HTMLDivElement>('#app')!.innerHTML