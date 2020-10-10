import { Component, OnInit } from '@angular/core';
import { ActivityManagementService } from 'src/app/activity-management/activity-management.service';
import { ActivityUserStatus } from 'src/app/models/activity.user.status';
import { stat } from 'fs';
import { environment } from 'src/environments/environment';
import { ResponseModel } from 'src/app/models/response.model';
import { MessageService } from 'primeng/api';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Activity } from 'src/app/models/activity';
import { Router } from '@angular/router';

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
  activity: Activity;
  response: ResponseModel;
  checked: boolean = false;
  limitedParticipant: boolean = false;
  activityheader: String;
  tr: any;
  constructor(private service: ActivityManagementService, private messageService: MessageService, 
    private _sanitizer: DomSanitizer, private imageCompress: NgxImageCompressService,
    private router: Router,) {
    this.activity = new Activity();
    this.activityheader = "ssdfs"
  }

  ngOnInit(): void {
    this.tr = {
      firstDayOfWeek: 0,
      dayNames: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
      dayNamesShort: ["Paz", "Pzt", "Sal", "ÇRŞ", "PRŞ", "CMA", "CTS"],
      dayNamesMin: ["PA", "PT", "SA", "ÇA", "PE", "CU", "PZ"],
      monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      today: 'Today',
      clear: 'Clear',
      dateFormat: 'dd.mm.yy',
      weekHeader: 'Wk'
    };

    this.getAllStates();

  }
  getWaitingUsers() {

    this.service.getUsers(this.selectedActivityId, 1).subscribe(x => {
      this.waitingUsers = x
      for (var i = 0; i < this.waitingUsers.length; i++) {
        this.waitingUsers[i].imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          + this.waitingUsers[i].user.userPhoto);
      }
    })

  }
  getApprovedUsers() {
    this.service.getUsers(this.selectedActivityId, 2).subscribe(x => {
      this.approveUsers = x
      for (var i = 0; i < this.approveUsers.length; i++) {
        this.approveUsers[i].imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          + this.approveUsers[i].user.userPhoto);
      }
    })
  }
  getRejectedUsers() {
    this.service.getUsers(this.selectedActivityId, 3).subscribe(x => {
      this.rejectedUsers = x
      for (var i = 0; i < this.rejectedUsers.length; i++) {
        this.rejectedUsers[i].imagePath = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          + this.rejectedUsers[i].user.userPhoto);
      }
    })
  }

  getAllStates() {
    this.selectedActivityId = localStorage.getItem('selectedActivityId').replace("\"", "").replace("\"", "");
    this.getWaitingUsers();
  }
  userStateAction(activityId, userId, status) {
    let selectedTab = localStorage.getItem('selectedManagementTab');
    this.service.userStateAction(activityId, userId, status).subscribe(x => {
      if (x.status) {
        this.messageService.add({ key: 'tc', severity: 'info', summary: 'Başarılı', detail: 'Kaydedildi..' });
        this.callFunctionSelected(Number(selectedTab));
      }
      else {

      }
    })
  }

  getSelectedActivity() {
    this.service.getSelectedActivity(this.selectedActivityId).subscribe(x => {
      this.activity = x
    })
  }
  updateActivity() {
    this.service.updateActivity(this.activity).subscribe(x => {
      this.response = x
      if (x.status) {
        this.messageService.add({ key: 'tc', severity: 'info', summary: 'Başarılı', detail: 'Aktivite kaydedildi,yönetici onayından sonra yeniden yayınlanacaktır..' });
      }
      else {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Hata', detail: x.message });
      }
    })
  }

  handleChange(e) {
    var index = e.index;
    localStorage.setItem('selectedManagementTab', index);
    this.callFunctionSelected(index);

  }
  callFunctionSelected(index) {

    if (index == 0)
      this.getWaitingUsers();
    if (index == 1)
      this.getApprovedUsers();

    if (index == 2)
      this.getRejectedUsers();

    if (index == 3)
      this.getSelectedActivity();
  }
  photoLinkCreate(link){
    console.log("linkkk" , link)
    if(link == null || link == "")
      link = "static/uploads/profile/empty_profile128.png";

    return environment.apiBaseUrl +link
  }

  routeProfile(userId){
    this.router.navigate(['/profile/'+userId])
   }

  

  /*
1	Katılım isteği
2	onaylandı
3	reddedildi
4	katılmadı
*/

}
