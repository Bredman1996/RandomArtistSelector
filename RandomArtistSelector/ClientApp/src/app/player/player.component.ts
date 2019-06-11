import { OnInit, Component } from "@angular/core";
import { StorageService } from "../services/storage.service";
import { SpotifyService } from "../services/spotify-controller";

@Component({
    selector: 'player',
    templateUrl: './player.component.html',
  })

export class PlayerComponent implements OnInit{
  public currentlyPlayingInfo: any;
  public timer: any;
  public selectedPlaylist: any;

  constructor(private readonly storageService: StorageService,
    private readonly spotifyService: SpotifyService){}

  ngOnInit(){
    
  }

  
  startPlaylist() {
    this.spotifyService.startPlaylist("api/spotify/PlayPlaylist", this.storageService.authToken, this.selectedPlaylist.uri).then(()=> {
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
}
