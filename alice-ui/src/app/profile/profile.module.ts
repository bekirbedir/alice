import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { CardModule } from 'primeng/card';
import { RouterModule, Routes } from '@angular/router';
import {NgxImageCompressService} from 'ngx-image-compress';

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
    RouterModule.forChild(routes),

  ],
  providers: [NgxImageCompressService],
})
export class ProfileModule { }
