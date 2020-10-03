import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from '../models/activity';
import { ActivityCommentModel } from '../models/activity.comment.model';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NewActivityService {
  private valuesUrl = environment.apiBaseUrl
constructor(private _httpClient:HttpClient) { }



addActivity(activity:Activity): Observable<Activity> {
 
  let header:HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');

  const object = JSON.stringify(activity);
  return this._httpClient
    .post<Activity>(this.valuesUrl+"activity/",object,{headers: header})
    .pipe(
      map((res) => res),
      tap((x) => console.log("aktivite", x)) //bu pipe sadece log icin mi burak? #bb
    );
} 


deleteFile(filename){
  return this._httpClient.get(this.valuesUrl+'activity/deleteFile?filename='+filename )
  .subscribe((response) => {
       console.log('file deleted ', response);
  })
}


}


