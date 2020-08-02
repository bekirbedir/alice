import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import {CardModule} from 'primeng/card';
import { MenuItem } from 'primeng/api';
import { Activity } from 'src/app/models/activity';

import { Store, Select } from '@ngxs/store';
import { GetActivities, GetActivityDetail } from 'src/app/store/actions/activity.action';
import { ActivityState } from 'src/app/store/states/activity.state';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {

  images: any[];
  activities:Activity[]


  @Select(ActivityState.GetActivities) Activities: Observable<Activity[]>;
  constructor(private store:Store,private router:Router) { 
    this.store.dispatch(new GetActivities())
    
  }

  responsiveOptions:any[] = [
      {
          breakpoint: '1024px',
          numVisible: 5
      },
      {
          breakpoint: '768px',
          numVisible: 3
      },
      {
          breakpoint: '560px',
          numVisible: 1
      }
  ];
  modules: MenuItem[];
    
  activeItem1: MenuItem;

  ngOnInit() {

    this.Activities.subscribe(x=>{
      console.log("burdaaa",x)
      this.activities=x;
    })
    
    
  this.modules = [
      {label: 'Aktiviteler', icon: 'pi pi-fw pi-home', routerLink:'activities'},  
      {label: 'Turnuva', icon: 'pi pi-fw pi-calendar',routerLink:'challenges'}
    ];

  this.activeItem1 = this.modules[0];

    this.images=[
      {
          "previewImageSrc": "assets/activites/1.jpeg",
          "thumbnailImageSrc": "assets/activites/1.jpeg",
          "alt": "Description for Image 1",
          "title": "Title 1"
      },
 
      {
          "previewImageSrc":"assets/activites/2.jpeg",
          "thumbnailImageSrc":"assets/activites/2.jpeg",
          "alt": "Description for Image 2",
          "title": "Title 2"
      },
      {
          "previewImageSrc": "assets/activites/3.jpeg",
          "thumbnailImageSrc":"assets/activites/3.jpeg",
          "alt": "Description for Image 3",
          "title": "Title 3"
      },
      {
        "previewImageSrc": "assets/activites/6.jpeg",
        "thumbnailImageSrc":"assets/activites/6.jpeg",
        "alt": "Description for Image 6",
        "title": "Title 6"
    }]
  }

  viewDetail(item){
    console.log(item)
    this.store.dispatch(new GetActivityDetail(item.Id))
    this.router.navigate(['/activity-view'])
  }

  newActivity(){
    this.router.navigate(['/new-activity'])
  }
}
 