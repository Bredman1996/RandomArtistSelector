
import { Component, Inject } from '@angular/core';

import { SpotifyService } from '../services/spotify-controller';
import { ActivatedRoute } from '@angular/router';
import { AccessTokenRequest } from '../Models/AccessTokenRequest';
import { StorageService } from '../services/storage.service';


@Component({
  selector: 'spotify',
  templateUrl: './spotify-login.component.html',
  styleUrls: ['./spotify-login.component.css']
})

export class SpotifyLoginComponent {
  public request = new AccessTokenRequest("authorization_code", "", "https://localhost:44315/spotify", "71562cadc5b6485c8688378f5979bf5b", "14e2707243e44d8e8eb6b93c985c5ab9");

  constructor(private readonly spotifyService: SpotifyService, 
    private readonly route: ActivatedRoute,
    private readonly storageService: StorageService,  
    @Inject('BASE_URL') baseUrl: string) {
    if (sessionStorage.accessToken) {
      window.location.assign(baseUrl + "playlist")
    }
      this.route.queryParams.subscribe(params => {
        this.request.code = params['code'];
    });
    if (this.request.code) {
      spotifyService.getAccessToken(baseUrl + "api/spotify/GetUserInfo", this.request).subscribe(result => {
        this.storageService.userUrl = result["href"];
        this.storageService.authToken = result["authToken"];
        window.location.assign(baseUrl + "playlist");
      });
    }
  }
}
