import { Component, OnInit } from '@angular/core';
import { TrackService } from '../services/tracks/track-service.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
   
  public tDisplay: string = '0:00';
  public tDuration: string = '0:00';
  public trackName: string;
  public trackPlaying: boolean = false;
  public trackListVisible: boolean = false;

  constructor(private _trackService: TrackService) {};

  ngOnInit() {};
  
  public playSong(){
    console.log('Play called');
    this._trackService.play();
    this.trackPlaying = true; 
    this.display();
  }

  public pauseSong(){
    console.log('Pause called');
    this._trackService.pause();
    this.trackPlaying = false;
  }

  public stopSong(){
    console.log('Stop called');
    this._trackService.stop();
    this.trackPlaying = false;
  }

  public playNext(){
    console.log("Next called");
    this._trackService.next();
    this.display();
  }

  public playPrev(){
    console.log("Prev called");
    this._trackService.prev();
    this.display();
  }

  public shuffle(){
    this._trackService.stop();
    console.log("Shuffle called");
    this.trackPlaying = true;
    this._trackService.shuffle();
    this._trackService.play();
    this.display();
  }

  public display(){
    this.trackName = this._trackService.getTrackName();
    this.tDuration= this._trackService.returnTotalDuration();
    setInterval(() => {
      this.tDisplay = this._trackService.returnCurrentDuration();
      this.tDuration= this._trackService.returnTotalDuration();
    }, 1000);
  }
}
