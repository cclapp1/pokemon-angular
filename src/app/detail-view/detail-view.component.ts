import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';
import { Page, Pokemon } from '../models/pokeModel';
import { concatMap, map, Observable, Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent {
  currentPokemon: Pokemon | undefined
  currentPage: Page | undefined
  lastPage: boolean = false
  currentPokemonNum!: number

  unsubscibe$: Subject<void> = new Subject<void>()

  //Caluclates the offset of the pokemon for lookup purposes
  getPageOffset(): number {
    return (this.currentPage!.currentPage - 1) * this.currentPage!.limit
  }

  loadPrev(): void {
    //Check to see if this pokemon details is the last one
    if (this.lastPage && this.currentPokemonNum != this.currentPage?.total) this.lastPage = false

    //Checks to see if the page needs to be changed (1st case), advances the pokemon (else)
    if (this.currentPokemonNum - this.getPageOffset() == 1) this.router.navigate(['details'], { queryParams: { 'prevPage': Number(this.currentPage!.currentPage - 1), 'pokeNum': 20 } })
    else this.router.navigate(['details'], { queryParams: { 'prevPage': Number(this.currentPage!.currentPage), 'pokeNum': Number(this.currentPokemonNum) - 1 } })

  }

  loadNext(): void {
    if (this.currentPokemonNum + 1 == this.currentPage?.total) {
      this.lastPage = true
    }

    //Same logic as above method, just for loading next instead of previous
    if (this.currentPokemonNum - this.getPageOffset() == this.currentPage?.limit) {
      this.router.navigate(['details'], { queryParams: { 'prevPage': Number(this.currentPage!.currentPage + 1), 'pokeNum': 1 } })
    } else this.router.navigate(['details'], { queryParams: { 'prevPage': Number(this.currentPage!.currentPage), 'pokeNum': Number(this.currentPokemonNum) + 1 } })
  }

  //Loads the page based on what is inside the currentPage locally or the query string
  loadPage(query: any): Observable<any> {
    let prevPage = query.get('prevPage')
    let pageFetch: number = this.currentPage?.currentPage || 1

    if (Number(prevPage) != this.currentPage?.currentPage) pageFetch = Number(prevPage)

    return this.pokeSrv.getAll(pageFetch, 20).pipe(map(p => {
      query.page = p
      return query
    }))
  }

  //Loads the pokemon from the query string
  loadPokemon(query: any): Observable<any> {
    let pokeNum = query.get('pokeNum') || 1
    return this.pokeSrv.getByName(query.page.pokemonList[pokeNum - 1].name).pipe(map(pokemon => {
      query.pokemon = pokemon
      return query
    }))
  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(
      takeUntil(this.unsubscibe$),
      concatMap((query: any) => this.loadPage(query)),
      concatMap((query: any) => this.loadPokemon(query))
    ).subscribe((query: any) => {
      this.currentPage = query.page
      this.currentPokemon = query.pokemon
      this.currentPokemonNum = Number(query.get('pokeNum'))

      //Formats the move so that the - is removed and words are capitalised
      this.currentPokemon?.moves.forEach(move => {
        move.name = move.name.split('-').map(str => {
          return str.substring(0, 1).toUpperCase() + str.substring(1, str.length)
        }).join('-').replaceAll('-', ' ')
      })
    })
  }

  ngOnDestroy(): void {
    this.unsubscibe$.next()
    this.unsubscibe$.complete()
  }

  constructor(private route: ActivatedRoute, private pokeSrv: PokemonService, private router: Router) { }

}
