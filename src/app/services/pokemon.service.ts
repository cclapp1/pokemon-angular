import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { concat, concatMap, Observable, of, take, tap, zip } from 'rxjs'
import { map } from 'rxjs'

import { Move, Page, pokeModel, Pokemon, PokeType } from '../models/pokeModel'

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  baseURL: string = 'https://pokeapi.co/api/v2'

  getAll(page: number = 1, numPokemon: number = 20): Observable<Page> {
    const offset = 20 * (page - 1)
    return this.http.get<Pokemon>(`${this.baseURL}/pokemon`, { params: { 'offset': offset, 'limit': String(numPokemon) } }).pipe(
      // concatMap((data: any) => {
      //   return this.getManySprites(data.results).pipe(map(pokemon => {
      //     data.results = pokemon
      //     return data
      //   }))
      // }),
      // concatMap((data: any) => {
      //   return this.getManyTypes(data.results).pipe(map(types => {
      //     data.results = types
      //     return data
      //   }))
      // }),
      // concatMap((pokelist: any) => {
      //   return this.getManySprites(pokelist.results).pipe(map(pokemonObj => {
      //     pokelist.pokemon = pokemonObj
      //     return pokelist
      //   }))
      // }),
      concatMap((pokelist: any) => {
        return this.getManyByName(pokelist.results).pipe(map(pokemonObj => {
          return pokemonObj
        }))
      }),
      map((data: any) => {
        let pokeList: pokeModel[] = []
        data.forEach((p: any) => {
          let pokemon = new pokeModel(p.name, p.image, p.types)
          pokeList.push(pokemon)
        })
        return new Page(page, data.count, numPokemon, pokeList)
      }))
  }

  getDetails(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseURL}/pokemon/${name}`).pipe(
      concatMap((details: any) => {
        return this.getMoves(details.moves).pipe(map(moves => {
          details.moves = moves
          return details
        }))
      }),
      map((item: any) => {
        let types = item.types.map((type: any) => {
          return new PokeType(type.type.name)
        })
        return new Pokemon(item.name, item.height, item.base_experience, item.weight, item.id, [item.sprites.front_default, item.sprites.front_shiny], types, item.moves)
      }))
  }

  getByName(name: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseURL}/pokemon/${name}`).pipe(
      map((item: any) => {
        let types = item.types.map((type: any) => {
          return new PokeType(type.type.name)
        })
        return new Pokemon(item.name, item.height, item.base_experience, item.weight, item.id, [item.sprites.front_default, item.sprites.front_shiny], types)
      }))
  }

  getManyByName(pokeList: any[]): Observable<any[]> {
    return zip(...pokeList.map(p => {
      return this.getByName(p.name).pipe(map(pokeObj => {
        return pokeObj
      }))
    }))
  }


  getTypes(name: string): Observable<string[]> {
    return this.http.get(`${this.baseURL}/pokemon/${name}`).pipe(map((data: any) => {
      return data.types.map((type: any) => {
        return new PokeType(type.type.name)
      })
    }))
  }

  getManyTypes(pokeList: any[]): Observable<any[]> {
    return zip(...pokeList.map(p => {
      return this.getTypes(p.name).pipe(map(types => {
        p.types = types
        return p
      }))
    }))
  }


  getMoves(moves: any[]): Observable<Move[]> {
    let returnArr: Observable<Move>[] = []
    for (let i = 0; i < moves.length && i < 5; i++) {
      returnArr.push(
        this.http.get(`${this.baseURL}/move/${moves[i].move.name}`).pipe(map((m: any) => {
          return new Move(m.name, m.accuracy, m.power, m.pp, m.flavor_text_entries[0].flavor_text)
        }))
      )
    }
    return zip(returnArr)
  }

  getSprite(name: string): Observable<string> {
    return this.http.get<string>(`${this.baseURL}/pokemon/${name}`).pipe(map((p: any) => {
      return p.sprites.front_default
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
