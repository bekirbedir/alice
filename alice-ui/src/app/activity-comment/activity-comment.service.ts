import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from '../models/activity';
import { map, tap } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { ResponseModel } from '../models/response.model';
import { ActivityCommentModel } from '../models/activity.comment.model';

@Injectable({
  providedIn: 'root'
})
export class ActivityCommentService {

  private valuesUrl = environment.apiBaseUrl + "activity-comment/";

  constructor(private _httpClient: HttpClient) { }

  getComments(id): Observable<ActivityCommentModel[]> {
    return this._httpClient
      .get<ActivityCommentModel[]>(this.valuesUrl + "getComments"+"?id=" + id)
      .pipe(
        map((res) => res),
      );

  
  }

  sendComment(newComment: ActivityCommentModel): Observable<ActivityCommentModel> {

    const transferObject = newComment;

    let header: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    const object = JSON.stringify(transferObject);
    const self = this;
    return this._httpClient
      .post<ActivityCommentModel>(this.valuesUrl + "sendComment", object, { headers: header })
      .pipe(
        map((res) => res),
      );
      
  }



}


