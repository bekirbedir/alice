import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesComponent } from './activities/activities.component';
import {GalleriaModule} from 'primeng/galleria';
import { RouterModule, Routes } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import {TabMenuModule} from 'primeng/tabmenu';
import {ToastModule} from 'primeng/toast';
import {NgxImageCompressService} from 'ngx-image-compress';


const routes: Routes = [
  {
    path: '',
    component: ActivitiesComponent
  }
];

@NgModule({
  declarations: [ActivitiesComponent],
  imports: [
    CardModule,
    CommonModule,      
    RouterModule.forChild(routes),
    GalleriaModule,
    ButtonModule,
    TabMenuModule,
    ToastModule
  ],
  providers: [NgxImageCompressService],
})
export class ActivitiesModule { }
