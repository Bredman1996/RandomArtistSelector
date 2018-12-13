
import { Component, Inject } from '@angular/core';

import { SpotifyService } from '../services/spotify-controller'
import { ActivatedRoute } from '@angular/router';
import { AccessTokenRequest } from '../Models/AccessTokenRequest'
import { SpotifyUser } from '../Models/SpotifyUser';

@Component({
  selector: 'spotify',
  templateUrl: './spotify-login.component.html'
})

export class SpotifyLoginComponent {
  model: SpotifyUser = {
    userId: "",
    request: new AccessTokenRequest("authorization_code", "", "https://localhost:44315/spotify", "71562cadc5b6485c8688378f5979bf5b", "14e2707243e44d8e8eb6b93c985c5ab9"),
    url:""
  }
  playlists: string[]

  constructor(private spotifyService: SpotifyService, private route: ActivatedRoute, @Inject('BASE_URL') baseUrl: string) {
    this.route.queryParams.subscribe(params => {
      this.model.request.code = params['code'];
    });
    if (this.isTokenPresent()) {
      spotifyService.getAccessToken(baseUrl + "api/spotify/GetUserInfo", this.model.request).subscribe(result => {
        this.model.userId = result["id"];
        this.model.url = result["href"];
      });
    }
    console.log(this.model)
  }

  getUsersPlaylists(url: any) {
    this.spotifyService.getUsersPlaylists(url, this.)
  }

  isTokenPresent() {
    if (this.model.request.code === undefined) {
      return false;
    } else {
      return true;
    }
  }

}
