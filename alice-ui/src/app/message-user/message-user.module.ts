import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageUserComponent } from './message-user.component';
import { RouterModule, Routes } from '@angular/router';

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgChatModule } from 'ng-chat';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { HttpClientModule } from '@angular/common/http';
const routes: Routes = [
  {
    path: '',
    component: MessageUserComponent
  }
];
const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    NgChatModule,
    SocketIoModule.forRoot(config), 
    RouterModule.forChild(routes)

  ],
  bootstrap:[]
})
export class MessageUserModule { }
