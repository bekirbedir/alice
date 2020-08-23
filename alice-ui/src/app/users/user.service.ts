import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Friend } from '../models/friend';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../auth/user';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private valuesUrl = environment.apiBaseUrl

  constructor(private _httpClient:HttpClient) { }
  getFriendList(): Observable<Friend[]> {
    return this._httpClient
      .get<Friend[]>(this.valuesUrl+"users/getall")
      .pipe(
        map((res) => res),
        tap((x) => console.log("userlar", x))
      );
  } 

  getProfile(): Observable<UserModel> {
    return this._httpClient
      .get<UserModel>(this.valuesUrl)
      .pipe(
        map((res) => res),
        tap((x) => console.log("userlar", x))
      );
  } 

 
  creatUser(user:User):Observable<User>{

  let header:HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  const object = JSON.stringify(user);

    return this._httpClient
    .post<User>(this.valuesUrl+"users/signup",object,{headers: header})
    .pipe(
      map((res) => res),
      tap((x) => console.log("userlar", x))
    );
}
  }



