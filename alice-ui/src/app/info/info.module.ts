import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './info/info.component';
import { CardModule } from 'primeng/card';
import { RouterModule, Routes } from '@angular/router';
import { GalleriaModule } from 'primeng/galleria';


const routes: Routes = [
  { 
    path: '',
    component: InfoComponent
  }
];

@NgModule({
  declarations: [InfoComponent],
  imports: [
    CommonModule,
    CardModule,
    GalleriaModule,
    RouterModule.forChild(routes)
  ]
})
export class InfoModule { }
