import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunicationComponent } from './communication/communication.component';
import { FormsModule } from '@angular/forms';

import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {RadioButtonModule} from 'primeng/radiobutton';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {TabViewModule} from 'primeng/tabview';
import { EditorModule } from 'primeng/editor';
import { RouterModule, Routes } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';

const routes: Routes = [
  { 
    path: '',
    component: CommunicationComponent
  }
];

@NgModule({
  declarations: [CommunicationComponent],
  imports: [
    ToastModule,
    CommonModule,
    InputTextModule,
		CheckboxModule,
		ButtonModule,
		RadioButtonModule,
    InputTextareaModule,
    EditorModule, 
    DropdownModule,
    TabViewModule,
    FormsModule,
    CardModule,
 
    RouterModule.forChild(routes),
  ]
})
export class CommunicationModule { }
