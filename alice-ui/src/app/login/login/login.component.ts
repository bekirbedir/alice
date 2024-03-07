import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import {CardModule} from 'primeng/card';
import { LoginService } from 'src/app/auth/login.service';
import { IndexComponent } from 'src/app/index/index.component';
import { Router, ActivatedRoute  } from '@angular/router';
import {MessageService} from 'primeng/api';
import {User} from 'src/app/auth/user';

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
  randomUsers: User[]

  constructor(private loginservice:LoginService,private router:Router , 
    private actRoute:ActivatedRoute , private messageService: MessageService ) { 
        
    this.actRoute.paramMap.subscribe(params => { 
      if(params.get('code')){
        this.approveCode = params.get('code');
        this.approveUsername = params.get('username');
        this.isApprove= true;
        this.approve(this.approveCode,this.approveUsername);
      }});
    }

  ngOnInit() {
    if (localStorage.getItem('aliceuser')) {
      this.router.navigate(['/activities'])
    }

    this.userName=""
    this.password=""
    // this.getRandomUsers();
  }

  ngOnDestroy(){
    window.location.reload();
  }

  getRandomUsers() {
    this.loginservice.getRandomUsers().subscribe((x) => {
      this.randomUsers = x;
    });
   }

   photoLinkCreate(link){
    if(link == null || link == "")
      link = "static/uploads/profile/empty_profile128.png";

    return environment.apiBaseUrl +link
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
       if(x != null){
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
  routeResetPassword(){
    this.router.navigate(['/reset-password'])
  }

  approve(code:String,username:String){
    this.loginservice.approve(code,username).subscribe(x=>{
      if(x.status){
        this.isApproveOk = true;
      }
    })
  }




}
