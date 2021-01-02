import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityViewComponent } from './activity-view/activity-view.component';
import { RouterModule, Routes } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import {NgxImageCompressService} from 'ngx-image-compress';

const routes: Routes = [
  {
    path: '',
    component: ActivityViewComponent
  },
  {
    path: ':id',
    component: ActivityViewComponent
  },
];

@NgModule({
  declarations: [ActivityViewComponent],
  imports: [
    CardModule,
    CommonModule,     
    ToastModule, 
    RouterModule.forChild(routes),
    
  ],
  providers: [NgxImageCompressService],
})
export class ActivityViewModule { }
