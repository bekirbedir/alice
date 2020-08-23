import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import {CardModule} from 'primeng/card';
import { LoginService } from 'src/app/auth/login.service';
import { IndexComponent } from 'src/app/index/index.component';
import { Router, ActivatedRoute  } from '@angular/router';

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
  approveUsername ="";
  approveCode= "";
  isApprovee = false;

  constructor(private loginservice:LoginService,private router:Router , private actRoute:ActivatedRoute  ) { 
      this.actRoute.paramMap.subscribe(params => {
     
      if(params.get('code')){
        this.approveCode = params.get('code');
        this.approveUsername = params.get('username');
        this.isApprovee= true;

      }
     
      
    });
    }

  ngOnInit() {

    this.userName=""
    this.password=""

  }

  ngOnDestroy(){
  window.location.reload()
  }

  onClickLogin() {
    console.log(this.userName, this.password);
    
    this.loginservice.login(this.userName,this.password).subscribe(x=>{
       if(x){
        console.log("loginden gelen",x)
        this.router.navigate(['/activities'])
       }
     
    })
 
  }
  routeSignup(){
    this.router.navigate(['/signup'])
  }




}
