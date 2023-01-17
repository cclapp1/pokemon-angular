export class Pokemon {
    name: string
    height: number
    baseExp: number
    weight: number
    id: number
    image: string[]
    moves: Move[]

    constructor(n: string, h: number, b: number, w: number, i: number, img: string[], m: Move[]) {
        this.name = n
        this.height = h
        this.baseExp = b
        this.weight = w
        this.id = i
        this.image = img
        this.moves = m
    }
}

export class Move {
    name: string
    accuracy: number
    power: number
    pp: number
    desc: string

    constructor(n: string, a: number, po: number, pp: number, d: string) {
        this.name = n
        this.accuracy = a
        this.power = po
        this.pp = pp
        this.desc = d
    }
}

export class pokeModel {
    name: string
    url: string
    img: string

    constructor(n: string, u: string, i: string) {
        this.name = n
        this.url = u
        this.img = i
    }
}

export class Page {
    currentPage: number
    total: number
    limit: number
    pokemonList: pokeModel[]

    constructor(c: number, t: number, l: number, p: pokeModel[]) {
        this.currentPage = c
        this.total = t
        this.limit = l
        this.pokemonList = p
    }
}