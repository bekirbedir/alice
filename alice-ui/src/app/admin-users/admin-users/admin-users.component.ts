import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/auth/login.service';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/users/user.service';
import { AdminUsersService } from 'src/app/admin-users/admin-users.service';
import { MessageService } from 'primeng/api';
import { Activity } from 'src/app/models/activity';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
  providers: [MessageService]
})
export class AdminUsersComponent implements OnInit {

  pendingUsers: UserModel[];
  pendingMailApproveUsers: UserModel[];
  allUsers: UserModel[];
  rejectedUsers: UserModel[];
  pendingActivity: Activity[];

  constructor(private userService: UserService, private adminUserService: AdminUsersService, private messageService:MessageService,private router: Router) { }

  ngOnInit(): void {
    this.getPendingUser();
  }

  getPendingUser() {
    this.adminUserService.getPendingUsers().subscribe(x => {
      this.pendingUsers = x
    })
  }
  getAllUsers() {
    this.adminUserService.getAllUsers().subscribe(x => {
      this.allUsers = x
    })
  }
  getPendingActivity() {
    this.adminUserService.getPendingActivity().subscribe(x => {
      this.pendingActivity = x
    })
  }
  getRejectedUsers() {
    this.adminUserService.getRejectedUsers().subscribe(x => {
      this.rejectedUsers = x
    })
  }
   getPendingMailApproveUsers() {
    this.adminUserService.getPendingMailApproveUsers().subscribe(x => {
      this.pendingMailApproveUsers = x
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
    if (index == 2)
      this.getRejectedUsers();
    if (index == 3)
      this.getAllUsers();
    if (index == 4)
      this.getPendingMailApproveUsers();
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
    this.adminUserService.activityReject(activity).subscribe(x => {
      if (x.status){
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Başarılı', detail: 'Aktivite reddedildi.' });
        this.getPendingActivity();
      }
       
    })
  }

  userReject(user) {
    this.adminUserService.userReject(user).subscribe(x => {
      if (x.status){
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Başarılı', detail: 'Kullanıcı reddedildi' });
        this.getPendingUser();
      }
        
    })
  }

  photoUserLinkCreate(link) {
    if (link == null || link == "")
      link = "static/uploads/profile/empty_profile128.png";

    return environment.apiBaseUrl + link
  }

  routeProfile(userId){
    this.router.navigate(['/profile/'+userId])
   }
   
  
  photoLinkCreate(link){
    if(link == null || link == "")
      link = "static/uploads/empty_activity.jpg";

    return environment.apiBaseUrl +link
  }
  createActPhotoLink(link){
  
    if(link == null || link == "")
      link = "empty_activity.png";

    return environment.apiBaseUrl +"static/uploads/"+ link
  }
  
}