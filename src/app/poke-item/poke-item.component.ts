import { Component, Input } from '@angular/core';
import { Pokemon } from '../models/pokeModel';

@Component({
  selector: 'app-poke-item',
  templateUrl: './poke-item.component.html',
  styleUrls: ['./poke-item.component.scss']
})
export class PokeItemComponent {
  @Input()
  pokemon!: Pokemon
  @Input()
  i!: number

  type1Color: string | null = null
  type2Color: string | null = null

  type1Dark: string | null = null
  type2Dark: string | null = null

  mainImage!: string

  ngOnInit(): void {
    this.type1Color = this.pokemon.types[0].color
    if (this.pokemon.types[1]?.color) this.type2Color = this.pokemon.types[1].color
    else this.type2Color = this.pokemon.types[0].color

    this.type1Dark = this.pokemon.types[0].darkColor
    if (this.pokemon.types[1]?.darkColor) this.type2Dark = this.pokemon.types[1].darkColor
    else this.type2Dark = this.pokemon.types[0].darkColor


    this.mainImage = this.pokemon.image[0]
  }

  imgHover(): void {
    this.mainImage = this.pokemon.image[1]
  }

  imgUnhover(): void {
    this.mainImage = this.pokemon.image[0]
  }

}
