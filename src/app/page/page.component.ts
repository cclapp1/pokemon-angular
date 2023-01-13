import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent {
  @Input()
  currentPage!: Number
  @Input()
  lastPage!: boolean

  @Output()
  nextClicked: EventEmitter<void> = new EventEmitter<void>
  @Output()
  prevClicked: EventEmitter<void> = new EventEmitter<void>


}
