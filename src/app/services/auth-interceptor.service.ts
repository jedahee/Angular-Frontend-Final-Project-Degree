import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string|null = localStorage.getItem('token_gestion_pistas');
    let request = req;

    if (token != null) {
      request = req.clone({
        setHeaders: {
          authorization: `Bearer ${ token }`
        }
      });
    }
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {

        if (err.status >= 400) {
          console.log(err)
        }

        return throwError( err );

      })
    );
  }
}
