import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from "@angular/core"

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(public toastr: ToastrService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
        .pipe(
            catchError((error: HttpErrorResponse) => {
                let errorMessage = '';
                if (error.error instanceof ErrorEvent) {
                    // client-side error
                    errorMessage = `Error: ${error.error.message}`;
                } else {                
                    // server-side error
                    switch(error.status){
                        case 400:
                            this.showError('The request had bad syntax or was inherently impossible to be satisfied!');
                            break;
                        case 401:
                            this.showError('Error Occurred! The request requires user authentication!');
                            break;
                        case 403:
                            this.showError('Forbidden! The request requires user authentication!');
                            break;
                        case 404:
                            this.showError('The server has not found anything matching the details given!');
                            break;
                        case 500:
                            this.showError('Unable to complete the request , please try again after sometime!');
                            break;
                        case 501:
                            this.showError('The server does not support this facility at this moment, please try again after sometime!');                        
                            break;
                        case 502:
                            this.showError('The server cannot process the request due to a high load!');
                            break;
                        default:
                            this.showError('Something went wrong. please try again after sometime!');
                        break; 
                    }
                    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                }
                return throwError(errorMessage);
            })
        )
    }

    showError(error) {
        this.toastr.error(error, 'Error');
    }
}