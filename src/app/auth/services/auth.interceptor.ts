import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  /**
   * @constructor
   */
  constructor() {}


  /**
   * Intercept requests and add headers
   *
   * @param {HttpRequest<any>} req
   * @param {HttpHandler} next
   *
   * @returns {Observable<HttpEvent<any>>} cloned request with headers
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      let token = localStorage.getItem('access_token');
      
      // Add headers to cloned request
      const copiedReq = req.clone({
          headers: new HttpHeaders({
              'X-Requested-With': 'XMLHttpRequest',
              'Authorization': 'Bearer '+token,
          }),
      });

      return next.handle(copiedReq);
  }
}
