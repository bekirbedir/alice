import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Friend } from '../models/friend';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../auth/user';
import { UserModel } from '../models/user.model';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private valuesUrl = environment.apiBaseUrl

  constructor(private _httpClient:HttpClient) { }
  getFriendList(): Observable<Friend[]> {
    return this._httpClient
      .get<Friend[]>(this.valuesUrl+"admin/users/getall")
      .pipe(
        map((res) => res)
      );
  } 

  getProfile(): Observable<UserModel> {
    return this._httpClient
      .get<UserModel>(this.valuesUrl)
      .pipe(
        map((res) => res),
      );
  } 

  captchaControl(responseStr):Observable<any>{

    let header:HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  
    const object = JSON.stringify({recaptcha:responseStr});
  
      return this._httpClient
      .get<any>(this.valuesUrl+"captchaControl")
      .pipe(
        map((res) => res),
      );
  }

  postSmsCode(number,code):Observable<any>
  {
    const transferObject = {'number':number , 'code':code};
    let header: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    const object = JSON.stringify(transferObject);
    return this._httpClient
    .post<ResponseModel>(this.valuesUrl+"sms/sendSms",object, { headers: header })
    .pipe(
      map((res) => res)
    );
    
   }

  
 
  creatUser(user:User):Observable<ResponseModel>{

  let header:HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  const object = JSON.stringify(user);

    return this._httpClient
    .post<ResponseModel>(this.valuesUrl+"login/signup",object,{headers: header})
    .pipe(
      map((res) => res),
    );
}


allUsers(search): Observable<UserModel[]> {
  
  const transferObject = {
    search: search
  }
  let header: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  const object = JSON.stringify(transferObject);
  return this._httpClient
    .post<UserModel[]>(this.valuesUrl + "users/allUsers", object, { headers: header })
    .pipe(
      map((res) => res)
    );
}


birthdayUsers(): Observable<UserModel[]> {
  
  const transferObject = {
  }
  let header: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  const object = JSON.stringify(transferObject);
  return this._httpClient
    .post<UserModel[]>(this.valuesUrl + "users/birthdayUsers", object, { headers: header })
    .pipe(
      map((res) => res)
    );
}




  }



