
import { Component, Inject } from '@angular/core';

import { SpotifyService } from '../services/spotify-controller'
import { ActivatedRoute } from '@angular/router';
import { AccessTokenRequest } from '../Models/AccessTokenRequest'

@Component({
  selector: 'spotify',
  templateUrl: './spotify-login.component.html'
})

export class SpotifyLoginComponent {
  public accessToken: any
  public userId: any
  request: AccessTokenRequest = {
    grant_type: "authorization_code",
    redirect_uri: "https://localhost:44315/spotify",
    code: "",
    client_id: "71562cadc5b6485c8688378f5979bf5b",
    client_secret: "14e2707243e44d8e8eb6b93c985c5ab9"
}

  constructor(private spotifyService: SpotifyService, private route: ActivatedRoute, @Inject('BASE_URL') baseUrl: string) {
    this.route.queryParams.subscribe(params => {
      this.request.code = params['code'];
    });
    if (this.isTokenPresent()) {
      spotifyService.getAccessToken(baseUrl + "api/spotify/GetAuthToken", this.request).subscribe(result => {
        this.accessToken = result;
      });
    }
  }

  getUserInfo(accessToken: string) {
    console.log(accessToken)
    this.spotifyService.getUserInfo("https://localhost:44315/api/spotify/GetUserId", accessToken).subscribe(result => {
      this.userId = result;
    });
  }

  isTokenPresent() {
    if (this.request.code === undefined) {
      return false;
    } else {
      return true;
    }
  }

}
