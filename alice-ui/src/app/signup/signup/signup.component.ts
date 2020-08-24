import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/auth/user';
import { UserService } from 'src/app/users/user.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [MessageService]
})
export class SignupComponent implements OnInit {
  username: "";
  password: "";
  email: "";
  bio = "";
  name = "";
  version: string;
  msgs: any[];  
  checked: boolean = false;
  user:User
  constructor(private router:Router,private registerservice:UserService,private messageService: MessageService) {
    this.user=new User();
   }

  ngOnInit(): void {
  }
  routeLogin(){
    this.router.navigate(['/login'])
  }


 

  createNewUser(){
    console.log(this.user,"eklenmek isteniyoru...")

    this.registerservice.creatUser(this.user).subscribe(x=>{
      this.checked=false
      this.user=new User();
      this.messageService.add({key: 'tc', severity:'success', summary: 'Başarılı', detail:'Kaydınız alındı. Email doğrulaması yapınız'});
    })
  }
}
