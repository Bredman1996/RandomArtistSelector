import { Component, Inject } from '@angular/core';
import { SpotifyService } from '../services/spotify-controller';
import { AccessTokenRequest } from '../Models/AccessTokenRequest';
import { ActivatedRoute } from '@angular/router';
import { PlaylistRequest } from '../Models/PlaylistRequest';
import { GetTracksRequest } from '../Models/GetTracksRequest';
import { setInterval, clearInterval } from 'timers';

@Component({
  selector: 'playlist',
  templateUrl: './playlist.component.html',
})


export class PlaylistComponent{
  public request = new AccessTokenRequest("authorization_code", "", "https://localhost:44315/spotify", "71562cadc5b6485c8688378f5979bf5b", "14e2707243e44d8e8eb6b93c985c5ab9");
  public playlists: any;
  public selectedPlaylist: any;
  public tracks: any;
  public currentlyPlayingInfo: any;
  public timer: any;

  constructor(private spotifyService: SpotifyService, private route: ActivatedRoute, @Inject('BASE_URL') baseUrl: string) {
    if (!this.isAccessTokenInSession()) {
      if (this.isTokenPresent()) {
        spotifyService.getAccessToken(baseUrl + "api/spotify/GetUserInfo", this.request).subscribe(result => {
          sessionStorage.setItem('url', result["href"]);
          sessionStorage.setItem('accessToken', result["authToken"]);
        });
      }
    }
  }

  getUsersPlaylists() {
    let request = new PlaylistRequest(sessionStorage.accessToken, sessionStorage.url);
    this.spotifyService.getUsersPlaylists("api/spotify/GetUsersPlaylists", request).subscribe(result => {
      this.playlists = result;
    });
  }

  getRandomPlaylist() {
    var ranNum = Math.floor(Math.random() * this.playlists.length);
    this.selectedPlaylist = this.playlists[ranNum];
    let request = new GetTracksRequest();
    request.playlistName = this.selectedPlaylist.name;
    request.playlistUrl = this.selectedPlaylist.href + "/tracks?offset=0&limit=15";
    request.authToken = sessionStorage.accessToken;
    this.spotifyService.getTracks("api/spotify/GetTracks", request).subscribe(result => {
      this.tracks = result;
    });

  }

  getNextTracks() {
    let request = new GetTracksRequest();
    request.playlistName = this.selectedPlaylist.name;
    request.playlistUrl = this.tracks.nextUrl;
    request.authToken = sessionStorage.accessToken;
    this.spotifyService.getTracks("api/spotify/getTracks", request).subscribe(result => {
      this.tracks = result;
    })
  }

  getPreviousTracks() {
    let request = new GetTracksRequest();
    request.playlistName = this.selectedPlaylist.name;
    request.playlistUrl = this.tracks.previousUrl;
    request.authToken = sessionStorage.accessToken;
    this.spotifyService.getTracks("api/spotify/getTracks", request).subscribe(result => {
      this.tracks = result;
    })
  }


  isTokenPresent() {
    if (this.request.code === undefined) {
      return false;
    } else {
      return true;
    }
  }

  isAccessTokenInSession() {
    if (sessionStorage.accessToken) {
      return true;
    } else {
      return false;
    }
  }

  startPlaylist() {
    this.spotifyService.startPlaylist("api/spotify/PlayPlaylist", sessionStorage.accessToken, this.selectedPlaylist.uri).subscribe();
    this.timer = setInterval(() => {
      this.spotifyService.getCurrentlyPlaying("api/spotify/GetCurrentlyPlaying", sessionStorage.accessToken).subscribe(result => {
        this.currentlyPlayingInfo = result;
      });
    }, 1000);
  }

  pauseSong() {
    this.spotifyService.pause("api/spotify/Pause", sessionStorage.accessToken).subscribe();
    clearInterval(this.timer);
  }

  playSong() {
    this.spotifyService.goBack("api/spotify/Play", sessionStorage.accessToken).subscribe();
    this.timer = setInterval(() => {
      this.spotifyService.getCurrentlyPlaying("api/spotify/GetCurrentlyPlaying", sessionStorage.accessToken).subscribe(result => {
        this.currentlyPlayingInfo = result;
      });
    }, 1000);
  }

  skipSong() {
    this.spotifyService.skipSong("api/spotify/SkipSong", sessionStorage.accessToken).subscribe(result => {
      this.currentlyPlayingInfo = result;
    });
  }

  goBack() {
    this.spotifyService.goBack("api/spotify/GoBack", sessionStorage.accessToken).subscribe();
  }
}
