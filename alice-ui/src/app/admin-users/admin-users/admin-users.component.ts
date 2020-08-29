import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/auth/login.service';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/users/user.service';
import { AdminUsersService } from 'src/app/admin-users/admin-users.service';
import { MessageService } from 'primeng/api';
import { Activity } from 'src/app/models/activity';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
  providers: [MessageService]
})
export class AdminUsersComponent implements OnInit {

  pendingUsers: UserModel[];
  pendingActivity: Activity[];

  constructor(private userService: UserService, private adminUserService: AdminUsersService, private messageService:MessageService) { }

  ngOnInit(): void {
    this.getPendingUser();
  }

  getPendingUser() {
    this.adminUserService.getPendingUsers().subscribe(x => {
      this.pendingUsers = x
    })
  }
  getPendingActivity() {
    this.adminUserService.getPendingActivity().subscribe(x => {
      this.pendingActivity = x
    })
  }
  userApprove(user: UserModel) {
    this.adminUserService.userApprove(user).subscribe(x => {
      if (x.status){
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Başarılı', detail: 'Kullanıcı onaylandı,kullanıcı mail ile bilgilendirildi' });
        this.getPendingUser();
      }
        
    })
  }

  handleChange(e) {
    var index = e.index;
    if (index == 0)
      this.getPendingUser();
    if (index == 1)
      this.getPendingActivity();
  }

  activityApprove(activity: Activity) {
    this.adminUserService.activityApprove(activity).subscribe(x => {
      if (x.status){
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Başarılı', detail: 'Aktivite onaylandı,kullanıcı mail ile bilgilendirildi' });
        this.getPendingActivity();
      }
       
    })
  }

  activityReject(activity: Activity) {
    this.messageService.add({ key: 'tc', severity: 'info', summary: 'Yetkisiz erişim', detail: 'Yapım aşamasında..' });
  }

  userReject() {
    this.messageService.add({ key: 'tc', severity: 'info', summary: 'Yetkisiz erişim', detail: 'Yapım aşamasında..' });
  }

}