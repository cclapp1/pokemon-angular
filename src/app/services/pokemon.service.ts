import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map, of } from 'rxjs'

import pokeData from '../../pokemon.json'
import { Pokemon } from '../pokeModel'

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  getAll(): Observable<Pokemon[]> {
    return of(pokeData)
  }

  getById(id: number): Observable<Pokemon | undefined> {
    return this.getAll().pipe(map(all => all.find(p => p.id == id)))
  }

  constructor() { }
}
