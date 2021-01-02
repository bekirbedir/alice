import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { ActivityState } from 'src/app/store/states/activity.state';
import { Observable } from 'rxjs';
import { Activity } from 'src/app/models/activity';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GetActivityDetail } from 'src/app/store/actions/activity.action';
import { ActivityService } from 'src/app/activities/activity.service';
import { ActivityUserStatus } from 'src/app/models/activity.user.status';
import { UserModel } from 'src/app/models/user.model';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxImageCompressService } from 'ngx-image-compress';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-activity-view',
  templateUrl: './activity-view.component.html',
  styleUrls: ['./activity-view.component.css'],
  providers: [MessageService]
})
export class ActivityViewComponent implements OnInit {
  //  @Select(ActivityState.selectedActivty) Activity: Observable<Activity>;

  activityStatic: Activity
  activityUserStatuses: ActivityUserStatus;
  activityId: String;
  approvedUsers: ActivityUserStatus[];
  isOwner: Boolean = false;
 currentDateTime :Number;

  constructor(private store: Store, private router: Router,
    private messageService: MessageService,
    private activityService: ActivityService,
    private _sanitizer: DomSanitizer,
    private actRoute: ActivatedRoute, 
    private imageCompress: NgxImageCompressService) {


      this.actRoute.paramMap.subscribe(params => {
     
        if(params.get('id')){
       //   this.activityId = params.get('id');
          localStorage.setItem('selectedActivityId',params.get('id'))
        }
             
      }); 
    
    this.activityId = localStorage.getItem('selectedActivityId').replace("\"", "").replace("\"", "");
    this.getActivity(this.activityId);


  }
  ngOnInit(): void {
    this.currentDateTime = Date.now()
  }

  isShowByCreatedDate(act){
    if(new Date(act.date).getTime() > this.currentDateTime )
      return true;
    else
      return false;
  }

  getActivity(activityId) {
    this.activityService.getActivity(activityId).subscribe(x => {
      if (x) {
        this.activityStatic = x;
        this.getActivityUserStatus(this.activityStatic);
      }
      else {
        console.log('activite bulunamadi')
      }
    })
  }

  getActivityUserStatus(activity) {
    if (localStorage.getItem("userId").replace("\"", "").replace("\"", "") == activity.ownerId.replace("\"", "").replace("\"", "")) {

      this.isOwner = true;
      this.getApprovedUsers(activity._id);
    }
    this.activityService.getActivityAndUserStatus(activity._id).subscribe(x => {
      if (x) {
        try {
          this.activityUserStatuses = x[0];
          this.activityStatic.currentUserStatus = x[0].status;
          if (x[0].status == 2)
            this.getApprovedUsers(activity._id);
        }
        catch (error) {
          this.activityStatic.currentUserStatus = 0;
        }

      }
      else {
        console.log('activite bulunamadi')
      }
    })
  }

  getApprovedUsers(activityId) {
    this.activityService.getApprovedUsers(activityId).subscribe(x => {
      if (x) {
        this.approvedUsers = x;

      }
      else {
        console.log('activite bulunamadi')
      }
    })
  }

  viewComments(item) {
    if (this.isOwner) {
      this.store.dispatch(new GetActivityDetail(item._id))
      this.router.navigate(['/activity-comment'])
    }
    else {
      let currentUserStatus = this.activityStatic.currentUserStatus;
      if (Number(currentUserStatus) != 2) {
        this.messageService.add({ key: 'tc', severity: 'info', summary: 'Yetkisiz erişim', detail: 'Duvarı, sadece katılımı onaylanan kullanıcılar görebilir..' });
      } else {
        //this.store.dispatch(new GetActivityDetail(item._id))
        this.store.dispatch(new GetActivityDetail(item._id))
        this.router.navigate(['/activity-comment'])
      }
    }
  }

  unlikeActivity(item) {
    this.activityService.unlikeActivity(item._id).subscribe((x) => {
     
      if(x.status){
        this.activityUserStatuses.like= false;
     }

    });
   }

  likeActivity(item) {
    this.activityService.likeActivity(item._id).subscribe((x) => {
     
      if(x.status){
        if(this.activityUserStatuses != null)
           this.activityUserStatuses.like= true;
          else{
            this.activityUserStatuses = new ActivityUserStatus;
            this.activityUserStatuses.like= true;
          }
        
        this.messageService.add({ key: 'tc', severity: 'info', summary: 'Aktiviteyi beğendin' });
    
      }

    });
  }



  joinActivity(item) {
    this.activityService.join(item._id).subscribe((x) => {
     
    });
    item.currentUserStatus = 1;
    this.messageService.add({ key: 'tc', severity: 'info', summary: 'Başarılı', detail: 'Aktiviteye katılım isteği gönderdiniz' });
  }

  cancelActivityApprove(item) {
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

  cancelActivity() {
    this.activityService.cancelActivity(this.activityStatic._id).subscribe((x) => {
      if (x.status) {
        this.activityStatic.currentUserStatus = 0;
        this.messageService.add({ key: 'tc', severity: 'success', summary: 'Başarılı', detail: 'Katılım isteği geri çekildi' });
      }
    });

  }

  routeProfile(userId) {
    this.router.navigate(['/profile/' + userId])
  }

  photoLinkCreate(link) {
    if (link == null || link == "")
      link = "static/uploads/profile/empty_profile128.png";

    return environment.apiBaseUrl + link
  }
  createActPhotoLink(link) {

    if (link == null || link == "")
      link = "empty_activity.png";

    return environment.apiBaseUrl + "static/uploads/" + link
  }

  activityManagement(item) {
    localStorage.setItem('selectedActivityId', JSON.stringify(item._id));
    this.router.navigate(['/activity-management']);
  }


}
