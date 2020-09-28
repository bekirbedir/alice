import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, take } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';
import { User } from './user';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { ResponseModel } from '../models/response.model';

const helper = new JwtHelperService();

@Injectable({
	providedIn: 'root',
})
export class LoginService {

    
  private valuesUrl = environment.apiBaseUrl
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject(null);

  user$: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
   
    const data =  JSON.parse(JSON.stringify(localStorage.getItem('aliceuser')))
    if(data != null && data != "" && data != "null"){
       const user= helper.decodeToken(data.token);
       this.userSubject.next(user);
       this.user$ = this.userSubject.asObservable();
 
    }
    
  }

 login(userName: string, password: string):Observable<any> {
   console.log("servise geldi")
    const transferObject = {
        password: password,
        username: userName
    }

    let header:HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

    const object = JSON.stringify(transferObject);
    const self = this;  
  
    return this.http
      .post<any>(this.valuesUrl+'login/login',object,{headers: header})
      .pipe( 
        map(data => {
          const user= helper.decodeToken(data.token);
          if (data.token) {
            console.log("içinde")
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('aliceuser', JSON.stringify(data.token));
            localStorage.setItem('userName', JSON.stringify(user.name))
            localStorage.setItem('userId', JSON.stringify(user.id))
             
          this.userSubject.next(user);
          }  
          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('aliceuser');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
    this.userSubject.next(null);

  }


  approve(code: String, username: String):Observable<ResponseModel> {
    const transferObject = {
        code: code,
        username: username
    }

    let header:HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    const object = JSON.stringify(transferObject);
    const self = this;  
  console.log("burada",transferObject)
    return this.http
      .post<ResponseModel>(this.valuesUrl+'login/approve',object,{headers: header})
      .pipe( 
       map((res) => res)
      );
  }


}
