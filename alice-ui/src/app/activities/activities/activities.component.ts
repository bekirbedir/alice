import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CardModule } from 'primeng/card';
import { MenuItem } from 'primeng/api';
import { Activity } from 'src/app/models/activity';
import { UserModel } from 'src/app/models/user.model';

import { Store, Select } from '@ngxs/store';
import {
  GetActivities,
  GetActivityDetail,
} from 'src/app/store/actions/activity.action';
import { ActivityState } from 'src/app/store/states/activity.state';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ActivityService } from '../activity.service';
import { UserStatus } from 'src/app/models/user.status';
import { LoginService } from 'src/app/auth/login.service';
import { MessageService } from 'primeng/api';
import localeTr from '@angular/common/locales/tr';
import { registerLocaleData } from '@angular/common';
import { ActivityUserStatus } from 'src/app/models/activity.user.status';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxImageCompressService } from 'ngx-image-compress';

registerLocaleData(localeTr, 'tr');
@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css'],
  providers: [MessageService]
})
export class ActivitiesComponent implements OnInit {
  images: any[];
  activities: Activity[];
  activityCurrentUserStatus = 0;
  activeuser: any;
  selectedActivityItem: Activity;
  activiteUserStatuses: ActivityUserStatus[]
  loading:Boolean
  searchWord:String;
  currentDateTime:Number;
  oldActivities:Boolean=false;
  randomUsers:UserModel[];
  private isActiveUserId = localStorage.getItem('userId');

//  @Select(ActivityState.GetActivities) Activities: Observable<Activity[]>;
  constructor(
    private loginservice: LoginService,
    private service: ActivityService,
    private store: Store,
    private router: Router,
    private messageService: MessageService,
    private _sanitizer: DomSanitizer,
    private imageCompress: NgxImageCompressService
  ) {
  //  this.store.dispatch(new GetActivities());
    this.activeuser = localStorage.getItem('userId');
    this.loading = false;
  }


  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];
  modules: MenuItem[];

  activeItem1: MenuItem;

  ngOnInit() {
    this.currentDateTime = Date.now()
    this.loading = true;
    this.getRandomUsers();
    this.service.getActivityList('').subscribe(x => {
      this.activities = x;
      if (x) {
        this.getActivityUserStatusList();

      }
    });

    this.modules = [
      {
        label: 'Aktiviteler',
        icon: 'pi pi-fw pi-home',
        routerLink: 'activities',
      },
      {
        label: 'Turnuva',
        icon: 'pi pi-fw pi-calendar',
        routerLink: 'challenges',
      },
    ];

    this.activeItem1 = this.modules[0];

  }
  
  getRandomUsers() {
    this.service.getRandomUsers().subscribe((x) => {
      this.randomUsers = x;
    });
   }

   

  isShowByCreatedDate(act){
    if(new Date(act.date).getTime() > this.currentDateTime )
      return true;
    else
      return false;
  }

  oldActivitiesCheckBox(e){
    this.loading = true
        if(this.oldActivities){
          this.service.getOldActivityList('').subscribe(x => {
            this.activities = x;
            this.loading = false;
            if (x) {
         //     this.getActivityUserStatusList();
            }
          });
        }
        else{
          this.service.getActivityList('').subscribe(x => {
            this.activities = x;
            this.loading = false;
            if (x) {
              this.getActivityUserStatusList();
      
            }
          });
        }
  }
  viewDetail(item) {
    localStorage.setItem("currentUserStatus", item.currentUserStatus)
    localStorage.setItem("selectedActivityId", item._id)
  //  this.store.dispatch(new GetActivityDetail(item._id))
    this.router.navigate(['/activity-view/'+item._id])
  }

  shareActivity(item){
    navigator.clipboard.writeText('https://www.activityfriend.com.tr/activity-view/'+item._id)
    this.messageService.add({ key: 'tc', severity: 'success', summary: 'Başarılı', detail: 'Aktivite panoya kopyalandı' });
  }

  viewComments(item) {
   
    if (item.currentUserStatus != 2 ) {
      if(localStorage.getItem("userId").replace("\"","").replace("\"","")== item.ownerId.replace("\"","").replace("\"","")){
        this.store.dispatch(new GetActivityDetail(item._id))
        this.router.navigate(['/activity-comment'])
      }
      else
       this.messageService.add({ key: 'tc', severity: 'info', summary: 'Yetkisiz erişim', detail: 'Duvarı, sadece katılımı onaylanan kullanıcılar görebilir..' });
    } else {
      this.store.dispatch(new GetActivityDetail(item._id))
      this.router.navigate(['/activity-comment'])
    }

  }

  activityManagement(item) {
    localStorage.setItem('selectedActivityId', JSON.stringify(item._id));
    this.router.navigate(['/activity-management']);
  }

  newActivity() {
    this.router.navigate(['/new-activity']);
  }
  joinActivity(item) {
    if(item.participationCount/item.participationLimit == 1) {
      this.messageService.add({ key: 'tc', severity: 'warn', summary: 'İşlem Başarısız', detail: 'Aktivite kontenjanı doldu' });
    }else{
      this.service.join(item._id).subscribe((x) => {
      });
      item.currentUserStatus = 1;
      this.messageService.add({ key: 'tc', severity: 'info', summary: 'Başarılı', detail: 'Aktiviteye katılım isteği gönderdiniz' });
    }
  }

  unlikeActivity(item) {
    this.service.unlikeActivity(item._id).subscribe((x) => {
     
      if(x.status){
        item.currentUserLike = false;
      }

    });
   }

  likeActivity(item) {
    this.service.likeActivity(item._id).subscribe((x) => {
    
      if(x.status){
        item.currentUserLike = true;
      }

    });
  }


  cancelActivityApprove(item) {
     this.selectedActivityItem = item;
    this.messageService.clear();
    this.messageService.add({ key: 'c', sticky: true, severity: 'warn', summary: 'Emin misiniz?', detail: 'Aktiviteye katılma isteğiniz geri çekilecek.' });
  }

  onConfirm() {
    this.cancelActivity();
    this.messageService.clear('c');
  }

  onReject() {
    this.messageService.clear('c');
  }

  clear() {
    this.messageService.clear();
  }
  cancelActivity() {
    this.service.cancelActivity( this.selectedActivityItem._id).subscribe((x) => {
      if (x.status) {
        this.selectedActivityItem.currentUserStatus = 0;
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Başarılı', detail: 'Katılım isteği geri çekildi' });
      }
    });

  }

  isCurrentUserParticipant(activity: Activity) {
    if (this.isActiveUserId != null && this.isActiveUserId != '') {
      for (var i = 0; i < this.activiteUserStatuses.length; i++) {
        if (this.activiteUserStatuses[i].activityId == activity._id)
          return this.activiteUserStatuses[i].status
      }
      return 0;
    } else {
      return 0;
    }
  }

  isCurrentUserLike(activity: Activity) {
    if (this.isActiveUserId != null && this.isActiveUserId != '') {
      for (var i = 0; i < this.activiteUserStatuses.length; i++) {
        if (this.activiteUserStatuses[i].activityId == activity._id)
          return this.activiteUserStatuses[i].like
      }
      return false;
    } else {
      return false;
    }
  }

  convertImage(activity: Activity) {
    
    if (activity?.user?.userPhoto)
      return this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + activity.user.userPhoto);
  }

  getActivityUserStatusList() {
    this.service.getActivityUserStatusList().subscribe(x => {
      if (x) {
        this.activiteUserStatuses = x;
        for (var i = 0; i < this.activities.length; i++) {
          const userPricipantStatus = this.isCurrentUserParticipant(this.activities[i]);
          this.activities[i].currentUserStatus = userPricipantStatus;
          const userLike = this.isCurrentUserLike(this.activities[i]);
          this.activities[i].currentUserLike = userLike;
        }
      }
      else {

      }
      
      this.loading = false;
    })
  }
  photoLinkCreate(link){

    if(link == null || link == "")
      link = "static/uploads/profile/empty_profile128.png";

    return environment.apiBaseUrl +link
  }
  createActPhotoLink(link){
  
    if(link == null || link == "")
      link = "empty_activity.png";

    return environment.apiBaseUrl +"static/uploads/"+ link
  }
  
  searchFilter(e){

    this.loading = true
    this.service.getActivityList(this.searchWord).subscribe(x => {
      this.activities = x;
      if (x) {
        this.loading = false
        this.getActivityUserStatusList();

      }
    }); 
  }
  filter() {
    this.messageService.add({ key: 'tc', severity: 'info', summary: 'Yetkisiz erişim', detail: 'Yapım aşamasında..' });
  }
  routeProfile(userId){
    this.router.navigate(['/profile/'+userId])
   }
   isOwner(act){
    return localStorage.getItem('userId').replace('\"','').replace('\"','')== act.ownerId.replace('\"','').replace('\"','')
   }
}
