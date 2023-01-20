import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { PageComponent } from './page/page.component';
import { PokeItemComponent } from './poke-item/poke-item.component';
import { SearchComponent } from './search/search.component';
import { FormsModule } from '@angular/forms';
import { MoveComponent } from './move/move.component';
import { DropdownPageComponent } from './dropdown-page/dropdown-page.component';
import { DetailComponent } from './detail/detail.component';
import { LoaderComponent } from './loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    DetailViewComponent,
    PageComponent,
    PokeItemComponent,
    SearchComponent,
    MoveComponent,
    DropdownPageComponent,
    DetailComponent,
    LoaderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
