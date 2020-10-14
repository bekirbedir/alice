import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/auth/login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  providers: [MessageService]
})
export class ForgotPasswordComponent implements OnInit {

  username:String;
  pCode:String;

  password:String;
  pUsername:String;
  newPassword:Boolean = false;

  constructor(private loginService:LoginService,
    private messageService: MessageService,
    private router: Router,
    private actRoute: ActivatedRoute) {

      this.actRoute.paramMap.subscribe(params => {
     
        if(params.get('code')){
          this.pCode = params.get('code');
          this.pUsername = params.get('username');
          this.newPassword= true;
        }
             
      });

   }

  ngOnInit(): void {
  }

  resetPasswordRequest(){
    if(this.username == null || this.username == ''){
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Geçerli bir veri giriniz' });
      return false;
    }
    
    this.loginService.resetPasswordRequest(this.username).subscribe(x=>{
      if(x.status){
        this.messageService.add({ key: 'tc', severity: x.toastType, summary: 'Hata', detail:x.message });
      }
    })
  }

  
  savePassword(){
    if(this.password == null || this.password == ''){
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Geçerli bir veri giriniz' });
      return false;
    }
    
    this.loginService.resetPasswordRequest(this.username).subscribe(x=>{
      if(x.status){
        this.messageService.add({ key: 'tc', severity: x.toastType, summary: 'Hata', detail:x.message });
      }
    })
  }

  

}
