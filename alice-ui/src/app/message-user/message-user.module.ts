import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageUserComponent } from './message-user.component';
import { RouterModule, Routes } from '@angular/router';


import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
const routes: Routes = [
  {
    path: '',
    component: MessageUserComponent
  }
];

@NgModule({
  declarations: [MessageUserComponent],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild(routes)

  ],
  bootstrap:[]
})
export class MessageUserModule { }
