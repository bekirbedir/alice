import { Component, OnInit } from '@angular/core';
import { ActivityManagementService } from 'src/app/activity-management/activity-management.service';
import { ActivityUserStatus } from 'src/app/models/activity.user.status';

@Component({
  selector: 'app-activity-management',
  templateUrl: './activity-management.component.html',
  styleUrls: ['./activity-management.component.css']
})
export class ActivityManagementComponent implements OnInit {
  selectedActivityId: String
  waitingUsers: ActivityUserStatus[];
  approveUsers: ActivityUserStatus[];
  rejectedUsers: ActivityUserStatus[];
  constructor(private service: ActivityManagementService) { }

  ngOnInit(): void {
    this.selectedActivityId = localStorage.getItem('selectedActivityId').replace("\"", "").replace("\"", "");
    localStorage.setItem('selectedActivityId','');
    this.getWaitingUsers();
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

  /*
1	Katılım isteği
2	onaylandı
3	reddedildi
4	katılmadı
*/

}
