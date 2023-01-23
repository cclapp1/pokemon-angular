import { Component } from '@angular/core';
import { Pokemon } from '../models/pokeModel';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-generation',
  templateUrl: './generation.component.html',
  styleUrls: ['./generation.component.scss']
})
export class GenerationComponent {
  generations: string[] = []
  pokeList: Pokemon[] = []
  selectedGeneration: string = ''

  isLoading: boolean = false

  onSelect(): void {
    this.isLoading = true
    this.pokeList = []
    this.pokeSrv.getPokemonFromGeneration(this.selectedGeneration).subscribe(genList => {
      this.isLoading = false
      this.pokeList = genList
    })
  }

  ngOnInit(): void {
    this.pokeSrv.getGenerations().subscribe(gens => {
      this.generations = gens
    })
  }

  constructor(private pokeSrv: PokemonService) { }
}
