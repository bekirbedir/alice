import { Component, OnInit } from '@angular/core';
import { NotificationModel } from 'src/app/models/notification.model';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  notifications: NotificationModel[];
  constructor(
    private service: NotificationService
  ) { }

  ngOnInit(): void {
    this.getNotifications();
  }
  getNotifications() {
    this.service.getNotifications().subscribe((x) => {
        this.notifications = x
    });

  }


}
