import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/auth/user';
import { UserService } from 'src/app/users/user.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-sendInfo',
  templateUrl: './sendInfo.component.html',
  styleUrls: ['./sendInfo.component.css'],
  providers: [MessageService]
})
export class SendInfoComponent implements OnInit {
  username: "";
  password: "";
  email: "";
  bio = "";
  name = "";
  version: string;
  msgs: any[];  
  checked: boolean = false;
  user:User
  constructor(private router:Router) {

   }

  ngOnInit(): void {
  }
  routeSendInfo(){
    this.router.navigate(['/sendInfo'])
  }
}
