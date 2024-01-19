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
  edited:Boolean=false;
  activityFinish: Boolean = false;

  imgHidden: Boolean = true;
  imgSrc: String;
  deleteOld:Boolean = false;
  fileName:String;
  baseUrl: String;
  uploadUrl: String;
  loading: Boolean=false;

  constructor(private service: ActivityManagementService, 
    private messageService: MessageService, 
    private _sanitizer: DomSanitizer, private imageCompress: NgxImageCompressService,
    private router: Router,) {
    this.activity = new Activity();
    
  }

  ngOnInit(): void {
    this.tr = {
      firstDayOfWeek: 1,
      dayNames: [ "Pazar","Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
      dayNamesShort: ["Pzr","Pzt", "Sal", "Çrş", "Prş", "Cma", "Cts"],
      dayNamesMin: ["PZ","PT", "SA", "ÇA", "PE", "CU", "CT"],
      monthNames: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
      monthNamesShort: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Temm", "Agu", "Eyl", "Eki", "Kas", "Ara"],
      today: 'Bugün',
      clear: 'Temizle',
      dateFormat: 'dd.mm.yy',
      weekHeader: 'Wk'
    };

    this.getAllStates();

  }
  getWaitingUsers() {

    this.service.getUsers(this.selectedActivityId, 1).subscribe(x => {
      this.waitingUsers = x;
      this.loading = false;
    })

  }
  getApprovedUsers() {
    this.service.getUsers(this.selectedActivityId, 2).subscribe(x => {
      this.approveUsers = x
      this.loading = false;
    })
  }
  getRejectedUsers() {
    this.service.getUsers(this.selectedActivityId, 3).subscribe(x => {
      this.rejectedUsers = x
      this.loading = false;
    })
  }

  getAllStates() {
    this.loading = true;
    this.selectedActivityId = localStorage.getItem('selectedActivityId').replace("\"", "").replace("\"", "");
    this.getSelectedActivity();
    this.getWaitingUsers();
  }
  userStateAction(data,activityId, userId, status) {
   this.loading = true;
    let selectedTab = localStorage.getItem('selectedManagementTab').replace("\"","").replace("\"","");;
   
      this.service.userStateAction(activityId, userId, status).subscribe(x => {
      if (x.status) {
        this.messageService.add({ key: 'tc', severity: 'info', summary: 'Başarılı', detail: 'Kaydedildi..' });
       //    this.callFunctionSelected(Number(selectedTab));
        this.deleteRow(data,userId)
      }
      else {

      }
      this.loading = false;
    }) 
    this.loading = false;
  }

  deleteRow(data,id){
 //   console.log(data,id)
    for(let i = 0; i < data.length; ++i){
        if (data[i].user._id === id) {
      //    console.log('aaa',data[i])
            data.splice(i,1);
        }
    }
}

  userJoinedAction(activityId, userId, joined) {
    //joined 2: katıldı , 1:katılmadı
    let selectedTab = localStorage.getItem('selectedManagementTab').replace("\"","").replace("\"","");;
    this.service.userJoinedAction(activityId, userId, joined).subscribe(x => {
      if (x) {
        this.messageService.add({ key: 'tc', severity: x.toastType, summary: x.summary, detail:x.message });
        this.callFunctionSelected(Number(selectedTab));
      }
    })
  }
  
  isFinished(act){

    if( Date.now() > new Date(act.date).getTime() )
      this.activityFinish = true;
    else
    this.activityFinish = false;
  }


  getSelectedActivity() {
    this.service.getSelectedActivity(this.selectedActivityId).subscribe(x => {
      this.activity = x
      this.isFinished(x);
      this.activity.date=new Date(x.date)
      this.baseUrl = environment.apiBaseUrl
      this.uploadUrl = this.baseUrl + "activity/upload"
      this.imgSrc = this.baseUrl+"static/uploads/"+this.activity.fileLink
    })
  }
  updateActivity() {
    this.service.updateActivity(this.activity).subscribe(x => {
      this.response = x
      if (x.status) {
        this.messageService.add({ key: 'tc', severity: 'info', summary: 'Başarılı', detail: 'Aktivite güncellendi..' });
         this.edited = true;
         if(x.activityId){
          localStorage.setItem("selectedActivityId", x.activityId)
          this.router.navigate(['/activity-view/'+x.activityId])
        }
      }
      else {
        this.messageService.add({ key: 'tc', severity: 'error', summary: 'Hata', detail: x.message });
      }
    })
  }
  deleteActivityApprove(){
    this.messageService.add({ key: 'c', sticky: true, severity: 'warn', summary: 'Emin misiniz?', detail: 'Aktiviteyi silmek istediğinize emin misiniz?' });
  }
  deleteActivity() {
    this.service.deleteActivity(this.activity).subscribe(x => {
      this.response = x
      if (x.status) {
        this.messageService.add({ key: 'tc', severity: 'info', summary: 'Başarılı', detail: 'Aktivite silindi' });
        this.router.navigate(['/'])
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
 
    if(link == null || link == "")
      link = "static/uploads/profile/empty_profile128.png";

    return environment.apiBaseUrl +link
  }

  routeProfile(userId){
    this.router.navigate(['/profile/'+userId])
   }

   onBasicUpload(element){
    if( this.deleteOld ){
      this.service.deleteFile(this.fileName);
    }
    this.fileName = element.originalEvent.body.photoLink
    this.imgHidden = false;
    this.imgSrc = this.baseUrl+"static/uploads/"+this.fileName

    this.deleteOld = true;
    this.activity.fileLink = this.fileName;
  }

  onReject() {
    this.messageService.clear('c');
  }
  onConfirm() {
    this.deleteActivity();
    this.messageService.clear('c');
  }
  isOwner(actUserId){
   // console.log("actUserId" , actUserId)
  //  console.log(this.activity.user)
    if(actUserId== this.activity.user)
      return true;
    else
     return false;
  }


}
