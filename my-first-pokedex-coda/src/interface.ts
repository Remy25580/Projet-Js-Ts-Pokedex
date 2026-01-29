export interface PokeNames {
  results: [{
    name: string;
  }];
}

export interface PokeLink {
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

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  abilities: [{
    is_hidden: boolean;
    slot: number;
    ability: {
      name: string;
    };
  }];
  moves: [{
    move: {
      name: string;
    };
  }];
  sprites: {
    front_default: string;
    other: {
      showdown: {
        front_default: string;
      };
    };
  };
  cries: {
    latest: string;
  };
  types:[{
    type: {
      name: string;
    };
  }];
  species:{
    name: string;
  };
  stats: [{
    base_stat: number;
    stat: {
      name: string;
    };  
  }]
}

export interface Specie {
  evolution_chain: {
    url: string;
  };
}

export interface Evolution {
  chain: {
    species: {
      name: string;
    };
    evolves_to: [{
      species: {
        name: string;
      };
      evolves_to: [{
        species: {
          name: string;
        };
      }];
    }];
  };
}

export interface EvoImages {
  sprites: {
    front_default: string;
  };
}

export interface NameId {
    id: number
    name: string;
    sprites: {
        front_default: string;
    };
}

export interface  TypeAbility {
    name: string;
    pokemon: [{
        pokemon: {
            name: string;
            url: string;
        };
    }];
}

export interface Generation {
    pokemon_species: [{
        name: string;
        url: string;
    }];
}

export interface Pokeimage{
  sprites: {
    front_default: string;
  };
}