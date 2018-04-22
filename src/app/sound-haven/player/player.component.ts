import { Component, OnInit, Input, HostListener } from '@angular/core';
import { TrackService } from '../services/tracks/track-service.service';
import { AnimationComponent } from '../animation/animation.component';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  @Input() animation: AnimationComponent;

  public tDisplay: string = '0:00';
  public tDuration: string = '0:00';
  public trackName: string = "No songs to play";
  public trackPlaying: boolean = false;
  public trackListVisible: boolean = false;
  public shuffletoggle: boolean = false;
  public mute: boolean = false;
  public value: number;

  constructor(private _trackService: TrackService) { };

  ngOnInit() { };

  pitch(event: any) {
    console.log(event.value);
    this._trackService.setVolume(event.value);
  }

  public playSong() {
    console.log('Play called');
    let x = this._trackService.play();
    if (x != -1) {
      this.animation.toggle();
      this.trackPlaying = true;
      this.display();
    }
    this.checkSongProgress();
  }

  public pauseSong() {
    console.log('Pause called');
    this.animation.toggle();
    this._trackService.pause();
    this.trackPlaying = false;
  }

  public stopSong() {
    console.log('Stop called');
    this._trackService.stop();
    this.trackPlaying = false;
  }

  public playNext() {
    console.log("Next called");
    if (this.shuffletoggle == true) {
      this.shuffle();
    }
    else {
      let x = this._trackService.next();
      if (x != -1) {
        this.display();
      }
    }
    this.checkSongProgress();
  }

  public playPrev() {
    console.log("Prev called");
    if (this.shuffletoggle == true) {
      let x = this._trackService.prevshuffle();
      if (x != -1) {
        this.display();
      }
    }
    else {
      let x = this._trackService.prev();
      if (x != -1) {
        this.display();
      }
    }
  }

  public shuffleclick() {
    console.log("Shuffle is toggled");
    this.shuffletoggle = !this.shuffletoggle;
  }

  public shuffle() {
    this._trackService.stop();
    console.log("Shuffle called");
    this.trackPlaying = true;
    this._trackService.shuffle();
    this._trackService.play();
    this.display();
  }

  public display() {
    this.trackName = this._trackService.getTrackName();
    this.tDuration = this._trackService.returnTotalDuration();
    setInterval(() => {
      this.tDisplay = this._trackService.returnCurrentDuration();
      this.tDuration = this._trackService.returnTotalDuration();
      this.value = this._trackService.getWidth();
    }, 1000);
  }

  public seekTo = (event) => {
    this._trackService.seekTo(event.value);
  }

  public checkSongProgress(){
    this._trackService.song.on('end', () => {
      console.log("Finished");
      this.playNext();
    });
  }

  public playPause = () => {
    if (this.trackPlaying) {
      this.pauseSong();
    } else {
      this.playSong();
    }
  }

  public muteVol = () => {
    this.mute = !this.mute;
    this._trackService.volMute();
  }
}
