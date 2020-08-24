import { Component, OnInit } from '@angular/core';
import { ActivityManagementService } from 'src/app/activity-management/activity-management.service';
import { ActivityUserStatus } from 'src/app/models/activity.user.status';
import { stat } from 'fs';
import { ResponseModel } from 'src/app/models/response.model';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-activity-management',
  templateUrl: './activity-management.component.html',
  styleUrls: ['./activity-management.component.css'],
  providers: [MessageService]
})
export class ActivityManagementComponent implements OnInit {
  selectedActivityId: String
  waitingUsers: ActivityUserStatus[];
  approveUsers: ActivityUserStatus[];
  rejectedUsers: ActivityUserStatus[];
  response : ResponseModel;
  constructor(private service: ActivityManagementService ,     private messageService: MessageService) { }

  ngOnInit(): void {

    this.getAllStates();
   
  }
  getWaitingUsers() {
  
    this.service.getUsers(this.selectedActivityId,1).subscribe(x => {
      this.waitingUsers = x
    })

  }
  getApprovedUsers() {
    this.service.getUsers(this.selectedActivityId,2).subscribe(x => {
      this.approveUsers = x
    })
  }
  getRejectedUsers() {
    this.service.getUsers(this.selectedActivityId,3).subscribe(x => {
      this.rejectedUsers = x
    })
  }
  getAllStates(){
    this.selectedActivityId = localStorage.getItem('selectedActivityId').replace("\"", "").replace("\"", "");
    this.getWaitingUsers();
    this.getApprovedUsers();
    this.getRejectedUsers();
  }
  userStateAction(activityId, userId , status){
    ;
    this.service.userStateAction(activityId,userId,status).subscribe(x => {
      if(x.status){
        this.getAllStates();
        this.messageService.add({key: 'tc', severity:'info', summary: 'Başarılı', detail:'Kullanıcı Onaylandı..'});
      }
      else{
        
      }
    })
  }

  /*
1	Katılım isteği
2	onaylandı
3	reddedildi
4	katılmadı
*/

}
