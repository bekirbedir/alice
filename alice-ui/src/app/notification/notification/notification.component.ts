import { Component, OnInit } from '@angular/core';
import { NotificationModel } from 'src/app/models/notification.model';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
import { Store, Select } from '@ngxs/store';
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

  routeProfile(userId){
    this.router.navigate(['/profile/'+userId])
   }

   routeActivity(activityId) {
    this.store.dispatch(new GetActivityDetail(activityId))
    localStorage.setItem("selectedActivityId",activityId)
  //  this.store.dispatch(new GetActivityDetail(item._id))
    this.router.navigate(['/activity-view'])
  }

}
