import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccessTokenRequest } from '../Models/AccessTokenRequest'
import { PlaylistRequest } from '../Models/PlaylistRequest';
import { GetTracksRequest } from '../Models/GetTracksRequest';

@Injectable()
export class SpotifyService {


  constructor(private http: HttpClient) { }


  getAccessToken(url: string, request: AccessTokenRequest) {
    return this.http.post(url, request);
  }

  getUserInfo(url: string, authToken: string) {
    return this.http.get(url + "?authToken=" + authToken);
  }

  getUsersPlaylists(url: string, request: PlaylistRequest) {
    return this.http.post(url, request);
  }

  getTracks(url: string, request: GetTracksRequest) {
    return this.http.post(url, request);
  }

  getCurrentlyPlaying(url: string, authToken: string) {
    return this.http.get(url + "?authToken=" + authToken);
  }

  skipSong(url: string, authToken: string) {
    return this.http.get(url + "?authToken=" + authToken);
  }

  play(url: string, authToken: string) {
    return this.http.get(url + "?authToken=" + authToken);
  }

  pause(url: string, authToken: string) {
    return this.http.get(url + "?authToken=" + authToken);
  }

  goBack(url: string, authToken: string) {
    return this.http.get(url + "?authToken=" + authToken);
  }

  startPlaylist(url: string, authToken: string, playlistUri: string) {
    return this.http.get(url + "?authToken=" + authToken + "&uri=" + playlistUri);
  }
}

