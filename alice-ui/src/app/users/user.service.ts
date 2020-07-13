import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Friend } from '../models/friend';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private valuesUrl = environment.apiBaseUrl + "users/getall";
  constructor(private _httpClient:HttpClient) { }
  getFriendList(): Observable<Friend[]> {
    return this._httpClient
      .get<Friend[]>(this.valuesUrl)
      .pipe(
        map((res) => res),
        tap((x) => console.log("userlar", x))
      );
  } 


}

