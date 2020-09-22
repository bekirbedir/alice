import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityManagementComponent } from './activity-management/activity-management.component';
import {PanelModule} from 'primeng/panel';
import { RouterModule, Routes } from '@angular/router';
import {TabViewModule} from 'primeng/tabview';
import { ToastModule } from 'primeng/toast';
import {NgxImageCompressService} from 'ngx-image-compress';
import { ChipsModule } from 'primeng/chips';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { CardModule } from 'primeng/card';
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
    ToastModule,
    PanelModule,
    TabViewModule,
    InputTextModule,
    ChipsModule,
    InputTextareaModule,
    InputNumberModule,
    FormsModule,
    CalendarModule,
    CheckboxModule,
    CardModule,
    RouterModule.forChild(routes),
  ],
  providers: [NgxImageCompressService],
})
export class ActivityManagementModule { }
