import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { ActivityState } from 'src/app/store/states/activity.state';
import { Observable } from 'rxjs';
import { Activity } from 'src/app/models/activity';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GetActivityDetail } from 'src/app/store/actions/activity.action';

@Component({
  selector: 'app-activity-view',
  templateUrl: './activity-view.component.html',
  styleUrls: ['./activity-view.component.css'],
  providers: [MessageService]
})
export class ActivityViewComponent implements OnInit {
  @Select(ActivityState.selectedActivty) Activity: Observable<Activity>;

  activityStatic:Activity
  
  constructor(private store:Store,  private router: Router,    private messageService: MessageService,) { 

    this.Activity.subscribe(x=>{
      this.activityStatic=x
    })


  }

  ngOnInit(): void {

  }

  
  viewComments(item) {
    let currentUserStatus = localStorage.getItem('currentUserStatus');
    console.log("currentUserStatus", currentUserStatus)
    if (Number(currentUserStatus) != 2) {
      this.messageService.add({ key: 'tc', severity: 'info', summary: 'Yetkisiz erişim', detail: 'Duvarı, sadece katılımı onaylanan kullanıcılar görebilir..' });
    } else {
      //this.store.dispatch(new GetActivityDetail(item._id))
      this.router.navigate(['/activity-comment'])
    }

  }
  
}
