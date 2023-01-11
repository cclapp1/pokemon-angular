import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';
import { Pokemon } from '../pokeModel';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss']
})
export class DetailViewComponent {
  currentPokemon: Pokemon | undefined

  ngOnInit(): void {
    let routeId = Number(this.route.snapshot.paramMap.get('id'))
    this.pokeSrv.getById(routeId).subscribe(p => this.currentPokemon = p)
  }

  constructor(public route: ActivatedRoute, public pokeSrv: PokemonService) { }

}
