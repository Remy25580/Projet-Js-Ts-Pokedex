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
  return `#${id.toString().padStart(4, '0')}`
}

export function setGenerationAndGame(id: number): string[]{
  const generations = [
    { max: 152, data: ["First generation", "Pokemon Red, Blue & Yellow"] },
    { max: 252, data: ["Second generation", "Pokemon Gold, Silver & Crystal"]},
    { max: 387, data: ["Third generation", "Pokemon Ruby, Sapphire & Emerald"]},
    { max: 494, data: ["Fourth generation", "Pokemon Diamond, Pearl & Platinium"]},
    { max: 650, data: ["Fifth generation", "Pokemon Black & White"]},
    { max: 722, data: ["Sixth generation", "Pokemon X & Y"]},
    { max: 810, data: ["Seventh generation", "Pokemon Sun & Moon"]},
    { max: 906, data: ["Eighth generation", "Pokemon Sword & Shield"]},
  ]
  const gen = generations.find(i => id < i.max);
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
        "ninth"
    ]
    return generations[id-1];
}