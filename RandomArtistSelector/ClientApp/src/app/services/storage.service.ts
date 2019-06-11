import { Injectable } from "@angular/core";

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

    public get selectedPlaylistUri(){
        return this.storageObject.selectedPlaylistUri;
    }

    public set selectedPlaylistUri(selectedPlaylistUri: string){
        this.storageObject.selectedPlaylistUri = selectedPlaylistUri;
        this.saveStorage();
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
  }

  class StorageObject{
      selectedPlaylist: string = "";
      userUrl: string = "";
      authToken: string = "";
  }