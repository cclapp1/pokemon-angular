import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { DropdownPageComponent } from './dropdown-page/dropdown-page.component';
import { GenerationComponent } from './generation/generation.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
    pathMatch: 'full',
  },
  {
    path: 'details',
    component: DetailViewComponent
  },
  {
    path: 'dropdown',
    component: DropdownPageComponent
  },
  {
    path: 'generation',
    component: GenerationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
