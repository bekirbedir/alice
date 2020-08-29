import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Activity } from '../models/activity';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ActivityUserStatus } from '../models/activity.user.status';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
 
  private valuesUrl = environment.apiBaseUrl + "activity/";
  private valuesGetActivityUrl = environment.apiBaseUrl + "activity-view";
  
  constructor(private _httpClient:HttpClient) { }
  getActivityList(): Observable<Activity[]> {
    return this._httpClient
      .get<Activity[]>(this.valuesUrl+"getall")
      .pipe(
        map((res) => res)
      );
  } 

  getActivity(id): Observable<Activity> {
    return this._httpClient
      .get<Activity>(this.valuesGetActivityUrl+"?id=" + id)
      .pipe(
        map((res) => res)
      );
  } 

  getActivityUserStatusList(): Observable<ActivityUserStatus[]> {
   
    let header:HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    return this._httpClient
      .get<ActivityUserStatus[]>(this.valuesUrl+"getActivityUserStatusList",{headers: header})
      .pipe(
        map((res) => res)
      );
  } 

  join(activityId): Observable<any>{
    const transferObject = {
      activityId:activityId
    }

    let header:HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    const object = JSON.stringify(transferObject);
    const self = this;  
    return this._httpClient
    .post<any>(this.valuesUrl+"join",object,{headers: header})
    .pipe(
      map((res) => res)
    );
  }
  
  


}

