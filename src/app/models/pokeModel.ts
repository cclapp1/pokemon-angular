import { formatName } from "./pokeFunc"

export class Pokemon {
    name: string
    formattedName: string
    height: number
    baseExp: number
    weight: number
    id: number
    image: string[]
    moves?: Move[]
    types: PokeType[]


    constructor(n: string, h: number, b: number, w: number, i: number, img: string[], t: PokeType[], m?: Move[]) {
        this.name = n
        this.height = h
        this.baseExp = b
        this.weight = w
        this.id = i
        this.image = img
        this.moves = m
        this.types = t

        this.formattedName = formatName(this.name)
    }
}

export class PokeType {
    private pokeColors: any = {
        normal: '#A8A878',
        fire: '#F08030',
        water: '#6890F0',
        electric: '#F8D030',
        grass: '#78C850',
        ice: '#98D8D8',
        fighting: '#C03028',
        poison: '#A040A0',
        ground: '#E0C068',
        flying: '#A890F0',
        psychic: '#F85888',
        bug: '#A8B820',
        rock: '#B8A038',
        ghost: '#705898',
        dragon: '#7038F8',
        dark: '#705848',
        steel: '#B8B8D0',
        fairy: '#EE99AC'
    }

    private pokeColorsDark: any = {
        normal: '#6D6D4E',
        fire: '#9C531F',
        water: '#445E9C',
        electric: '#A1871F',
        grass: '#4E8234',
        ice: '#638D8D',
        fighting: '#7D1F1A',
        poison: '#682A68',
        ground: '#927D44',
        flying: '#6D5E9C',
        psychic: '#A13959',
        bug: '#6D7815',
        rock: '#786824',
        ghost: '#493963',
        dragon: '#4924A1',
        dark: '#49392F',
        steel: '#787887',
        fairy: '#9B6470'
    }

    name: string
    formattedName: string
    color: string
    darkColor: string

    constructor(n: string) {
        let key = n as keyof typeof this.pokeColors
        this.name = n
        this.color = this.pokeColors[key]
        this.darkColor = this.pokeColorsDark[key]
        this.formattedName = formatName(n)
    }
}

export class Move {
    name: string
    formattedName: string
    accuracy: number
    power: number
    pp: number
    type: PokeType
    desc?: string

    constructor(n: string, a: number, po: number, pp: number, type: string, d?: string) {
        //Formats the move so that the - is removed and words are capitalised
        this.formattedName = formatName(n)
        this.name = n
        this.accuracy = a
        this.power = po
        this.pp = pp
        this.desc = d
        this.type = new PokeType(type)
    }
}

export class pokeModel {
    name: string
    img: string
    types: PokeType[]

    constructor(n: string, i: string, t: PokeType[]) {
        this.name = n
        this.img = i
        this.types = t
    }
}

export class Page {
    currentPage: number
    total: number
    limit: number
    pokemonList: Pokemon[]

    nextPage(): void {

    }

    prevPage(): void {

    }

    getPokemon(index: number, page: number) {

    }

    constructor(c: number, t: number, l: number, p: Pokemon[]) {
        this.currentPage = c
        this.total = t
        this.limit = l
        this.pokemonList = p
    }
}




export class Habitat {
    pokemon_species: string[];

    constructor(pokemon_species: string[] = []) {
        this.pokemon_species = pokemon_species;
    }
}


export class pokeTypeList {
    pokemonOfType?: string[];

    constructor(pokemonOfType: string[] = []) {
        this.pokemonOfType = pokemonOfType;
    }
}