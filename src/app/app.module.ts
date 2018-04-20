import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxElectronModule } from 'ngx-electron';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule,
      MatCheckboxModule,
      MatIconModule,
      MatAutocompleteModule,
      MatFormFieldModule, 
      MatSlideToggleModule, 
      MatInputModule,
      MatProgressBarModule,
      MatGridListModule,
      MatButtonToggleModule } from '@angular/material';

import { AppComponent } from './app.component';
import { PlayerComponent } from './sound-haven/player/player.component';
import { TrackService } from './sound-haven/services/tracks/track-service.service';
import { HeaderComponent } from './sound-haven/header/header.component';
import { AnimationComponent } from './sound-haven/animation/animation.component';


@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    HeaderComponent,
    AnimationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    NgxElectronModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatInputModule,
    MatProgressBarModule,
    MatGridListModule,
    MatButtonToggleModule,
  ],
  providers: [TrackService],
  bootstrap: [AppComponent]
})
export class AppModule { }
