import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from '../models/activity';
import { map, tap } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { ResponseModel } from '../models/response.model';
// in bytes, compress images larger than 1MB
const fileSizeMax = 1 * 512 * 512
// in pixels, compress images have the width or height larger than 1024px
const widthHeightMax = 512
const defaultWidthHeightRatio = 1
const defaultQualityRatio = 0.7
@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  private valuesUrl = environment.apiBaseUrl + "users/";

  constructor(private _httpClient: HttpClient) { }

  getMyProfil(id): Observable<UserModel> {
    console.log("servise geldi - userApprove")
    const transferObject = {
      Id: id
    }
    let header: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    const object = JSON.stringify(transferObject);
    return this._httpClient
      .post<UserModel>(this.valuesUrl + "detail", object, { headers: header })
      .pipe(
        map((res) => res)
      );
  }


  updateUserPhoto(userId, photo) {
    console.log("servise geldi - updateUser")
    const transferObject = {
      userId: userId,
      base64: photo
    }
    let header: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    const object = JSON.stringify(transferObject);
    return this._httpClient
      .post<UserModel>(this.valuesUrl + "updateUserPhoto", object, { headers: header })
      .pipe(
        map((res) => res)
      );
  }
  userApprove(user: UserModel): Observable<ResponseModel> {

    const transferObject = user;


    let header: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    const object = JSON.stringify(transferObject);
    const self = this;
    return this._httpClient
      .post<ResponseModel>(this.valuesUrl + "userApprove", object, { headers: header })
      .pipe(
        map((res) => res),
      );
  }
  updateUser(user: UserModel): Observable<ResponseModel> {

    const transferObject = user;


    let header: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    const object = JSON.stringify(transferObject);
    const self = this;
    return this._httpClient
      .put<ResponseModel>(this.valuesUrl + "updateUser", object, { headers: header })
      .pipe(
        map((res) => res),
      );
  }

  savePassword(username:String,currentPassword:String, password:String , repeatPassword: String): Observable<ResponseModel> {

    const transferObject = {
      username:username,
      currentPassword:currentPassword,
      password:password,
      repeatPassword:repeatPassword
    };


    let header: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    const object = JSON.stringify(transferObject);
    const self = this;
    return this._httpClient
      .post<ResponseModel>(this.valuesUrl + "savePassword", object, { headers: header })
      .pipe(
        map((res) => res),
      );
  }
  userReject(user: UserModel): Observable<ResponseModel> {
    const transferObject = user;


    let header: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json');
    const object = JSON.stringify(transferObject);
    const self = this;
    return this._httpClient
      .post<ResponseModel>(this.valuesUrl + "userReject", object, { headers: header })
      .pipe(
        map((res) => res),
      );
  }





  compress(file: File): Observable<File> {
    const imageType = file.type || 'image/jpeg'
    const reader = new FileReader()
    reader.readAsDataURL(file)

    return Observable.create(observer => {
      // This event is triggered each time the reading operation is successfully completed.
      reader.onload = ev => {
        // Create an html image element
        const img = this.createImage(ev)
        // Choose the side (width or height) that longer than the other
        const imgWH = img.width > img.height ? img.width : img.height

        // Determines the ratios to compress the image
        let withHeightRatio = (imgWH > widthHeightMax) ? widthHeightMax/imgWH : defaultWidthHeightRatio
        let qualityRatio = (file.size > fileSizeMax) ? fileSizeMax/file.size : defaultQualityRatio

        // Fires immediately after the browser loads the object
        img.onload = () => { 
          const elem = document.createElement('canvas')
          // resize width, height
          elem.width = img.width * withHeightRatio
          elem.height = img.height * withHeightRatio

          const ctx = <CanvasRenderingContext2D>elem.getContext('2d')
          ctx.drawImage(img, 0, 0, elem.width, elem.height)
          ctx.canvas.toBlob(
            // callback, called when blob created
            blob => { 
              observer.next(new File(
                [blob],
                file.name,
                {
                  type: imageType,
                  lastModified: Date.now(),
                }
              ))
            },
            imageType,
            qualityRatio, // reduce image quantity 
          )
        }
      }

      // Catch errors when reading file
      reader.onerror = error => observer.error(error)
    })
  }

  private createImage(ev) {
    let imageContent = ev.target.result
    const img = new Image()
    img.src = imageContent
    return img
  }
}


