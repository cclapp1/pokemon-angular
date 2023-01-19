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
  totalPages: number = 1
  unsubscribe$: Subject<void> = new Subject<void>()

  speciesChecked: boolean = false
  habitatChecked: boolean = false
  isSearch: boolean = false
  query: string = ''


  loadNext(): void {
    this.router.navigate([''], { queryParams: { 'page': Number(this.pokePage?.currentPage) + 1 } })
  }
  loadPrev(): void {
    this.router.navigate([''], { queryParams: { 'page': Number(this.pokePage?.currentPage) - 1 } })
  }

  changePage(page?: number, limit?: number): void {
    this.pokeSrv.getAll(page, limit).subscribe(page => {
      this.pokePage = page
      this.totalPages = Math.ceil(page.total / page.limit)
    })
  }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntil(this.unsubscribe$)).subscribe(parms => {
      let page = parms.get('page')
      if (page) {
        this.changePage(Number(page), 20)
      } else {
        this.changePage()
      }
    })
  }

  //Method called when the submit button for the search bar is clicked
  search(): void {
    //Search case for the species
    if (!this.habitatChecked && this.speciesChecked) {
      this.isSearch = true
      this.totalPages = 1
      this.pokeSrv.filterByType(this.query).pipe(concatMap(list => {
        return this.pokeSrv.getManyByName(list.pokemonOfType!)
      })).subscribe(finalList => {
        this.pokePage = new Page(1, finalList.length, finalList.length, finalList)
      })
    }

    //Search case for the habitat
    if (!this.speciesChecked && this.habitatChecked) {
      this.isSearch = true
      this.pokeSrv.getEnv(this.query).pipe(concatMap(list => {
        return this.pokeSrv.getManyByName(list.pokemon_species)
      })).subscribe(finalList => {
        this.pokePage = new Page(1, finalList.length, finalList.length, finalList)
      })
    }

  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }

  //Methods below called when the search buttons are clicked so that only one button is visually selected at a time
  typeClick(): void {
    if (this.habitatChecked) {
      this.habitatChecked = false
    }
  }

  habitatClick(): void {
    if (this.speciesChecked) {
      this.speciesChecked = false
    }
  }


  constructor(public pokeSrv: PokemonService, private route: ActivatedRoute, private router: Router) { }
}
