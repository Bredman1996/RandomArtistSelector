
import { Component, Inject } from '@angular/core';

import { SpotifyService } from '../services/spotify-controller';
import { ActivatedRoute } from '@angular/router';
import { AccessTokenRequest } from '../Models/AccessTokenRequest';
//import * as math from 'mathjs';


@Component({
  selector: 'spotify',
  templateUrl: './spotify-login.component.html',
  styleUrls: ['./spotify-login.component.css']
})

export class SpotifyLoginComponent {
  public request = new AccessTokenRequest("authorization_code", "", "https://localhost:44315/spotify", "71562cadc5b6485c8688378f5979bf5b", "14e2707243e44d8e8eb6b93c985c5ab9");

  constructor(private spotifyService: SpotifyService, private route: ActivatedRoute, @Inject('BASE_URL') baseUrl: string) {
    if (sessionStorage.accessToken) {
      window.location.assign(baseUrl + "playlist")
    } 
    this.route.queryParams.subscribe(params => {
      this.request.code = params['code'];
    });
    spotifyService.getAccessToken(baseUrl + "api/spotify/GetUserInfo", this.request).subscribe(result => {
      sessionStorage.setItem('url', result["href"]);
      sessionStorage.setItem('accessToken', result["authToken"]);
      window.location.assign(baseUrl + "playlist");
    });
  }
}
