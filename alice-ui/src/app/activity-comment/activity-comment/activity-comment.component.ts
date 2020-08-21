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
    this.newComment=new ActivityCommentModel()
    this.Activity.subscribe(x=>{
      if(x){
        this.activityStatic=x
        console.log("-------------------------------xxxxxxxxxxxxxxxxxx-++" ,x)
      }

    })
  
  }

  ngOnInit(): void {
    this.getComments();
  }

  getComments() {
    

    // this.activityCommentService.getComments(this.activityStatic._id).subscribe(x => {
    //   this.comments = x
    // })
  }

  sendComment() { 
    console.log("testststts")


      this.newComment.userId =localStorage.getItem('userId')
  
    var userName = localStorage.getItem('userName')//local store koyup alabilirim veya dedıgım gıbı degısken yaratıp subscribe olurum
    console.log("yeni yorum: "+ this.newComment.text)


  }


}
