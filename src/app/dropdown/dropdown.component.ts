import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {
  @Output() selectedOption: string = ''
  @Output() onSelect: EventEmitter<void> = new EventEmitter<void>
  @Input() items: string[] = []
}
