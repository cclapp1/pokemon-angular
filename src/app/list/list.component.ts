import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Page } from '../models/pokeModel';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {

  pokePage: Page | undefined
  lastPage: boolean = false

  unsubscribe$: Subject<void> = new Subject<void>()

  countOpts: number[] = [10, 20, 30]
  selectPokemon: number = 20

  newSelection(event: any): void {
    this.selectPokemon = event
    this.changePage(this.pokePage?.currentPage, this.selectPokemon)
  }

  loadNext(): void {
    this.router.navigate([''], { queryParams: { 'page': Number(this.pokePage?.currentPage) + 1 } })
    if (Math.ceil(this.pokePage!.total / this.selectPokemon) == this.pokePage!.currentPage + 1) {
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
    this.route.queryParamMap.pipe(takeUntil(this.unsubscribe$)).subscribe(parms => {
      let page = parms.get('page')
      if (page) {
        this.changePage(Number(page), this.selectPokemon)
      } else {
        this.selectPokemon = 20
        this.changePage()
      }
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }


  constructor(public pokeSrv: PokemonService, private route: ActivatedRoute, private router: Router) { }
}
