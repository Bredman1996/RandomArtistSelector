import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  public genres: Genre[];

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    http.get<Genre[]>(baseUrl + 'api/Artist/Genres').subscribe(result => {
      this.genres = result;
    }, error => console.error(error));
  }
  getRandom(artists) {
    var p = document.getElementById("RandomBand");
    p.textContent = artists[Math.floor(Math.random() * artists.length)].name
  }
}


interface Genre {
  name: string;
  subGenres: string[];
}

