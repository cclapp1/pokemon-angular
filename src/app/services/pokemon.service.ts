import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { concat, concatMap, Observable, of, tap, zip } from 'rxjs'
import { map } from 'rxjs'

import { Page, pokeModel, Pokemon } from '../models/pokeModel'

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  baseURL: string = 'https://pokeapi.co/api/v2'

  getAll(page: number = 1, numPokemon: number = 20): Observable<Page> {
    const offset = 20 * (page - 1)
    return this.http.get<Pokemon>(`${this.baseURL}/pokemon`, { params: { 'offset': offset, 'limit': String(numPokemon) } }).pipe(
      concatMap((data: any) => {
        return this.getManySprites(data.results).pipe(map(pokemon => {
          data.results = pokemon
          return data
        }))
      }),
      map((data: any) => {
        let pokeList: pokeModel[] = []
        data.results.forEach((p: any) => {
          let pokemon = new pokeModel(p.name, p.url, p.img)
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

  getManySprites(pokeList: any[]): Observable<any[]> {
    return zip(...pokeList.map(p => {
      return this.getSprite(p.name).pipe(map(spriteURL => {
        p.img = spriteURL
        return p
      }))
    }))
  }

  constructor(private http: HttpClient) { }
}
