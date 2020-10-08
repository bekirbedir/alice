import { Component, OnInit } from '@angular/core';
import { NotificationModel } from 'src/app/models/notification.model';
import { NotificationService } from '../notification.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: NotificationModel[];
  constructor(
    private service: NotificationService,
    private router:Router
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


}
