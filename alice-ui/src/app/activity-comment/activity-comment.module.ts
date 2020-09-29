import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityCommentComponent } from './activity-comment/activity-comment.component';
import { RouterModule, Routes } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';


import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { MegaMenuModule } from 'primeng/megamenu';

import { MessageModule } from 'primeng/message';

import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CalendarModule } from 'primeng/calendar';
import { SidebarModule } from 'primeng/sidebar';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

import { MessagesModule } from 'primeng/messages';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { CheckboxModule } from 'primeng/checkbox';
import {InputNumberModule} from 'primeng/inputnumber';
import {ChipsModule} from 'primeng/chips';
import { dateToLocalStr } from '../pipes/pipe';

import { ScrollPanelModule } from 'primeng/scrollpanel';

const routes: Routes = [
  {
    path: '',
    component: ActivityCommentComponent
  }
];

@NgModule({
  declarations: [ActivityCommentComponent,dateToLocalStr],
  imports: [
    CommonModule,
    CardModule,     
    InputTextareaModule,
    InputTextModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    PanelModule,
    ToastModule,
    MegaMenuModule,
     MessageModule,
    CardModule,
    ChipsModule,
    CheckboxModule,
    ProgressSpinnerModule,
    OverlayPanelModule,
    BreadcrumbModule,
    CalendarModule,
    SidebarModule,
    DynamicDialogModule,
    InputTextareaModule,
    MessagesModule,
    InputNumberModule,
    ScrollPanelModule,
    RouterModule.forChild(routes),
  ]
})
export class ActivityCommentModule { }
