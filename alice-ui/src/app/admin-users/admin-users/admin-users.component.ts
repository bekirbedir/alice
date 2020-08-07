import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/auth/login.service';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/users/user.service';


@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

  users: UserModel[];

  constructor(private userService:UserService,) { }

  ngOnInit(): void {
   this.getPendingUser();
  }

  getPendingUser(){
   
   console.log('geldi')
   this.userService.getPendingUsers().subscribe(x=>{
     console.log(x)
     this.users = x
   })
  }

}