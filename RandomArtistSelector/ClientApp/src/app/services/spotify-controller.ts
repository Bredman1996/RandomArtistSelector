import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgModel } from '@angular/forms';

@NgModule({

})

@Injectable()
export class SpotifyService {

  constructor(private http: HttpClient) { }

  getAuthorizationToken() {
    var response = this.http.get("https://accounts.spotify.com/authorize?client_id=71562cadc5b6485c8688378f5979bf5b&response_type=code&redirect_uri=https://localhost:44315/spotify");
    return response;
  }

}
