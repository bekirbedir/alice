import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import {CardModule} from 'primeng/card';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LoginComponent implements OnInit {

  userName: "";
  password: "";

  locale: "";

  version: string;

  msgs: any[];

  constructor(
   
  ) { }

  ngOnInit() {
    this.userName = "";
    this.password = "";
  //  this.locale = this.sessionService.getItem("ng-prime-language");
  //  this.version = environment.version;
 //   this.msgs = [{ severity: 'info', detail: 'UserName: admin' }, { severity: 'info', detail: 'Password: password' }];
  }

  onClickLogin() {
    console.log(this.userName+ this.password);
 /*  let user: User = this.userService.getUserByUserNameAndPassword(this.userName, this.password);
    if (user) {
      this.userContextService.setUser(user);
      this.routeStateService.add("Dashboard", '/main/dashboard', null, true);
      return;
    }
    this.toastService.addSingle('error', '', 'Invalid user.');*/
    return; 
  }



}
