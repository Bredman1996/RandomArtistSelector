import { Component, Inject, OnInit } from '@angular/core';
import { SpotifyService } from '../services/spotify-controller';
import { AccessTokenRequest } from '../Models/AccessTokenRequest';
import { PlaylistRequest } from '../Models/PlaylistRequest';
import { PagedPlaylistRequest } from '../Models/PagedPlaylistRequest';
import { StorageService } from '../services/storage.service';
import { Playlist } from '../Models/Playlist';
import { Router } from '@angular/router';

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
     @Inject('BASE_URL') baseUrl: string,
     private readonly router: Router) {

  }

  ngOnInit() {
    this.selectedPlaylist = this.storageService.selectedPlaylist || new Playlist();
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
      this.selectedPlaylist.Uri = playlist["uri"];
      });
  }

  getNextPlaylists() {
    this.getPagedUserPlaylists(this.pagedPlaylists.nextUrl);
  }

  getPreviousPlaylists() {
    this.getPagedUserPlaylists(this.pagedPlaylists.previousUrl);
  }

  startPlaylist() {
    this.storageService.selectedPlaylist = this.selectedPlaylist;
    this.router.navigate(['/player']);
  }
  
  isAccessTokenInSession() {
    if (this.storageService.authToken) {
      return true;
    } else {
      return false;
    }
  }
}
