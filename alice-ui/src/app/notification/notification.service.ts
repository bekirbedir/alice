import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from '../models/activity';
import { ActivityCommentModel } from '../models/activity.comment.model';
import { map, tap } from 'rxjs/operators';
import { NotificationModel } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private valuesUrl = environment.apiBaseUrl+"notification/"
constructor(private _httpClient:HttpClient) { }



addActivity(activity:Activity): Observable<Activity> {
 
  let header:HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  const object = JSON.stringify(activity);
  return this._httpClient
    .post<Activity>(this.valuesUrl+"activity/",object,{headers: header})
    .pipe(
      map((res) => res)
    );
} 

getNotifications(): Observable<NotificationModel[]> {
 
  let header:HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  return this._httpClient
    .post<NotificationModel[]>(this.valuesUrl+"getNotifications/",null,{headers: header})
    .pipe(
      map((res) => res)
    );
} 


deleteFile(filename){
  return this._httpClient.get(this.valuesUrl+'activity/deleteFile?filename='+filename )
  .subscribe((response) => {
       
  })
}


}


