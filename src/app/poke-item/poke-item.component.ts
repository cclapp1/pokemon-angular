import { TypeofExpr } from '@angular/compiler';
import { Component, Input } from '@angular/core';
import { Page, pokeModel } from '../models/pokeModel';

@Component({
  selector: 'app-poke-item',
  templateUrl: './poke-item.component.html',
  styleUrls: ['./poke-item.component.scss']
})
export class PokeItemComponent {
  @Input()
  pokemon!: pokeModel
  @Input()
  pokePage: Page | undefined
  @Input()
  i!: number

  type1Color: string | null = null
  type2Color: string | null = null

  ngOnInit(): void {
    this.type1Color = this.pokemon.types[0].color
    if (this.pokemon.types[1]?.color) this.type2Color = this.pokemon.types[1].color
    else this.type2Color = this.pokemon.types[0].color
  }

}
