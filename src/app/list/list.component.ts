import { Component, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, debounceTime, distinctUntilChanged, map, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { Page, pokeModel, PokeType, Habitat } from '../models/pokeModel';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {

  pokePage: Page | undefined
  lastPage: boolean = false
  PokeHabitat: Habitat | undefined
  unsubscribe$: Subject<void> = new Subject<void>()

  getHabitat(name: string): void {
    let search = this.pokeSrv.getEnv(name).subscribe(PokeHabitat => { this.PokeHabitat = PokeHabitat })
    console.log(search)
  }

  searchResults$!: Observable<string>
  private searchTerms = new Subject<string>();
  speciesChecked: boolean = false
  habitatChecked: boolean = false


  loadNext(): void {
    this.router.navigate([''], { queryParams: { 'page': Number(this.pokePage?.currentPage) + 1 } })
    if (Math.ceil(this.pokePage!.total / 20) == this.pokePage!.currentPage + 1) {
      this.lastPage = true
    }
  }
  loadPrev(): void {
    this.router.navigate([''], { queryParams: { 'page': Number(this.pokePage?.currentPage) - 1 } })
    this.lastPage = false
  }

  changePage(page?: number, limit?: number): void {
    this.pokeSrv.getAll(page, limit).subscribe(page => {
      this.pokePage = page
    })
  }

  ngOnInit(): void {

    this.getHabitat("cave");



    this.route.queryParamMap.pipe(takeUntil(this.unsubscribe$)).subscribe(parms => {
      let page = parms.get('page')
      if (page) {
        this.changePage(Number(page), 20)
      } else {
        this.changePage()
      }
    })

    this.searchResults$ = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map((term: string) => {
        return term
      })
    )

    this.searchResults$.subscribe((item: string) => {
      if (this.speciesChecked && !this.habitatChecked) {
        console.log('called specied');
        this.pokeSrv.filterByType(item).pipe(concatMap(list => {
          return this.pokeSrv.getManyByNameString(list.pokemonOfType!).pipe(map((pokelist: any) => {
            return pokelist.map((item: any) => {
              return new pokeModel(item.name, item.image[0], item.types)
            })
          }))
        })).subscribe(finalList => {
          this.pokePage = new Page(1, finalList.length, finalList.length, finalList)
        })
      }
      if (this.habitatChecked && !this.speciesChecked) {
        console.log('called habitat');
        this.pokeSrv.getEnv(item).pipe(concatMap(list => {
          return this.pokeSrv.getManyByNameString(list.pokemon_species).pipe(map((pokelist: any) => {
            return pokelist.map((item: any) => {
              return new pokeModel(item.name, item.image[0], item.types)
            })
          }))
        })).subscribe(finalList => {
          this.pokePage = new Page(1, finalList.length, finalList.length, finalList)
        })
      }
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  search(term: string): void {
    this.searchTerms.next(term)
  }


  constructor(public pokeSrv: PokemonService, private route: ActivatedRoute, private router: Router) { }
}
