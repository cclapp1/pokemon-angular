import { Component } from '@angular/core';
import { Pokemon, PokeType } from '../models/pokeModel';
import { PokemonService } from '../services/pokemon.service';
import { formatName, unFormatName } from '../models/pokeFunc';

@Component({
  selector: 'app-dropdown-page',
  templateUrl: './dropdown-page.component.html',
  styleUrls: ['./dropdown-page.component.scss']
})
export class DropdownPageComponent {
  //First dropdown vars
  types: PokeType[] = []
  selectedType: string = ''

  //Second dropdown vars
  pokemonListStr: string[] = []
  selectedPokemonStr: string = ''

  //vars for components
  selectedPokemon: Pokemon | undefined
  noSelectionStr: string = '---'
  isLoading: boolean = false

  ngOnInit(): void {
    this.pokeSrv.getAllTypes().subscribe(types => {
      this.types = types
    })
  }

  //Resets the module back to the beginning if the first dropdown is unselected
  resetVars(): void {
    this.isLoading = false
    this.selectedPokemon = undefined
    this.selectedPokemonStr = this.noSelectionStr
    this.pokemonListStr = []
  }

  //Called when the type dropdown is selected
  onTypeSelect(): void {
    if (this.selectedType == this.noSelectionStr) this.resetVars()

    this.pokeSrv.filterByType(this.selectedType.toLocaleLowerCase()).subscribe(pokeStrList => {
      this.pokemonListStr = pokeStrList.pokemonOfType!.map(pokemon => {
        return formatName(pokemon)
      })
    })
  }

  onPokemonSelect(): void {
    this.isLoading = true
    this.selectedPokemon = undefined
    //If nothing is selected reset the pokemon
    if (this.selectedPokemonStr === this.noSelectionStr) { this.selectedPokemon = undefined; this.isLoading = false }

    let unFormattedName = unFormatName(this.selectedPokemonStr)

    this.pokeSrv.getDetails(unFormattedName).subscribe(pokemon => {
      this.isLoading = false
      this.selectedPokemon = pokemon
    })
  }

  constructor(private pokeSrv: PokemonService) { }

}