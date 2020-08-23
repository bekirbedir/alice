import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityManagementComponent } from './activity-management/activity-management.component';
import {PanelModule} from 'primeng/panel';
import { RouterModule, Routes } from '@angular/router';
import {TabViewModule} from 'primeng/tabview';

const routes: Routes = [
  {
    path: '',
    component: ActivityManagementComponent
  }
];

@NgModule({
  declarations: [ActivityManagementComponent],
  imports: [
    CommonModule,
    PanelModule,
    TabViewModule,
    RouterModule.forChild(routes),
  ]
})
export class ActivityManagementModule { }
