import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { RouterModule, Routes } from '@angular/router';
import {ListboxModule} from 'primeng/listbox';
import {ButtonModule} from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
const routes: Routes = [
  { 
    path: '',
    component: UsersComponent
  }
];

 


@NgModule({
  declarations: [UsersComponent],
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule,
    ListboxModule,
    CardModule,
    RouterModule.forChild(routes),
  ]
})
export class UsersModule { }
