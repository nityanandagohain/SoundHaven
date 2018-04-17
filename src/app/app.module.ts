import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxElectronModule } from 'ngx-electron';

import { AppComponent } from './app.component';
import { PlayerComponent } from './sound-haven/player/player.component';
import { TrackService } from './sound-haven/services/tracks/track-service.service';


@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent
  ],
  imports: [
    BrowserModule,
    NgxElectronModule
  ],
  providers: [TrackService],
  bootstrap: [AppComponent]
})
export class AppModule { }
