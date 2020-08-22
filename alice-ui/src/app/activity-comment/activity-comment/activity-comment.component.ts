import { Component, OnInit } from '@angular/core';
import { ActivityCommentService } from 'src/app/activity-comment/activity-comment.service';
import { ActivityCommentModel } from 'src/app/models/activity.comment.model';
import { LoginService } from 'src/app/auth/login.service';
import { ActivityState } from 'src/app/store/states/activity.state';
import { Activity } from 'src/app/models/activity';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activity-comment',
  templateUrl: './activity-comment.component.html',
  styleUrls: ['./activity-comment.component.css']
})
export class ActivityCommentComponent implements OnInit {
  @Select(ActivityState.selectedActivty) Activity: Observable<Activity>;

  comments: ActivityCommentModel[];
  newComment: ActivityCommentModel;
  activityStatic: Activity;



  constructor(private loginService: LoginService, private activityCommentService: ActivityCommentService, private router: Router) {
    this.newComment = new ActivityCommentModel()
    this.Activity.subscribe(x => {
      if (x) {
        this.activityStatic = x
        this.getComments();
      }

    })

  }

  ngOnInit(): void {
    if (this.activityStatic._id)
      this.getComments();
    else
      this.router.navigate(['/activities'])

  }

  getComments() {

    this.activityCommentService.getComments(this.activityStatic._id).subscribe(x => {
      this.comments = x
    })
  }

  sendComment() {

    this.newComment.userId = localStorage.getItem('userId')
    this.newComment.username = localStorage.getItem('userName').replace("\"", "").replace("\"", "") //local store koyup alabilirim veya dedıgım gıbı degısken yaratıp subscribe olurum   
    this.newComment.activityId = this.activityStatic._id;
    this.activityCommentService.sendComment(this.newComment).subscribe(x => {
      this.newComment.createdDate = new Date().toLocaleString();
      this.comments.push(this.newComment);
      this.newComment = new ActivityCommentModel();
    })


  }


}
