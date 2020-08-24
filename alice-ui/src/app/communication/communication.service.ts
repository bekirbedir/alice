import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Friend } from '../models/friend';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { CommunicationMessages } from '../auth/communication';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private valuesUrl = environment.apiBaseUrl

  constructor(private httpClient:HttpClient) { }
 
  createInfo(mail: String,firstname: String,lastname: String,eMail: String,phone: String,comment: String):Observable<any>{
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
  .post<any>(this.valuesUrl+'communication/createInfo',object,{headers: header})
  .pipe(
    map((res) => res),
  );
  }
}



