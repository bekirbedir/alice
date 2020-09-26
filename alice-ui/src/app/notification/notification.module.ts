import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { RouterModule, Routes } from '@angular/router';
import { CardModule } from 'primeng/card';


const routes: Routes = [
  {
    path: '',
    component: NotificationComponent
  }
];


@NgModule({
  declarations: [NotificationComponent],
  imports: [
    CommonModule,
    CardModule,
      RouterModule.forChild(routes),
  ]
})
export class NotificationModule { }
