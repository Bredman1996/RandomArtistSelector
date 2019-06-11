import { Component, Inject, OnInit } from '@angular/core';
import { SpotifyService } from '../services/spotify-controller';
import { AccessTokenRequest } from '../Models/AccessTokenRequest';
import { PlaylistRequest } from '../Models/PlaylistRequest';
import { GetTracksRequest } from '../Models/GetTracksRequest';
import { PagedPlaylistRequest } from '../Models/PagedPlaylistRequest';
import { StorageService } from '../services/storage.service';
import { Playlist } from '../Models/Playlist';
import { forEach } from '@angular/router/src/utils/collection';
import { Track } from '../Models/Track';

@Component({
  selector: 'playlist',
  templateUrl: './playlist.component.html',
})


export class PlaylistComponent implements OnInit {
  public request = new AccessTokenRequest("authorization_code", "", "https://localhost:44315/spotify", "71562cadc5b6485c8688378f5979bf5b", "14e2707243e44d8e8eb6b93c985c5ab9");
  public allPlaylists: any;
  public selectedPlaylist: Playlist;
  public tracks: any;

  public pagedPlaylists: any;
  public pagedPlaylistsLength: any;
  public isInited: boolean = false;

  constructor(private readonly storageService: StorageService
     ,private readonly spotifyService: SpotifyService, 
     @Inject('BASE_URL') baseUrl: string) {

  }

  ngOnInit() {
    this.selectedPlaylist = new Playlist();
    this.getPagedUserPlaylists();
    this.isInited = true;
  }

  getAllUserPlaylists() {
    let request = new PlaylistRequest(this.storageService.authToken, this.storageService.userUrl);
    this.spotifyService.getAllUserPlaylists("api/spotify/GetAllUserPlaylists", request).subscribe(result => {
      this.allPlaylists = result;
    });
  }

  getPagedUserPlaylists(getUrl: string = this.storageService.userUrl + "/playlists") {
    let request = new PagedPlaylistRequest(this.storageService.authToken, this.storageService.userUrl, getUrl);
    this.spotifyService.getPagedUserPlaylists("api/spotify/GetPagedUserPlaylists", request).subscribe(result => {
      this.pagedPlaylists = result;
    });
  }

  getRandomPlaylist() {
    let request = new PlaylistRequest(this.storageService.authToken, this.storageService.userUrl);
    this.spotifyService.getAllUserPlaylists("api/spotify/GetAllUserPlaylists", request).subscribe(result => {
      this.allPlaylists = result;
      var ranNum = Math.floor(Math.random() * this.allPlaylists.length);
      let playlist = this.allPlaylists[ranNum];
      this.selectedPlaylist.Href = playlist["href"];
      this.selectedPlaylist.Name = playlist["name"];
      let request = new GetTracksRequest();
      request.playlistName = this.selectedPlaylist.Name;
      request.playlistUrl = this.selectedPlaylist.Href + "/tracks?offset=0&limit=15";
      request.authToken = this.storageService.authToken;
      var tracksResponse = this.spotifyService.getTracks("api/spotify/GetTracks", request);
      this.selectedPlaylist.Tracks = tracksResponse.Tracks;
      this.selectedPlaylist.NextTrackUrl = tracksResponse.NextTrackUrl;
      this.selectedPlaylist.PreviousTrackUrl = tracksResponse.PreviousTrackUrl;
      });
  }

  getNextTracks() {
    let request = new GetTracksRequest();
    request.playlistName = this.selectedPlaylist.Name;
    request.playlistUrl = this.selectedPlaylist.NextTrackUrl;
    request.authToken = this.storageService.authToken;
    this.spotifyService.getTracks("api/spotify/getTracks", request).subscribe(result => {
      this.tracks = result;
    })
  }

  getPreviousTracks() {
    let request = new GetTracksRequest();
    request.playlistName = this.selectedPlaylist.name;
    request.playlistUrl = this.tracks.previousUrl;
    request.authToken = this.storageService.authToken;
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

  startPlaylist() {
    
  }


  isAccessTokenInSession() {
    if (this.storageService.authToken) {
      return true;
    } else {
      return false;
    }
  }
}
