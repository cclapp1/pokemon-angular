import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs'

import { pokeModel, Pokemon } from '../models/pokeModel'

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  baseURL: string = 'https://pokeapi.co/api/v2'

  getAll(): Observable<pokeModel[]> {
    return this.http.get<Pokemon>(`${this.baseURL}/pokemon`).pipe(map((data: any) => {
      let pokeList: pokeModel[] = []
      data.results.forEach((p: any) => {
        let pokemon = new pokeModel(p.name, p.url)
        pokeList.push(pokemon)
      })
      return pokeList
    }))
  }

  getByName(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseURL}/pokemon/${name}`).pipe(map((item: any) => {
      return new Pokemon(item.name, item.height, item.base_experience, item.weight, item.id, item.sprites.front_default)
    }))
  }

  getSprite(name: string): Observable<string> {
    return this.getByName(name).pipe(map(data => {
      return data.image
    }))
  }

  constructor(private http: HttpClient) { }
}
