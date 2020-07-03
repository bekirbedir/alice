import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesComponent } from './activities/activities.component';
import {GalleriaModule} from 'primeng/galleria';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: ActivitiesComponent
  }
];

@NgModule({
  declarations: [ActivitiesComponent],
  imports: [
    CommonModule,      
    RouterModule.forChild(routes),
    GalleriaModule
  ]
})
export class ActivitiesModule { }
