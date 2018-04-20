import { Injectable, ApplicationRef } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Howl } from 'howler';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TrackService {
  public width: any;

  public song: Howl;

  public trackList: any = [];      //file: && howl :

  private currentIndex: number = 0;
  private prevIndex: number;

  public trackListChange: Subject<any> = new Subject<any>(); //For the components to be in sync

  constructor(private _electronService: ElectronService, private appRef: ApplicationRef) {
    const ipc = this._electronService.ipcRenderer;

    //recieve contents from win.webcontents() via ipcRenderer
    ipc.on('mp3-file', (event, arg) => {
      console.log(arg);
      for (let i = 0; i < arg.length; i++) {
        this.trackList.push({ file: arg[i], howl: null });
      }
      this.trackListChange.next(this.trackList); //For the components to be in sync
      this.appRef.tick();
    });
  }

  public play = () => {
    if (!this.trackList.length) {
      console.log("No songs to play");
      let notification = new Notification('SoundHaven', {
        body: 'No songs to play'
      });
      return -1;
    } else if (this.trackList[this.currentIndex].howl == null) {
      this.song = this.trackList[this.currentIndex].howl = new Howl({
        src: [this.trackList[this.currentIndex].file],
      })
    } else {
      this.song = this.trackList[this.currentIndex].howl;
    }
    // this.display();
    this.song.play();
    return 0;
  }

  public pause = () => {
    if (this.song) {
      this.song.pause();
    }
  }

  public stop = () => {
    if (this.song) {
      this.song.stop();
    }
  }

  public next = () => {
    if (this.song) {
      this.song.stop();
    }
    if (this.currentIndex >= this.trackList.length - 1) {
      this.currentIndex = 0;
    } else {
      this.currentIndex++;
    }
    let x = this.play();
    return x;
  }

  public prev = () => {
    if (this.song) {
      this.song.stop();
    }
    if (this.currentIndex <= 0) {
      this.currentIndex = this.trackList.length - 1;
    } else {
      this.currentIndex--;
    }
    let x = this.play();
    return x;
  }

  public prevshuffle = () => {
    if (this.song) {
      this.song.stop();
    }
    this.currentIndex = this.prevIndex;
    let x = this.play();
    return x;
  }

  public shuffle = () => {
    this.prevIndex = this.currentIndex;
    this.currentIndex = Math.floor(Math.random() * this.trackList.length);
  }

  public formatTime = (secs) => {
    var minutes = Math.floor(secs / 60) || 0;
    var seconds = Math.trunc((secs - minutes * 60)) || 0;
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }

  public returnTotalDuration = () => {
    return this.formatTime(this.song.duration());
  }

  public returnCurrentDuration = () => {
    return this.formatTime(this.song.seek());
  }

  public getTrackName = () => {
    var sym = (this.trackList[this.currentIndex].file).lastIndexOf('/');
    return (this.trackList[this.currentIndex].file).slice(sym + 1, -4);
  }

  public getWidth = () => {
    let x: any = (this.song.seek() as number);
    x = Math.floor((x/this.song.duration() || 0)*100);
    return x;
  }
}
