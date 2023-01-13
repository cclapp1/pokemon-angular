import { Component } from '@angular/core';
import { pokeModel } from '../models/pokeModel';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {

  pokeList: pokeModel[] = []

  ngOnInit(): void {
    this.pokeSrv.getAll().subscribe(list => {
      this.pokeList = list
      this.pokeList.forEach(p => {
        this.pokeSrv.getSprite(p.name).subscribe(img => {
          p.setImg(img)
        })
      })
    })
  }


  constructor(public pokeSrv: PokemonService) { }
}
