import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Friend } from '../models/friend';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { CommunicationMessages } from '../auth/communication';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private valuesUrl = environment.apiBaseUrl

  constructor(private httpClient:HttpClient) { }
 
  showCaptchaResponse():Observable<any>{
    const transferObject = {
      secret: "6LfbtNgZAAAAACcP8pXNd3T3pYXq1j1IjrW7eSYw", 
      response:"6LfbtNgZAAAAAHyU44M70pcVFzU360FOLWNfRzPr"
    }

    let header:HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    const object = JSON.stringify(transferObject);
    
    return this.httpClient
    .post<any>("https://www.google.com/recaptcha/api/siteverify",transferObject,{headers:transferObject})
    .pipe(
      map((res) => res),
    );
  
  }

  showCaptchaResponseForUserVerify():Observable<any>{
    const transferObject = {
      secret: "6LfbtNgZAAAAACcP8pXNd3T3pYXq1j1IjrW7eSYw", 
      response:"6LfbtNgZAAAAAHyU44M70pcVFzU360FOLWNfRzPr"
    }

    let header:HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    const object = JSON.stringify(transferObject);
    
    return this.httpClient
    .get<any>("https://www.google.com/recaptcha/api2/userverify?k="+transferObject.secret,{headers: header})
    .pipe(
      map((res) => res),
    );
  
  }
  
  createInfo(mail: String,firstname: String,lastname: String,eMail: String,phone: String,comment: String):Observable<ResponseModel>{
  let header:HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
  const transferObject = {
    firstname: firstname,
    lastname: lastname,
    eMail: eMail,
    phone: phone,
    mail: mail,
    comment: comment
  }

  const object = JSON.stringify(transferObject);
  console.log(mail);
  return this.httpClient
  .post<ResponseModel>(this.valuesUrl+'communication/createInfo',object,{headers: header})
  .pipe(
    map((res) => res),
  );
  }
}



