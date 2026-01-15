import './style.css'

interface PokeLink {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

async function getPokemonIndic(id: number) {
  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}//`)
  const result = await pokemon.json() as PokeLink;
  return result;
}

const app = document.querySelector<HTMLDivElement>('#poke-liste')!

for (let i = 1; i < 1026; i++){
  const pok = await getPokemonIndic(i);
  app.insertAdjacentHTML('beforeend',`
    <div class="pokemon">
      <p><img class="pokimage" src=${pok.sprites.front_default} alt="image de ${pok.name}"></p>
      <p>${i}</p>
      <p>${pok.name}</p>
    </div>`)
  }

//document.querySelector<HTMLDivElement>('#app')!.innerHTML