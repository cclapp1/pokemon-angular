import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailViewComponent } from './detail-view/detail-view.component';
import { DetailsComponent } from './details/details.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: 'detail',
    component: DetailsComponent,
    children: [{
      path: ':id',
      component: DetailViewComponent
    }]
  },
  {
    path: '',
    component: ListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
