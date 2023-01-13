export class Pokemon {
    name: string
    height: number
    baseExp: number
    weight: number
    id: number
    image: string[]

    constructor(n: string, h: number, b: number, w: number, i: number, img: string[]) {
        this.name = n
        this.height = h
        this.baseExp = b
        this.weight = w
        this.id = i
        this.image = img
    }
}

export class pokeModel {
    name: string
    url: string
    img: string

    setImg(img: string): void {
        this.img = img
    }

    constructor(n: string, u: string) {
        this.name = n
        this.url = u
        this.img = ''
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