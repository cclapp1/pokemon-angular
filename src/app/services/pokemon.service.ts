import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, concat, concatMap, Observable, of, zip } from 'rxjs'
import { map } from 'rxjs'

import { Habitat, Move, Page, Pokemon, PokeType, pokeTypeList } from '../models/pokeModel'

@Injectable({
  providedIn: 'root'
})

export class PokemonService {
  baseURL: string = 'https://pokeapi.co/api/v2'

  //Gets all the pokemon for the home page.
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

  //Gets details of the pokemon for the details page. Includes moves
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

  //Gets a pokemon by name, simiar to getDetails but missing the moves API call due to slowness
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
  getManyByName(pokeList: any[]): Observable<Pokemon[]> {
    return zip(pokeList.map(p => {
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


  //Gets a list of moves from an array of pokemon
  getMoves(moves: any[]): Observable<Move[]> {
    let returnArr: Observable<Move>[] = []
    //Limiter for the moves so that call can be limited
    for (let i = 0; i < moves.length && i < moves.length; i++) {
      returnArr.push(
        this.http.get(`${this.baseURL}/move/${moves[i].move.name}`).pipe(map((m: any) => {
          //Finds the first english text string for the description
          //Sometimes the first result is a non english string
          let englishDesc: string = ''
          for (let i = 0; i < m.flavor_text_entries.length; i++) {
            if (m.flavor_text_entries[i]?.language.name == 'en') {
              englishDesc = m.flavor_text_entries[i]?.flavor_text
              break
            }
          }
          return new Move(m.name, m.accuracy, m.power, m.pp, m.type.name, englishDesc)
        }),
          catchError(err => {
            let newMoves: Move[] = []
            newMoves.push(new Move('error getting moves', 0, 0, 0, 'normal'))
            return newMoves
          }))
      )
    }
    return zip(returnArr)
  }

  //Gets a list of all the pokemon generations
  getGenerations(): Observable<string[]> {
    return this.http.get<String[]>(`${this.baseURL}/generation`).pipe(map((genList: any) => {
      return genList.results.map((gen: any) => {
        return gen.name
      })
    }))
  }

  //Gets a list of pokemon from a species.
  getPokemonFromSpecies(name: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseURL}/pokemon-species/${name}`).pipe(map((species: any) => {
      return species.varieties.map((variery: any) => {
        return variery.pokemon.name
      })
    }))
  }

  //Gets a list of pokemon from a generation
  getPokemonFromGeneration(gen: string): Observable<Pokemon[]> {
    return this.http.get(`${this.baseURL}/generation/${gen}`).pipe(
      map((pokeList: any) => {
        return pokeList.pokemon_species.map((listItem: any) => {
          return listItem.name
        })
      }),
      //Some pokemon have different variations for the species. Concats all of them into a single map
      concatMap((pokeList: string[]) => {
        return zip(
          pokeList.map(name => {
            return this.getPokemonFromSpecies(name)
          })
        )
      }),
      concatMap((pokeList: string[][]) => {
        let finalArr: string[] = []
        pokeList.forEach(item => {
          finalArr = finalArr.concat(item)
        })
        return of(finalArr)
      }),
      concatMap((pokeNames: string[]) => {
        return this.getManyByName(pokeNames)
      })
    )
  }



  //Gets all pokemon matching an environment string
  getEnv(name: string): Observable<Habitat> {
    return this.http.get<Habitat>(`${this.baseURL}/pokemon-habitat/${name}`).pipe(map((m: any) => {
      let pokeList = new Habitat();
      m.pokemon_species.forEach((pokemon_species: any) => {
        pokeList.pokemon_species?.push(pokemon_species.name)
      })
      return pokeList
    }))
  }


  //Gets all pokemon matching a type string
  filterByType(type: string) {
    return this.http.get(`${this.baseURL}/type/${type}`).pipe(map((item: any) => {
      let pokeList = new pokeTypeList();
      item.pokemon.forEach((pokemon: any) => {
        pokeList.pokemonOfType?.push(pokemon.pokemon.name);
      })
      return pokeList;
    }))


  }
  constructor(private http: HttpClient) { }
}
