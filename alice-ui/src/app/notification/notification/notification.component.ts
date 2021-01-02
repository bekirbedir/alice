import { Component, OnInit } from '@angular/core';
import { NotificationModel } from 'src/app/models/notification.model';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { Store, Select } from '@ngxs/store';
import { environment } from 'src/environments/environment';
import {
  GetActivities,
  GetActivityDetail,
} from 'src/app/store/actions/activity.action';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: NotificationModel[];
  constructor(
    private service: NotificationService,
    private router:Router,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.getNotifications();
  }
  getNotifications() {
    this.service.getNotifications().subscribe((x) => {
        this.notifications = x
    });

  }
  
  viewComments(id) {
           //this.store.dispatch(new GetActivityDetail(item._id))
        this.store.dispatch(new GetActivityDetail(id))
        this.router.navigate(['/activity-comment'])
      
    
  }
  userPhotoLinkCreate(link){

    if(link == null || link == "")
      link = "static/uploads/profile/empty_profile128.png";

    return environment.apiBaseUrl +link
  }
  actPhotoLinkCreate(link){
  
    if(link == null || link == "")
      link = "empty_activity.png";

    return environment.apiBaseUrl +"static/uploads/"+ link
  }

  routeProfile(userId){
    this.router.navigate(['/profile/'+userId])
   }

   routeActivity(activityId) {
    this.store.dispatch(new GetActivityDetail(activityId))
    localStorage.setItem("selectedActivityId",activityId)
  //  this.store.dispatch(new GetActivityDetail(item._id))
    this.router.navigate(['/activity-view/'+activityId]);
  }

}
