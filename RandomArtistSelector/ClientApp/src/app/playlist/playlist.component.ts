import { Component, Inject, OnInit } from '@angular/core';
import { SpotifyService } from '../services/spotify-controller';
import { AccessTokenRequest } from '../Models/AccessTokenRequest';
import { PlaylistRequest } from '../Models/PlaylistRequest';
import { GetTracksRequest } from '../Models/GetTracksRequest';
import { PagedPlaylistRequest } from '../Models/PagedPlaylistRequest';

@Component({
  selector: 'playlist',
  templateUrl: './playlist.component.html',
})


export class PlaylistComponent implements OnInit {
  public request = new AccessTokenRequest("authorization_code", "", "https://localhost:44315/spotify", "71562cadc5b6485c8688378f5979bf5b", "14e2707243e44d8e8eb6b93c985c5ab9");
  public allPlaylists: any;
  public selectedPlaylist: any;
  public tracks: any;
  public currentlyPlayingInfo: any;
  public timer: any;
  public pagedPlaylists: any;
  public pagedPlaylistsLength: any;
  public isInited: boolean = false;

  constructor(private spotifyService: SpotifyService, @Inject('BASE_URL') baseUrl: string) {

  }

  ngOnInit() {
    this.getPagedUserPlaylists();
    this.getCurrentlyPlaying();
    this.isInited = true;
  }

  getAllUserPlaylists() {
    let request = new PlaylistRequest(sessionStorage.accessToken, sessionStorage.url);
    this.spotifyService.getAllUserPlaylists("api/spotify/GetAllUserPlaylists", request).subscribe(result => {
      this.allPlaylists = result;
    });
  }

  getPagedUserPlaylists(getUrl: string = sessionStorage.url + "/playlists") {
    let request = new PagedPlaylistRequest(sessionStorage.accessToken, sessionStorage.url, getUrl);
    this.spotifyService.getPagedUserPlaylists("api/spotify/GetPagedUserPlaylists", request).subscribe(result => {
      this.pagedPlaylists = result;
    });
  }

  getRandomPlaylist() {
    let request = new PlaylistRequest(sessionStorage.accessToken, sessionStorage.url);
    this.spotifyService.getAllUserPlaylists("api/spotify/GetAllUserPlaylists", request).subscribe(result => {
      this.allPlaylists = result;
      var ranNum = Math.floor(Math.random() * this.allPlaylists.length);
      this.selectedPlaylist = this.allPlaylists[ranNum];
      let request = new GetTracksRequest();
      request.playlistName = this.selectedPlaylist.name;
      request.playlistUrl = this.selectedPlaylist.href + "/tracks?offset=0&limit=15";
      request.authToken = sessionStorage.accessToken;
      this.spotifyService.getTracks("api/spotify/GetTracks", request).subscribe(result => {
        this.tracks = result;
      });
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

  getNextPlaylists() {
    this.getPagedUserPlaylists(this.pagedPlaylists.nextUrl);
  }

  getPreviousPlaylists() {
    this.getPagedUserPlaylists(this.pagedPlaylists.previousUrl);
  }

  isAccessTokenInSession() {
    if (sessionStorage.accessToken) {
      return true;
    } else {
      return false;
    }
  }

  startPlaylist() {
    this.spotifyService.startPlaylist("api/spotify/PlayPlaylist", sessionStorage.accessToken, this.selectedPlaylist.uri).then(()=> {
      this.getCurrentlyPlaying();  
    });
  }

  pauseSong() {
    this.spotifyService.pause("api/spotify/Pause", sessionStorage.accessToken).subscribe();
  }

  async playSong() {
    await this.spotifyService.play("api/spotify/Play", sessionStorage.accessToken).then( () => {
      this.getCurrentlyPlaying();  
    });
  }

  async goBack() {
    await this.spotifyService.goBack("api/spotify/GoBack", sessionStorage.accessToken).then( ()=> {
      this.getCurrentlyPlaying();  
    });
  }

  async skip() {
    await this.spotifyService.skipSong("api/spotify/SkipSong", sessionStorage.accessToken).then( () => {
      this.getCurrentlyPlaying();    
      });
  }

  getCurrentlyPlaying() {
    setTimeout(() => {
      this.spotifyService.getCurrentlyPlaying("api/spotify/GetCurrentlyPlaying", sessionStorage.accessToken).subscribe(result => {
        this.currentlyPlayingInfo = result;
        console.log(this.currentlyPlayingInfo.item.duration_ms);
        clearInterval(this.timer);
        this.timer = setInterval(() => { this.getCurrentlyPlaying() }, this.currentlyPlayingInfo.item.duration_ms);
      });
    }, 700);
  }
}
