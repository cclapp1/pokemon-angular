import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';
import { Page, Pokemon } from '../models/pokeModel';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent {
  currentPokemon: Pokemon | undefined
  returnPage: number = 1
  currentPage: Page | undefined
  lastPage: boolean = false
  currentPokemonNum!: number

  getPageOffset(): number {
    return (this.currentPage!.currentPage - 1) * this.currentPage!.limit
  }

  loadPage(pageNum: number, pokeOffset: number): void {
    this.pokeSrv.getAll(pageNum, 20).subscribe(pokePage => {
      this.currentPage = pokePage
      let foundPokemonIndex = this.currentPage.pokemonList.findIndex(pokeElem => {
        if (pokeElem.name == this.currentPokemon?.name) {
          return true
        }
        return false
      })
      this.currentPokemonNum = (foundPokemonIndex == -1) ? this.getPageOffset() + pokeOffset : foundPokemonIndex + 1 + this.getPageOffset()
      if (foundPokemonIndex == -1) {
        this.loadDetails(this.currentPage.pokemonList[pokeOffset - 1].name)
      }

      this.router.navigate(['details'], { queryParams: { 'prevPage': this.currentPage.currentPage, 'name': this.currentPage.pokemonList[this.currentPokemonNum - 1].name } })
    })
  }
  loadDetails(name: string): void {
    this.pokeSrv.getByName(name).subscribe(item => {
      this.currentPokemon = item
      this.router.navigate(['details'], { queryParams: { 'prevPage': this.currentPage!.currentPage, 'name': this.currentPokemon.name } })
    })
  }

  loadPrev(): void {
    if (this.lastPage && this.currentPokemonNum != this.currentPage?.total) this.lastPage = false

    if (this.currentPokemonNum - this.getPageOffset() == 1) {
      this.loadPage(this.currentPage!.currentPage - 1, 20)
    } else {
      this.loadDetails(this.currentPage!.pokemonList[((this.currentPokemonNum - 1) - this.getPageOffset()) - 1].name)
      this.currentPokemonNum--
    }
  }

  loadNext(): void {
    if (this.currentPokemonNum + 1 == this.currentPage?.total) {
      this.lastPage = true
    }

    if (this.currentPokemonNum - this.getPageOffset() == this.currentPage?.limit) {
      this.loadPage(this.currentPage.currentPage + 1, 1)
    } else {
      this.loadDetails(this.currentPage!.pokemonList[((this.currentPokemonNum + 1) - this.getPageOffset()) - 1].name)
      this.currentPokemonNum++
    }
  }

  ngOnInit(): void {
    let name = String(this.route.snapshot.queryParamMap.get('name'))
    this.loadDetails(name)

    let prevPage = this.route.snapshot.queryParamMap.get('prevPage')
    if (prevPage) this.returnPage = Number(prevPage)

    this.loadPage(Number(prevPage), 1)
  }

  constructor(private route: ActivatedRoute, private pokeSrv: PokemonService, private router: Router) { }

}
