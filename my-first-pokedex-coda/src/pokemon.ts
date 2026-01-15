import './style.css'

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
  };
}

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

const app = document.querySelector<HTMLDivElement>("#card")!

app.insertAdjacentHTML("beforeend", `
    <h3>${currentPokemon.name}</h3>
    `)
