import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';

import { SpotifyService } from '../services/spotify-controller'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'spotify',
  templateUrl: './spotify.component.html'
})

export class SpotifyComponent {
  public token: any

  constructor(private spotifyService: SpotifyService/*, private route: ActivatedRoute*/) {
    this.route.queryParams.subscribe(params => {
      let code = params['code'];
      console.log(code);
    });
  }

  getAuthorizationToken() {
    this.spotifyService.getAuthorizationToken().subscribe(result => {
      this.token = result
    })
  }

}
