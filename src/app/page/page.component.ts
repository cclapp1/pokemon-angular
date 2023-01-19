import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

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

  @Input() @HostBinding('style.--fontSize') fontSize = '20px'
  @Input() @HostBinding('style.--btnColor') btnColor = "rgb(44, 104, 164)"
  @Input() @HostBinding('style.--btnBorderColor') btnBorder = "green"

  @Output()
  nextClicked: EventEmitter<void> = new EventEmitter<void>
  @Output()
  prevClicked: EventEmitter<void> = new EventEmitter<void>
}
