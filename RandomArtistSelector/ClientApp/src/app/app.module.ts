import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { SpotifyLoginComponent } from './spotify/spotify-login.component';
import { SpotifyService } from './services/spotify-controller';
import { NgxPaginationModule } from 'ngx-pagination';
import { PlaylistComponent } from './playlist/playlist.component';
import { CustomHttpService } from './services/customer-http-service';
import { StorageService } from './services/storage.service';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    FetchDataComponent,
    SpotifyLoginComponent,
    PlaylistComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    RouterModule.forRoot([
      { path: '', component: FetchDataComponent },
      { path: 'spotify', component: SpotifyLoginComponent },
      { path: 'playlist', component: PlaylistComponent }
    ])
  ],
  providers: [SpotifyService, CustomHttpService, StorageService], 
  bootstrap: [AppComponent]
})
export class AppModule { }
