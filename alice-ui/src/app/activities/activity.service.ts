import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Activity } from '../models/activity';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

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
        map((res) => res),
        tap((x) => console.log("aktiviteler", x))
      );
  } 

  getActivity(id): Observable<Activity> {
    console.log("-----burasi2",id);
    return this._httpClient
      .get<Activity>(this.valuesGetActivityUrl+"?Id=" + id)
      .pipe(
        map((res) => res),
        tap((x) => console.log("aktivite", x)) //bu pipe sadece log icin mi burak? #bb
      );
  } 

  join(activityId): Observable<any>{
    console.log("servise geldi")
    const transferObject = {
      activityId:activityId
    }

    let header:HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    const object = JSON.stringify(transferObject);
    const self = this;  
    return this._httpClient
    .post<any>(this.valuesUrl+"join",object,{headers: header})
    .pipe(
      map((res) => res),
      tap((x) => console.log("aktivite", x)) //bu pipe sadece log icin mi burak? #bb
    );
  }
  
  


}

