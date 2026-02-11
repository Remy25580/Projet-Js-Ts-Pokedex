import { getPokemonsForTeams } from "./api";

export function getMinStat(base: number, isHP: boolean): number {
  if (isHP) return Math.floor(2 * base + 110);
  return Math.floor((2 * base + 5) * 0.9);
}

export function getMaxStat(base: number, isHP: boolean): number {
  if (isHP) return Math.floor(2 * base + 31 + 63 + 110);
  return Math.floor((2 * base + 31 + 63 + 5) * 1.1);
}

export const typeColors: { [key: string]: string } = {
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

export function formatId(id: number): string {
  return `#${id.toString().padStart(4, "0")}`;
}

export function setGenerationAndGame(id: number): string[] {
  const generations = [
    { max: 152, data: ["First generation", "Pokemon Red, Blue & Yellow"] },
    { max: 252, data: ["Second generation", "Pokemon Gold, Silver & Crystal"] },
    {
      max: 387,
      data: ["Third generation", "Pokemon Ruby, Sapphire & Emerald"],
    },
    {
      max: 494,
      data: ["Fourth generation", "Pokemon Diamond, Pearl & Platinium"],
    },
    { max: 650, data: ["Fifth generation", "Pokemon Black & White"] },
    { max: 722, data: ["Sixth generation", "Pokemon X & Y"] },
    { max: 810, data: ["Seventh generation", "Pokemon Sun & Moon"] },
    { max: 906, data: ["Eighth generation", "Pokemon Sword & Shield"] },
  ];
  const gen = generations.find((i) => id < i.max);
  return gen ? gen.data : ["Ninth generation", "Pokemon Scarlet & Violet"];
}

export function setGenName(id: number): string {
  const generations = [
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
    "seventh",
    "eigth",
    "ninth",
  ];
  return generations[id - 1];
}

export function setLocalStorage(){
  localStorage.setItem('nb', '0')
  localStorage.setItem('firstTeam', '')
  localStorage.setItem('secondTeam', '')
  localStorage.setItem('thirdTeam', '')
  localStorage.setItem('fourthTeam', '')
  localStorage.setItem('fifthTeam', '')
  localStorage.setItem('firstTeamlenght', '0')
  localStorage.setItem('secondTeamlenght', '0')
  localStorage.setItem('thirdTeamlenght', '0')
  localStorage.setItem('fourthTeamlenght', '0')
  localStorage.setItem('fifthTeamlenght', '0')
  localStorage.setItem('selectedTeam', 'none')
}

export function setTeamNameString(numString: string){
  const num = +numString
  switch(num){
    case 1:
      return 'firstTeam'
    case 2:
      return 'secondTeam'
    case 3:
      return 'thirdTeam'
    case 4:
      return 'fourthTeam'
    case 5:
      return 'fifthTeam'
    default:
      return 'none'
  }
}


export function createTeamList(viewOrSelect: string) {
  const teams = [
    localStorage.getItem("firstTeam"),
    localStorage.getItem("secondTeam"),
    localStorage.getItem("thirdTeam"),
    localStorage.getItem("fourthTeam"),
    localStorage.getItem("fifthTeam"),
  ];
  let selector = ``;
  let i = 1;
  for (let team of teams) {
    if (viewOrSelect === "select") {
      selector = `<input type="radio", name="choice", value=${i}>`;
    }
    let content = selector;
    if (team) {
      for (let pokemon of team.split("/")) {
        if (pokemon) {
          let img = getPokemonsForTeams(+pokemon);
          content = `${content} ${img}`;
        }
      }
    } else {
      content = `<span class="empty-text">Empty team</span>`;
    }
    document
      .querySelector<HTMLDivElement>("#teamList-content")!
      .insertAdjacentHTML(
        "beforeend",
        `<div class="team">
          ${selector}
          <div class="pokemon-slots" style="display:flex; gap:10px; align-items:center;">
            ${content}
          </div>
        </div>
      `,
      );
    i++;
  }
}

export function setPokemonsAsChecked(){
  const checked = localStorage.getItem(localStorage.getItem('selectedTeam')!)?.split('/')!

  const pokemons = document.querySelectorAll<HTMLDivElement>('.check-pokemon')
  pokemons.forEach(pokemon => {
    if(checked.includes(pokemon.dataset.id!)){
      pokemon.querySelector<HTMLInputElement>('.addToTeam')!.checked = true
    }
  })
}