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

  constructor(private spotifyService: SpotifyService, @Inject('BASE_URL') baseUrl: string) {

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

  isAccessTokenInSession() {
    if (sessionStorage.accessToken) {
      return true;
    } else {
      return false;
    }
  }

  startPlaylist() {
    this.spotifyService.startPlaylist("api/spotify/PlayPlaylist", sessionStorage.accessToken, this.selectedPlaylist.uri).then(async ()=> {
      this.getCurrentlyPlaying();  
    });
  }

  pauseSong() {
    this.spotifyService.pause("api/spotify/Pause", sessionStorage.accessToken).subscribe();
  }

  async playSong() {
    await this.spotifyService.play("api/spotify/Play", sessionStorage.accessToken).then(async () => {
      this.getCurrentlyPlaying();  
    });
  }

  async goBack() {
    await this.spotifyService.goBack("api/spotify/GoBack", sessionStorage.accessToken).then( async ()=> {
      this.getCurrentlyPlaying();  
    });
  }

  async skip() {
    await this.spotifyService.skipSong("api/spotify/SkipSong", sessionStorage.accessToken).then(async () => {
      this.getCurrentlyPlaying();    
      });
  }

  getCurrentlyPlaying() {
    setTimeout(() => {
      this.spotifyService.getCurrentlyPlaying("api/spotify/GetCurrentlyPlaying", sessionStorage.accessToken).subscribe(result => {
        this.currentlyPlayingInfo = result;
      });
    }, 700)
  }
}
