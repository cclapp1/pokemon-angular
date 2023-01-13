import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs'

import { Page, pokeModel, Pokemon } from '../models/pokeModel'

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  baseURL: string = 'https://pokeapi.co/api/v2'

  getAll(page: number = 1, numPokemon: number = 20): Observable<Page> {
    const offset = 20 * (page - 1)
    return this.http.get<Pokemon>(`${this.baseURL}/pokemon`, { params: { 'offset': offset, 'limit': String(numPokemon) } }).pipe(map((data: any) => {
      let pokeList: pokeModel[] = []
      data.results.forEach((p: any) => {
        let pokemon = new pokeModel(p.name, p.url)
        pokeList.push(pokemon)
      })
      return new Page(page, data.count, numPokemon, pokeList)
    }))
  }

  getByName(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseURL}/pokemon/${name}`).pipe(map((item: any) => {
      return new Pokemon(item.name, item.height, item.base_experience, item.weight, item.id, [item.sprites.front_default, item.sprites.front_shiny])
    }))
  }

  getSprite(name: string): Observable<string> {
    return this.getByName(name).pipe(map(data => {
      return data.image[0]
    }))
  }

  constructor(private http: HttpClient) { }
}
