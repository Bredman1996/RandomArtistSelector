import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccessTokenRequest } from '../Models/AccessTokenRequest'


@Injectable()
export class SpotifyService {


  constructor(private http: HttpClient) { }


  getAccessToken(url: string, request: AccessTokenRequest) {
    return this.http.post(url, request);
  }

  getUserInfo(url: string, authToken: string) {
    return this.http.get(url + "?authToken=" + authToken);
  }

}
