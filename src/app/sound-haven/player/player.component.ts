import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Howl } from 'howler';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  public song: Howl;

  public trackPlaying: boolean = false;
  public trackListVisible: boolean = false;
  public timer: string = "0.00";
  public trackName: string;
  public trackList: any = []; //file: && howl :

  private currentIndex:number = 0; //Index of the track which is playing

  constructor(private _electronService: ElectronService, private chRef: ChangeDetectorRef) {

      const ipc = this._electronService.ipcRenderer;

      ipc.on('mp3-file', (event, arg) => {
          console.log(arg);
          this.trackPlaying = true;
          // this.song = new Howl({
          //   src: [arg[0]]
          // })
          for(let i=0; i< arg.length; i++){
            this.trackList.push({file: arg[i], howl: null});
          }
          this.chRef.detectChanges();
      });

  }
  ngOnInit() {

  }
  playSong(){
    console.log('Play called');
    this.play();
  }

  private play = () => {
    if(this.trackList[this.currentIndex].howl == null){
      this.song = this.trackList[this.currentIndex].howl = new Howl({
        src: [this.trackList[this.currentIndex].file]
      })
    }else{
      this.song = this.trackList[this.currentIndex].howl;
    }

    this.song.play();
  }



}
