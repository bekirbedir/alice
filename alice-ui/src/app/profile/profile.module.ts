import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { CardModule } from 'primeng/card';
import { RouterModule, Routes } from '@angular/router';
import {NgxImageCompressService} from 'ngx-image-compress';
import {ProgressBarModule} from 'primeng/progressbar';
import {ChipsModule} from 'primeng/chips';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import {ProgressSpinnerModule} from 'primeng/progressspinner';

import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import {InputMaskModule} from 'primeng/inputmask';
import {FileUploadModule} from 'primeng/fileupload';

import { InputTextModule } from 'primeng/inputtext';
import {DialogModule} from 'primeng/dialog';
const routes: Routes = [
  { 
    path: '',
    component: ProfileComponent
  },
  {
    path: ':id',
    component: ProfileComponent
  },
];


@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    CardModule,
    ProgressBarModule,
    ChipsModule,
    MessagesModule,
    ToastModule,
    ProgressSpinnerModule,
    InputTextareaModule,
        MessagesModule,
        InputMaskModule,
        ChipsModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        FileUploadModule,
        DialogModule,
         RouterModule.forChild(routes),
  ],
  providers: [NgxImageCompressService],
})
export class ProfileModule { }
