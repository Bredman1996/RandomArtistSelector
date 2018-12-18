import { Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class CustomHttpService extends HttpClient {

  constructor(handler: HttpHandler) {
    super(handler);
  }


  public awaitableGet(url): Promise<any> {
    return new Promise<any>((resolveFn, rejectFn) => {
      this.get(url).subscribe((successResponse: any) => {
        resolveFn(successResponse);
      },
        (errorResponse: HttpErrorResponse) => {
          if (errorResponse.status === 400) {
            let validationErrors = errorResponse.error.errors;
            if (validationErrors) {
              if (validationErrors === 1) {
                alert(validationErrors)[0];
              } else {
                alert(validationErrors.join("\r\n"))
              }
              return;
            }
          }
        });
    });
  }

}
