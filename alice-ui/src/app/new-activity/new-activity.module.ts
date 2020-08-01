import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewActivyComponent } from './new-activy/new-activy.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { MegaMenuModule } from 'primeng/megamenu';

import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CalendarModule } from 'primeng/calendar';
import { SidebarModule } from 'primeng/sidebar';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessagesModule } from 'primeng/messages';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CheckboxModule } from 'primeng/checkbox';
import {InputNumberModule} from 'primeng/inputnumber';


const routes: Routes = [
  {
    path: '',
    component: NewActivyComponent
  }
];

@NgModule({
  declarations: [NewActivyComponent],
  imports: [
    CommonModule,
    InputTextModule,
        ButtonModule,
        FormsModule,
        PanelModule,
        ToastModule,
        MegaMenuModule,
         MessageModule,
        CardModule,
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
        RouterModule.forChild(routes),
  ]
})
export class NewActivityModule { }
