import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityManagementComponent } from './activity-management/activity-management.component';
import {PanelModule} from 'primeng/panel';
import { RouterModule, Routes } from '@angular/router';
import {TabViewModule} from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';



const routes: Routes = [
  {
    path: '',
    component: ActivityManagementComponent
  }
];

@NgModule({
  declarations: [ActivityManagementComponent],
  imports: [
    ToastModule,
    CommonModule,
    PanelModule,
    TabViewModule,
    RouterModule.forChild(routes),
  ]
})
export class ActivityManagementModule { }
