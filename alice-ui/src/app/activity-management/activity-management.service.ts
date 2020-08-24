import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from '../models/activity';
import { map, tap } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { ResponseModel } from '../models/response.model';
import {ActivityUserStatus} from '../models/activity.user.status';

@Injectable({
  providedIn: 'root'
})
export class ActivityManagementService {

private valuesUrl = environment.apiBaseUrl + "activity-management/";

constructor(private _httpClient:HttpClient) { }

getUsers(activityId,status): Observable<ActivityUserStatus[]> {
  const transferObject = {'activityId':activityId ,'status':status};

    let header: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    const object = JSON.stringify(transferObject);

  return this._httpClient
    .post<ActivityUserStatus[]>(this.valuesUrl+"getUsers",object, { headers: header })
    .pipe(
      map((res) => res)
    );
} 

userStateAction(activityId,userId ,status): Observable<ResponseModel> {
  const transferObject = {'activityId':activityId , 'userId':userId, 'status':status};
    let header: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    const object = JSON.stringify(transferObject);
  return this._httpClient
    .post<ResponseModel>(this.valuesUrl+"userStateAction",object, { headers: header })
    .pipe(
      map((res) => res)
    );
} 

}


