import { Component, HostBinding, Input } from '@angular/core';
import { ActivatedRoute, Router, TitleStrategy } from '@angular/router';
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

  pageCnt: number = 20

  @HostBinding('style.--type1') type1: string = ''
  @HostBinding('style.--type2') type2: string = ''

  //Caluclates the offset of the pokemon for lookup purposes
  getPageOffset(): number {
    if (this.currentPage)
      return (this.currentPage.currentPage - 1) * this.currentPage.limit
    return 0
  }

  loadPrev(): void {
    //Check to see if this pokemon details is the last one
    if (this.lastPage && this.currentPokemonNum != this.currentPage?.total) this.lastPage = false

    //Checks to see if the page needs to be changed (1st case), advances the pokemon (else)
    if (this.currentPokemonNum - this.getPageOffset() == 1) this.router.navigate(['details'], { queryParams: { 'page': Number(this.currentPage!.currentPage - 1), 'pokeNum': this.pageCnt } })
    else this.router.navigate(['details'], { queryParams: { 'page': Number(this.currentPage!.currentPage), 'pokeNum': Number(this.currentPokemonNum) - 1 } })

  }

  loadNext(): void {
    if (this.currentPokemonNum + 1 == this.currentPage?.total) {
      this.lastPage = true
    }

    //Same logic as above method, just for loading next instead of previous
    if (this.currentPokemonNum - this.getPageOffset() == this.currentPage?.limit) {
      this.router.navigate(['details'], { queryParams: { 'page': Number(this.currentPage!.currentPage + 1), 'pokeNum': 1 } })
    } else this.router.navigate(['details'], { queryParams: { 'page': Number(this.currentPage!.currentPage), 'pokeNum': Number(this.currentPokemonNum) + 1 } })
  }

  //Loads the page based on what is inside the currentPage locally or the query string
  loadPage(query: any, pageCnt: number): Observable<any> {
    return this.pokeSrv.getAll(this.currentPage?.currentPage, pageCnt || this.pageCnt).pipe(map(p => {
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
    this.route.queryParamMap.pipe(
      takeUntil(this.unsubscibe$),
      concatMap((query: any) => this.loadPage(query, query.get('pageCnt'))),
      concatMap((query: any) => this.loadPokemon(query))
    ).subscribe((query: any) => {
      this.currentPage = query.page
      this.currentPokemon = query.pokemon
      this.currentPokemonNum = Number(query.get('pokeNum'))

      //Loads the query for page
      let pageCnt: string = query.get('pageCnt')
      if (pageCnt) {
        this.pageCnt = Number(pageCnt)
      }

      //Binds css to the colors for the type
      this.type1 = this.currentPokemon?.types[0].darkColor || 'red'
      this.type2 = this.currentPokemon?.types[1]?.darkColor || 'red'
    })
  }

  formatName(input: string): string {
    return input.substring(0, 1).toUpperCase() + input.substring(1, input.length)
  }

  ngOnDestroy(): void {
    this.unsubscibe$.next()
    this.unsubscibe$.complete()
  }

  constructor(private route: ActivatedRoute, private pokeSrv: PokemonService, private router: Router) { }

}
