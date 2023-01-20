import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { concat, concatMap, Observable, of, take, tap, zip } from 'rxjs'
import { map } from 'rxjs'

import { Habitat, Move, Page, pokeModel, Pokemon, PokeType, pokeTypeList } from '../models/pokeModel'

@Injectable({
  providedIn: 'root'
})

export class PokemonService {
  baseURL: string = 'https://pokeapi.co/api/v2'

  getAll(page: number = 1, numPokemon: number = 20): Observable<Page> {
    const offset = 20 * (page - 1)
    return this.http.get<Pokemon>(`${this.baseURL}/pokemon`, { params: { 'offset': offset, 'limit': String(numPokemon) } }).pipe(
      concatMap((pokelist: any) => {
        pokelist.results = pokelist.results.map((item: any) => {
          return item.name
        })
        return this.getManyByName(pokelist.results).pipe(map(pokemonObj => {
          pokelist.results = pokemonObj
          return pokelist
        }))
      }),
      map((data: any) => {
        let pokeList: Pokemon[] = []
        data.results.forEach((p: any) => {
          pokeList.push(p)
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

  //Gets a list of pokemon from a list of names
  getManyByName(pokeList: any[]): Observable<any[]> {
    return zip(...pokeList.map(p => {
      return this.getByName(p).pipe(map(pokeObj => {
        return pokeObj
      }))
    }))
  }

  //Gets all the possible types from the API
  getAllTypes(): Observable<PokeType[]> {
    return this.http.get<PokeType>(`${this.baseURL}/type`).pipe(map((types: any) => {
      return types.results.map((type: any) => {
        return new PokeType(type.name)
      })
    }))
  }


  getMoves(moves: any[]): Observable<Move[]> {
    let returnArr: Observable<Move>[] = []
    for (let i = 0; i < moves.length && i < 50; i++) {
      returnArr.push(
        this.http.get(`${this.baseURL}/move/${moves[i].move.name}`).pipe(map((m: any) => {
          return new Move(m.name, m.accuracy, m.power, m.pp, m.type.name, m.flavor_text_entries[0]?.flavor_text)
        }))
      )
    }
    return zip(returnArr)
  }



  getEnv(name: string): Observable<Habitat> {
    return this.http.get<Habitat>(`${this.baseURL}/pokemon-habitat/${name}`).pipe(map((m: any) => {
      //console.log("getEnv", m)
      let pokeList = new Habitat();
      m.pokemon_species.forEach((pokemon_species: any) => {
        pokeList.pokemon_species?.push(pokemon_species.name)
      })
      return pokeList
    }))
  }


  filterByType(type: string) {
    return this.http.get(`${this.baseURL}/type/${type}`).pipe(map((item: any) => {
      let pokeList = new pokeTypeList();
      item.pokemon.forEach((pokemon: any) => {
        pokeList.pokemonOfType?.push(pokemon.pokemon.name);
        //console.log("pokemon name", pokemon.pokemon.name);
      })
      //console.log("This is my pokelist", pokeList);
      return pokeList;
    }))


  }
  constructor(private http: HttpClient) { }
}
