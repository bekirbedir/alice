import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from '../models/activity';
import { map, tap } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {

private valuesUrl = environment.apiBaseUrl + "users/";

constructor(private _httpClient:HttpClient) { }

getPendingUsers(): Observable<UserModel[]> {
  return this._httpClient
    .get<UserModel[]>(this.valuesUrl+"getPending")
    .pipe(
      map((res) => res)
    );
} 

userApprove(user:UserModel): Observable<ResponseModel>{
  console.log("servise geldi - userApprove")
  const transferObject = user;
  
  let header:HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  const object = JSON.stringify(transferObject);
  const self = this;  
  return this._httpClient
  .post<ResponseModel>(this.valuesUrl+"userApprove",object,{headers: header})
  .pipe(
    map((res) => res),
  );
}
userReject(user:UserModel): Observable<ResponseModel>{
  const transferObject = user;
  
  
  let header:HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  const object = JSON.stringify(transferObject);
  const self = this;  
  return this._httpClient
  .post<ResponseModel>(this.valuesUrl+"userReject",object,{headers: header})
  .pipe(
    map((res) => res),
  );
}



}


