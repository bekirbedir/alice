import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import {CardModule} from 'primeng/card';
import { LoginService } from 'src/app/auth/login.service';

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

  constructor(private loginservice:LoginService
  ) { 

  }

  ngOnInit() {
  
  this.userName=""
  this.password=""

  }

  onClickLogin() {
    console.log(this.userName, this.password);
    
    this.loginservice.login(this.userName,this.password).subscribe(x=>{
      console.log(x)
    })


   
  }



}
