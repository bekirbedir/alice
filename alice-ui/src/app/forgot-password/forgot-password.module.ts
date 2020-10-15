import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RouterModule, Routes } from '@angular/router';
import {InputMaskModule} from 'primeng/inputmask';
import { CardModule } from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';

const routes: Routes = [
  { 
    path: '',
    component: ForgotPasswordComponent

  },
  
  {
    path: ':code/:username',
    component: ForgotPasswordComponent
  },
];

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CardModule,
    CommonModule,
    InputMaskModule,
    FormsModule,
    MessagesModule,
    ToastModule,
    InputTextModule,
    RouterModule.forChild(routes)
  ]
})
export class ForgotPasswordModule { }
