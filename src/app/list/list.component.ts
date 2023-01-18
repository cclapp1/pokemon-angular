import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Page, Habitat } from '../models/pokeModel';
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
    let search = this.pokeSrv.getEnv(name).subscribe(PokeHabitat => {this.PokeHabitat = PokeHabitat})
    console.log(search)
  }

  search(term: string): void {
    this.getHabitat(term);
  }

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
    
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next()
    this.unsubscribe$.complete()
  }


  constructor(public pokeSrv: PokemonService, private route: ActivatedRoute, private router: Router) { }
}
