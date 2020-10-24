import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with jwt token if available
    const aliceuser = JSON.parse(localStorage.getItem('aliceuser'));

    if (aliceuser) {
      
      request = request.clone({
        setHeaders: {
        Authorization: `Bearer ${aliceuser}`
        }
      });

    
    }

    return next.handle(request);
  }
  
}
