import { Component, HostBinding, Input } from '@angular/core';
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
  totalPages!: number
  currentPokemonNum!: number

  unsubscibe$: Subject<void> = new Subject<void>()

  isLoading: boolean = false

  @HostBinding('style.--type1') type1: string = ''
  @HostBinding('style.--type2') type2: string = ''

  //Caluclates the offset of the pokemon for lookup purposes
  getPageOffset(): number {
    if (this.currentPage)
      return (this.currentPage.currentPage - 1) * this.currentPage.limit
    return 0
  }

  loadPrev(): void {
    this.isLoading = true
    //Checks to see if the page needs to be changed (1st case), advances the pokemon (else)
    if (this.currentPokemonNum - this.getPageOffset() == 1) this.router.navigate(['details'], { queryParams: { 'page': Number(this.currentPage!.currentPage - 1), 'pokeNum': 20 } })
    else this.router.navigate(['details'], { queryParams: { 'page': Number(this.currentPage!.currentPage), 'pokeNum': Number(this.currentPokemonNum) - 1 } })

  }

  loadNext(): void {
    this.isLoading = true
    //Same logic as above method, just for loading next instead of previous
    if (this.currentPokemonNum - this.getPageOffset() == this.currentPage?.limit) {
      this.router.navigate(['details'], { queryParams: { 'page': Number(this.currentPage!.currentPage + 1), 'pokeNum': 1 } })
    } else this.router.navigate(['details'], { queryParams: { 'page': Number(this.currentPage!.currentPage), 'pokeNum': Number(this.currentPokemonNum) + 1 } })
  }

  //Loads the page based on what is inside the currentPage locally or the query string
  loadPage(query: any): Observable<any> {
    let page = query.get('page')
    let pageFetch: number = this.currentPage?.currentPage || 1

    if (Number(page) != this.currentPage?.currentPage) pageFetch = Number(page)

    return this.pokeSrv.getAll(pageFetch, 20).pipe(map(p => {
      query.page = p
      return query
    }))
  }

  //Loads the pokemon from the query string
  loadPokemon(query: any): Observable<any> {
    let pokeNum = query.get('pokeNum') || 1
    return this.pokeSrv.getDetails(query.page.pokemonList[pokeNum - 1].name).pipe(map(pokemon => {
      query.pokemon = pokemon
      return query
    }))
  }

  ngOnInit(): void {
    this.isLoading = true
    //Checks to see if this is a result from searching for pokemon
    if (this.route.snapshot.queryParamMap.get('searchResult') == 'true') {
      this.totalPages = 1
      this.pokeSrv.getDetails(this.route.snapshot.queryParamMap.get('name')!).subscribe(pokemon => {
        this.isLoading = false
        this.currentPokemon = pokemon
      })
    } else {
      this.route.queryParamMap.pipe(
        takeUntil(this.unsubscibe$),
        concatMap((query: any) => this.loadPage(query)),
        concatMap((query: any) => this.loadPokemon(query))
      ).subscribe((query: any) => {
        this.isLoading = false
        this.currentPage = query.page
        this.currentPokemon = query.pokemon
        this.currentPokemonNum = Number(query.get('pokeNum'))

        //Binds css to the colors for the type
        this.type1 = this.currentPokemon?.types[0].darkColor || 'red'
        this.type2 = this.currentPokemon?.types[1]?.darkColor || 'red'
      })
    }
  }

  ngOnDestroy(): void {
    this.unsubscibe$.next()
    this.unsubscibe$.complete()
  }

  constructor(private route: ActivatedRoute, private pokeSrv: PokemonService, private router: Router) { }

}
