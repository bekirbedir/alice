import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Activity } from '../models/activity';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
 
  private valuesUrl = environment.apiBaseUrl + "activity/getall";
  
  constructor(private _httpClient:HttpClient) { }
  getActivityList(): Observable<Activity[]> {
    console.log("act-bura");
    return this._httpClient
      .get<Activity[]>(this.valuesUrl)
      .pipe(
        map((res) => res),
        tap((x) => console.log("aktiviteler", x))
      );
  } 


}

