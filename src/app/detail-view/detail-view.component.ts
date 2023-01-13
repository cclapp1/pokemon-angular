import { Component } from '@angular/core';
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

  ngOnInit(): void {
    let name = String(this.route.snapshot.paramMap.get('name'))
    this.pokeSrv.getByName(name).subscribe(item => { this.currentPokemon = item })
  }

  constructor(public route: ActivatedRoute, public pokeSrv: PokemonService) { }

}
