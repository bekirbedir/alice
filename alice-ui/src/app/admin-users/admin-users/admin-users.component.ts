import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/auth/login.service';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/users/user.service';
import { AdminUsersService } from 'src/app/admin-users/admin-users.service';


@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {

  users: UserModel[];

  constructor(private userService:UserService,private adminUserService: AdminUsersService) { }

  ngOnInit(): void {
   this.getPendingUser();
  }

  getPendingUser(){
   this.adminUserService.getPendingUsers().subscribe(x=>{
     this.users = x
   })
  }
  userApprove(user:UserModel){
    this.adminUserService.userApprove(user).subscribe(x=>{
      if(x.status)
        this.getPendingUser();
    })
  }

}