import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListComponent } from './list/list.component';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { PageComponent } from './page/page.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    DetailViewComponent,
    PageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
