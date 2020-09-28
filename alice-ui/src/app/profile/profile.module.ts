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

const routes: Routes = [
  { 
    path: '',
    component: ProfileComponent
  }
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
    RouterModule.forChild(routes),
  ],
  providers: [NgxImageCompressService],
})
export class ProfileModule { }
