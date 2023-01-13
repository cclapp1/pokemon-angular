import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';
import { Pokemon } from '../models/pokeModel';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent {
  currentPokemon: Pokemon | undefined
  returnPage: number = 1

  ngOnInit(): void {
    let name = String(this.route.snapshot.queryParamMap.get('name'))
    this.pokeSrv.getByName(name).subscribe(item => { this.currentPokemon = item })

    let prevPage = this.route.snapshot.queryParamMap.get('prevPage')
    if (prevPage) this.returnPage = Number(prevPage)
  }

  constructor(private route: ActivatedRoute, private pokeSrv: PokemonService) { }

}
