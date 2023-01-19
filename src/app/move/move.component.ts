import { Component, HostBinding, Input } from '@angular/core';
import { Move } from '../models/pokeModel';

@Component({
  selector: 'app-move',
  templateUrl: './move.component.html',
  styleUrls: ['./move.component.scss']
})
export class MoveComponent {
  @Input()
  moves!: Move[]

  //Stores the current move
  move!: Move
  //Index used to help with the buttons
  moveIndex: number = 0

  @HostBinding('style.--typeColor') typeColor!: string

  //Called on next button press
  loadNext(): void {
    this.moveIndex++
    //Checks to see if this is the last move
    if (this.moveIndex + 1 == this.moves.length) {
      //this.lastPage = true
    }
    this.move = this.moves[this.moveIndex]
    this.typeColor = this.moves[this.moveIndex].type.darkColor
  }

  //Called on prev button press
  loadPrev(): void {
    this.moveIndex--
    //this.lastPage = false
    this.move = this.moves[this.moveIndex]
    this.typeColor = this.moves[this.moveIndex].type.darkColor
  }


  ngOnInit(): void {
    this.move = this.moves![0]
    this.typeColor = this.moves[this.moveIndex].type.darkColor
  }
}
