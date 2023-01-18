import { Component, Input, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap } from 'rxjs';
import { pokeModel, PokeType } from '../models/pokeModel';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchTerm$: Subject<string> = new Subject<string>()

  @Input()
  searchObv$!: Subject<string>


  search(term: string): void {
    this.searchTerm$.next(term)
  }

  ngOnInit(): void {
    this.searchObv$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(item => {
      console.log('called');

      this.searchObv$.next('hellooo')
    })

  }
}
