import { Component, OnInit } from '@angular/core';
import { ActivityCommentService } from 'src/app/activity-comment/activity-comment.service';
import { ActivityCommentModel } from 'src/app/models/activity.comment.model';
import { LoginService } from 'src/app/auth/login.service';
import { ActivityState } from 'src/app/store/states/activity.state';
import { Activity } from 'src/app/models/activity';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-activity-comment',
  templateUrl: './activity-comment.component.html',
  styleUrls: ['./activity-comment.component.css']
})
export class ActivityCommentComponent implements OnInit {
  @Select(ActivityState.selectedActivty) Activity: Observable<Activity>;

  comments: ActivityCommentModel[];
  newComment: ActivityCommentModel;
  activityStatic:Activity;

  

  constructor(private loginService: LoginService, private activityCommentService: ActivityCommentService) {
    this.Activity.subscribe(x=>{
      console.log("-------------------------------xxxxxxxxxxxxxxxxxx-++" + this.activityStatic)
      this.activityStatic=x
    })
  
  }

  ngOnInit(): void {
    this.getComments();
  }

  getComments() {
    
    console.log("--------------------------------++" + this.activityStatic)
    console.log("--------------------------------++" + this.activityStatic._Id)
    this.activityCommentService.getComments(this.activityStatic._Id).subscribe(x => {
      this.comments = x
    })
  }

  sendComment() { 
    console.log("testststts")

    this.loginService.user$.subscribe(x => {
      this.newComment.userId = x.id
    })
    var userName = localStorage.getItem('userName')//local store koyup alabilirim veya dedıgım gıbı degısken yaratıp subscribe olurum
    console.log("yeni yorum: "+ this.newComment.text)


  }


}
