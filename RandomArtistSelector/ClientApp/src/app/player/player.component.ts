import { OnInit, Component } from "@angular/core";
import { StorageService } from "../services/storage.service";
import { SpotifyService } from "../services/spotify-controller";
import { GetTracksRequest } from "../Models/GetTracksRequest";
import { Playlist } from "../Models/Playlist";
import { Router } from "@angular/router";

@Component({
    selector: 'player',
    templateUrl: './player.component.html',
  })

export class PlayerComponent implements OnInit{
  public currentlyPlayingInfo: any;
  public timer: any;
  public selectedPlaylist: Playlist;

  constructor(private readonly storageService: StorageService,
    private readonly spotifyService: SpotifyService,
    private readonly router: Router){}

  ngOnInit(){
    if(!!this.storageService.selectedPlaylist){
      this.selectedPlaylist = this.storageService.selectedPlaylist;
    }else{
      this.router.navigate(['/playlist']);
    }
    let request = new GetTracksRequest();
    request.playlistName = this.selectedPlaylist.Name;
    request.playlistUrl = this.selectedPlaylist.Href + "/tracks?offset=0&limit=15";
    request.authToken = this.storageService.authToken;
    this.spotifyService.getTracks("api/spotify/GetTracks", request).subscribe(result => { 
      this.convertTracksResultToTracksObject(result);
    });
    this.startPlaylist();
  }

  getNextTracks() {
    let request = new GetTracksRequest();
    request.playlistName = this.selectedPlaylist.Name;
    request.playlistUrl = this.selectedPlaylist.NextTrackUrl;
    request.authToken = this.storageService.authToken;
    this.spotifyService.getTracks("api/spotify/getTracks", request).subscribe(result => {
      this.convertTracksResultToTracksObject(result);
    });
  }

  getPreviousTracks() {
    let request = new GetTracksRequest();
    request.playlistName = this.selectedPlaylist.Name;
    request.playlistUrl = this.selectedPlaylist.PreviousTrackUrl;
    request.authToken = this.storageService.authToken;
    this.spotifyService.getTracks("api/spotify/getTracks", request).subscribe(result => {
      this.convertTracksResultToTracksObject(result);
    });
  }

  
  startPlaylist() {
    this.spotifyService.startPlaylist("api/spotify/PlayPlaylist", this.storageService.authToken, this.selectedPlaylist.Uri).then(()=> {
      this.getCurrentlyPlaying();  
    });
  }

  pauseSong() {
    this.spotifyService.pause("api/spotify/Pause", this.storageService.authToken).subscribe();
  }

  async playSong() {
    await this.spotifyService.play("api/spotify/Play", this.storageService.authToken).then( () => {
      this.getCurrentlyPlaying();  
    });
  }

  async goBack() {
    await this.spotifyService.goBack("api/spotify/GoBack", this.storageService.authToken).then( ()=> {
      this.getCurrentlyPlaying();  
    });
  }

  async skip() {
    await this.spotifyService.skipSong("api/spotify/SkipSong", this.storageService.authToken).then( () => {
      this.getCurrentlyPlaying();    
      });
  }

  getCurrentlyPlaying() {
    setTimeout(() => {
      this.spotifyService.getCurrentlyPlaying("api/spotify/GetCurrentlyPlaying", this.storageService.authToken).subscribe(result => {
        this.currentlyPlayingInfo = result;
        console.log(this.currentlyPlayingInfo.item.duration_ms);
        clearInterval(this.timer);
        this.timer = setInterval(() => { this.getCurrentlyPlaying() }, this.currentlyPlayingInfo.item.duration_ms);
      });
    }, 700);
  }

  convertTracksResultToTracksObject(result:Object){
    this.selectedPlaylist.Tracks = result["Tracks"];
    this.selectedPlaylist.NextTrackUrl = result["nextUrl"];
    this.selectedPlaylist.PreviousTrackUrl = result["previousUrl"];
  }

}
