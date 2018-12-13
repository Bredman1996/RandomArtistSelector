
import { Component, Inject } from '@angular/core';

import { SpotifyService } from '../services/spotify-controller';
import { ActivatedRoute } from '@angular/router';
import { AccessTokenRequest } from '../Models/AccessTokenRequest';
import { PlaylistRequest } from '../Models/PlaylistRequest';
import * as math from 'mathjs';


@Component({
  selector: 'spotify',
  templateUrl: './spotify-login.component.html',
  styleUrls: ['./spotify-login.component.css']
})

export class SpotifyLoginComponent {
  request = new AccessTokenRequest("authorization_code", "", "https://localhost:44315/spotify", "71562cadc5b6485c8688378f5979bf5b", "14e2707243e44d8e8eb6b93c985c5ab9");
  playlists: any;

  constructor(private spotifyService: SpotifyService, private route: ActivatedRoute, @Inject('BASE_URL') baseUrl: string) {
    this.route.queryParams.subscribe(params => {
      this.request.code = params['code'];
    });
    if (this.isTokenPresent()) {
      spotifyService.getAccessToken(baseUrl + "api/spotify/GetUserInfo", this.request).subscribe(result => {
        sessionStorage.setItem('url', result["href"]);
        sessionStorage.setItem('accessToken', result["authToken"]);
        console.log(result);
      });
      console.log(this);
    }
  }

  getUsersPlaylists() {
    let request = new PlaylistRequest(sessionStorage.accessToken, sessionStorage.url);
    this.spotifyService.getUsersPlaylists("api/spotify/GetUsersPlaylists", request).subscribe(result => {
      this.playlists = result;
    });
  }

  getPageSize(number: any) {
    for (let i = 10; i < number; i++)
      if (math.mod(number, i) === 0) {
        console.log(i);
        return (math.mod(number, i));
      } 
  }

  setPageSize(number: any) {
    document.getElementById("paginating").setAttribute("paginate.itemsPerPage", this.getPageSize(number));
  }

  isTokenPresent() {
    if (this.request.code === undefined) {
      return false;
    } else {
      return true;
    }
  }

}
