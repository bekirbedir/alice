import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import {CardModule} from 'primeng/card';
import { LoginService } from 'src/app/auth/login.service';
import { IndexComponent } from 'src/app/index/index.component';
import { Router, ActivatedRoute  } from '@angular/router';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  userName: "";
  password: "";
  locale: "";
  version: string;
  msgs: any[];  
  approveUsername ="";
  approveCode= "";
  isApprove = false;
  isApproveOk = false;

  constructor(private loginservice:LoginService,private router:Router , private actRoute:ActivatedRoute , private messageService: MessageService ) { 
        
    this.actRoute.paramMap.subscribe(params => {
     
      if(params.get('code')){
        this.approveCode = params.get('code');
        this.approveUsername = params.get('username');
        this.isApprove= true;
        this.approve(this.approveCode,this.approveUsername);
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

  isValidate() {
    let isControl = true;
    if (this.userName == null || this.userName== "") {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Kullanıcı adı boş olamaz' });
      isControl = false;
    }
    if (this.password== null || this.password == "") {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Parola boş olamaz' });
      isControl = false;
    }

    return isControl;
  }


  onClickLogin() {

    if(this.isValidate()){
    this.loginservice.login(this.userName,this.password).subscribe(x=>{
       if(x.message == "success"){
        this.router.navigate(['/activities'])
       }else{
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Hata', detail: 'Kullanıcı adı ve şifre hatalı' });
       }
     
    })
  }
  }
  routeSignup(){
    this.router.navigate(['/signup'])
  }

  approve(code:String,username:String){
    this.loginservice.approve(code,username).subscribe(x=>{
      if(x.status){
        this.isApproveOk = true;
      }
    })
  }




}
