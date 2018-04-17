import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Howl } from 'howler';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  
  public tDisplay : string;
  public tDuration : string;
  public trackName: string;
  public trackNo: number;

  public song: Howl; 

  public trackPlaying: boolean = false;
  public trackListVisible: boolean = false;
 // public timer: string = "0.00";
  public trackList: any = [];      //file: && howl :

  private currentIndex: number = 0; //Index of the track which is playing


  constructor(private _electronService: ElectronService, private chRef: ChangeDetectorRef) {

      const ipc = this._electronService.ipcRenderer;

      ipc.on('mp3-file', (event, arg) => {                    //recieve contents from win.webcontents() via ipcRenderer
          console.log(arg);
          for(let i=0; i< arg.length; i++){
            this.trackList.push({file: arg[i], howl: null});
          }
          this.chRef.detectChanges();
      });

  }
  ngOnInit() {

  }
  public playSong(){
    console.log('Play called');
    this.play(this.currentIndex);
    this.trackPlaying = true; 
  }

  public pauseSong(){
    console.log('Pause called');
    this.pause();
    this.trackPlaying = false;
  }

  public stopSong(){
    console.log('Stop called');
    this.stop();
    this.trackPlaying = false;
  }

  public playNext(){
    console.log("Next called");
    this.next(this.currentIndex);
  }

  public playPrev(){
    console.log("Prev called");
    this.prev(this.currentIndex);
  }

  public shuffle(){
    this.stop();
    console.log("Shuffle called");
    this.trackPlaying = true;
    this.play(this.currentIndex = Math.floor(Math.random() * this.trackList.length));
  }

  public display(){
    setInterval(() => {
      this.tDisplay = this.formatTime(this.song.seek());
    }, 1000);
    var sym = (this.trackList[this.trackNo].file).lastIndexOf('/');
    this.trackName = (this.trackList[this.trackNo].file).substring(sym+1);
  }

  private play = (index) => {
    if(!this.trackList.length){
      console.log("No songs to play");
      let notification = new Notification('SoundHaven',{
        body: 'No songs to play'
      })
      return;      
    }else if(this.trackList[index].howl == null){
      this.trackNo = index;
      this.song = this.trackList[index].howl = new Howl({
        src: [this.trackList[index].file],
        onload: () => {
          this.tDuration = this.formatTime(Math.round(this.song.duration()));
        }
      })
    }else{
      this.song = this.trackList[index].howl;
    }
    this.display();
    this.song.play();
  }

  private pause = () => {
    if(this.song){
      this.song.pause();
    }
  }

  private stop = () => {
    if(this.song){
      this.song.stop();
    }
  }

  private next = (index) => {
    if(this.song){
      this.song.stop();
    }
    if(index >= this.trackList.length-1){
      index = 0;
    }else{
      index++;
    }
    this.currentIndex = index;
    this.play(index);
  }

  private prev = (index) => {
    if(this.song){
      this.song.stop();
    }
    if(index <= 0){
      index = this.trackList.length-1;
    }else{
      index--;
    }
    this.currentIndex = index;
    this.play(index);
  }

  private formatTime = (secs) => {
    var minutes = Math.floor(secs / 60) || 0;
    var seconds = Math.trunc((secs - minutes * 60)) || 0;
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

}
