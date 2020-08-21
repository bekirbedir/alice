import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { ActivityState } from 'src/app/store/states/activity.state';
import { Observable } from 'rxjs';
import { Activity } from 'src/app/models/activity';

@Component({
  selector: 'app-activity-view',
  templateUrl: './activity-view.component.html',
  styleUrls: ['./activity-view.component.css']
})
export class ActivityViewComponent implements OnInit {
  @Select(ActivityState.selectedActivty) Activity: Observable<Activity>;

  activityStatic:Activity
  
  constructor(private store:Store) { 

    this.Activity.subscribe(x=>{
      console.log("pppppppppppppppppppppp"+ x)
      this.activityStatic=x
    })
    console.log('tetetetettetetetetettete')
    console.log(this.activityStatic);

  }

  ngOnInit(): void {

  }

}
