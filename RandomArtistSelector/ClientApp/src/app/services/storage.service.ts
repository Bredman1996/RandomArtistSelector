import { Injectable } from "@angular/core";
import { Playlist } from "../Models/Playlist";

@Injectable()

  export class StorageService{
    private storageObject: StorageObject;  

    constructor(){
        if(!!localStorage.getItem('randomArtistSession')){
            this.storageObject = JSON.parse(localStorage.getItem("randomArtistSession"));
        }else{
            this.storageObject = new StorageObject;
        }
    }

    private saveStorage(){
        localStorage.setItem('randomArtistSession', JSON.stringify(this.storageObject));
    }

    public get userUrl(){
        return this.storageObject.userUrl;
    }

    public set userUrl(userUrl: string){
        this.storageObject.userUrl = userUrl;
        this.saveStorage();
    }

    public get authToken(){
        return this.storageObject.authToken;
    }

    public set authToken(authToken: string){
        this.storageObject.authToken = authToken;
        this.saveStorage();
    }

    public get selectedPlaylist(){
        return this.storageObject.selectedPlaylist;
    }

    public set selectedPlaylist(playlist: Playlist){
        this.storageObject.selectedPlaylist = playlist;
        this.saveStorage();
    }
  }

  class StorageObject{
    selectedPlaylist: Playlist;
    userUrl: string = "";
    authToken: string = "";
  }