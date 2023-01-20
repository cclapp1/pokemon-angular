import { Component, Input } from '@angular/core';
import { Pokemon } from '../models/pokeModel';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {
  @Input() currentPokemon: Pokemon | undefined
}
