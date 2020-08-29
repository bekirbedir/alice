import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/auth/user';
import { UserService } from 'src/app/users/user.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [MessageService]
})
export class SignupComponent implements OnInit {

  version: string;
  msgs: any[];
  checked: boolean = false;
  mailOnayBilgisi:Boolean = false;
  user: User
  constructor(private router: Router, private registerservice: UserService, private messageService: MessageService) {
    this.user = new User();
  }

  ngOnInit(): void {
  }
  routeLogin() {
    this.router.navigate(['/login'])
  }


  isValidate() {
    let isControl = true;
    if (this.user.username == null || this.user.username == "") {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Kullanıcı Adı Boş olamaz' });
      isControl = false;
    }
    if (this.user.password == null || this.user.password == "") {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Parola Boş olamaz' });
      isControl = false;
    }

    if (this.user.email == null || this.user.email == "") {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Email olamaz' });
      isControl = false;
    }
    if (this.user.biography == null || this.user.biography == "") {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Biyograf Alanı Boş olamaz' });
      isControl = false;
    }
    if (this.user.name == null || this.user.name == "") {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Ad Boş olamaz' });
      isControl = false;
    }
    if (this.user.phone == null || this.user.phone == "") {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Hata', detail: 'Telefon Numarası Boş olamaz' });
      isControl = false;
    }
    return isControl;
  }

  createNewUser() {
    if (this.isValidate()) {
      this.registerservice.creatUser(this.user).subscribe(x => {
        console.log(x);
        this.checked = false
        if(x._id){
          this.messageService.add({ key: 'tc', severity: 'warn', summary: 'Başarılı', detail: 'Kaydınız alındı. Mail adresinizi onaylayın lütfen' });
          this.mailOnayBilgisi = true;
          this.user = new User();
        }
    
      })
    }
  }
}
