import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CardModule } from 'primeng/card';
import { MenuItem } from 'primeng/api';
import { Activity } from 'src/app/models/activity';

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
import {MessageService} from 'primeng/api';
import localeTr from '@angular/common/locales/tr';
import { registerLocaleData } from '@angular/common';

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
  private isActiveUserId = localStorage.getItem('userId');

  @Select(ActivityState.GetActivities) Activities: Observable<Activity[]>;
  constructor(
    private loginservice: LoginService,
    private service: ActivityService,
    private store: Store,
    private router: Router,
    private messageService: MessageService
  ) {
    this.store.dispatch(new GetActivities());
    this.activeuser = localStorage.getItem('userId');
    console.log("activeuser ve öbürü",this.activeuser)
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
    this.Activities.subscribe((x) => {
      this.activities = x;
      for (var i = 0; i < this.activities.length; i++) {
        const userPricipantStatus = this.isCurrentUserParticipant(x[i]);
        this.activities[i].currentUserStatus = userPricipantStatus;
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

    this.images = [
      {
        previewImageSrc: 'assets/activites/1.jpeg',
        thumbnailImageSrc: 'assets/activites/1.jpeg',
        alt: 'Description for Image 1',
        title: 'Title 1',
      },

      {
        previewImageSrc: 'assets/activites/2.jpeg',
        thumbnailImageSrc: 'assets/activites/2.jpeg',
        alt: 'Description for Image 2',
        title: 'Title 2',
      },
      {
        previewImageSrc: 'assets/activites/3.jpeg',
        thumbnailImageSrc: 'assets/activites/3.jpeg',
        alt: 'Description for Image 3',
        title: 'Title 3',
      },
      {
        previewImageSrc: 'assets/activites/6.jpeg',
        thumbnailImageSrc: 'assets/activites/6.jpeg',
        alt: 'Description for Image 6',
        title: 'Title 6',
      },
    ];
  }

  viewDetail(item){
    this.store.dispatch(new GetActivityDetail(item._id))
    this.router.navigate(['/activity-view'])
  }

  viewComments(item){
    console.log("viewcommenetttsss")
    if(item.currentUserStatus != 2){
      this.messageService.add({key: 'tc', severity:'info', summary: 'Yetkisiz erişim', detail:'Duvarı, sadece katılımı onaylanan kullanıcılar görebilir..'});
    }else{
      this.store.dispatch(new GetActivityDetail(item._id))
      this.router.navigate(['/activity-comment'])
    }
   
  }

  activityManagement(item){
    localStorage.setItem('selectedActivityId', JSON.stringify(item._id));
    this.router.navigate(['/activity-management']);
  }

  newActivity() {
    this.router.navigate(['/new-activity']);
  }
  joinActivity(item) {
    this.service.join(item._id).subscribe((x) => {
      console.log(x._id);
      
    });
    item.currentUserStatus = 1;
  }

  isCurrentUserParticipant(activity: Activity) {
    if (this.isActiveUserId != null && this.isActiveUserId != '') {
      const userList = activity.userList;
      for (var i = 0; i < userList.length; i++) {
        if (userList[i].userId == this.isActiveUserId.trim())
          activity.currentUserStatus = userList[i].status;
        return userList[i].status;
      }
      return 0;
    } else {
      return 0;
    }
  }
}
