import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { RouterModule, Routes } from '@angular/router';
import {ListboxModule} from 'primeng/listbox';
import {ButtonModule} from 'primeng/button';
import { FormsModule } from '@angular/forms';
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
    RouterModule.forChild(routes),
  ]
})
export class UsersModule { }
