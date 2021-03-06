import { Injectable } from '@angular/core';
import { AccessTokenRequest } from '../Models/AccessTokenRequest'
import { PlaylistRequest } from '../Models/PlaylistRequest';
import { GetTracksRequest } from '../Models/GetTracksRequest';
import { CustomHttpService } from './customer-http-service';
import { PagedPlaylistRequest } from '../Models/PagedPlaylistRequest';
import { Track } from '../Models/Track';
import { GetTracksResponse } from '../Models/GetTracksResponse';

@Injectable()
export class SpotifyService {


  constructor(private http: CustomHttpService) { }


  getAccessToken(url: string, request: AccessTokenRequest) {
    return this.http.post(url, request);
  }

  getUserInfo(url: string, authToken: string) {
    return this.http.get(url + "?authToken=" + authToken);
  }

  getAllUserPlaylists(url: string, request: PlaylistRequest) {
    return this.http.post(url, request);
  }

  getPagedUserPlaylists(url: string, request: PagedPlaylistRequest) {
    return this.http.post(url, request);
  }

  getTracks(url: string, request: GetTracksRequest){
    return this.http.post(url, request);
  }

 getCurrentlyPlaying(url: string, authToken: string) {
    return this.http.get(url + "?authToken=" + authToken);
  }

 skipSong(url: string, authToken: string): Promise<any> {
    return this.http.awaitableGet(url + "?authToken=" + authToken);
  }

   play(url: string, authToken: string): Promise<any> {
    return this.http.awaitableGet(url + "?authToken=" + authToken);
  }

   pause(url: string, authToken: string) {
    return this.http.get(url + "?authToken=" + authToken);
  }

   goBack(url: string, authToken: string): Promise<any> {
    return this.http.awaitableGet(url + "?authToken=" + authToken);
  }

  startPlaylist(url: string, authToken: string, playlistUri: string): Promise<any> {
    return this.http.awaitableGet(url + "?authToken=" + authToken + "&uri=" + playlistUri);
  }
}

