import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
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

  loadNext(): void {
    this.router.navigate([''], { queryParams: { 'page': Number(this.pokePage?.currentPage) + 1 } })
    if (Math.ceil(this.pokePage!.total / 20) == this.pokePage!.currentPage + 1) {
      this.lastPage = true
    }
    this.changePage(this.pokePage!.currentPage + 1, this.pokePage!.limit)
  }
  loadPrev(): void {
    this.router.navigate([''], { queryParams: { 'page': Number(this.pokePage?.currentPage) - 1 } })
    this.lastPage = false
    this.changePage(this.pokePage!.currentPage - 1, this.pokePage!.limit)
  }

  changePage(page?: number, limit?: number): void {
    this.pokeSrv.getAll(page, limit).subscribe(page => {
      this.pokePage = page
      this.pokePage.pokemonList.forEach(p => {
        this.pokeSrv.getSprite(p.name).subscribe(img => {
          p.setImg(img)
        })
      })
    })

  }

  ngOnInit(): void {
    let page: string | null = this.route.snapshot.queryParamMap.get('page')
    if (page) {
      this.changePage(Number(page), 20)
    } else {
      this.changePage()
    }
  }


  constructor(public pokeSrv: PokemonService, private route: ActivatedRoute, private router: Router) { }
}
