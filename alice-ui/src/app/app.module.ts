import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {NgxsModule} from '@ngxs/store';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {NgxsLoggerPluginModule} from '@ngxs/logger-plugin';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {IndexComponent} from '../app/index/index.component'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MessageModule } from 'primeng/message';
import { TabMenuModule } from 'primeng/tabmenu';
import {GMapModule} from 'primeng/gmap';
import {MenubarModule} from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptor } from './auth/jwt.interceptor';
import { ErrorInterceptor } from './auth/error.interceptor';
import { LoginService } from './auth/login.service';
import { FriendState } from './store/states/friend.state';
import { ActivityState } from './store/states/activity.state';
import { AuthGuard } from './auth/auth.guard';



@NgModule({
  declarations: [
    AppComponent,
    IndexComponent
  ], 
  imports: [
    BrowserModule,
    NgxsModule.forRoot([ActivityState,FriendState]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,  
    MatTooltipModule,
    MatMenuModule,
    MatButtonModule,
    FlexLayoutModule,
    HttpClientModule,
    MatIconModule,
    MessageModule,
    TabMenuModule,
    GMapModule,
    MenubarModule,
    InputTextModule,
    ButtonModule
  ],
  providers: [  AuthGuard,LoginService,{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
              { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
