import { Injectable, ApplicationRef } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Howl } from 'howler';
import { Subject } from 'rxjs';

@Injectable()
export class TrackService {
  public width: any;

  public song: Howl;
  public i= 0;
  public trackList: any = [];      //file: && howl :

  public currentIndex: number = 0;
  private prevIndex: number;
                     
  public trackListChange: Subject<any> = new Subject<any>(); //For the components to be in sync

  public muted: boolean = false;

  constructor(private _electronService: ElectronService, private appRef: ApplicationRef) {
    const ipc = this._electronService.ipcRenderer;

    //recieve contents from win.webcontents() via ipcRenderer
    ipc.on('mp3-file', (event, arg) => {
      console.log('arg',arg);

      //this.trackList = JSON.parse(localStorage.getItem('tracklist'));
      //for (let i = 0; i < arg.length; i++) {
        this.trackList.push({ id: this.i, file: arg[0], howl: null });
        this.i++;
        console.log('present',this.trackList);
      //}
      this.trackListChange.next(this.trackList); //For the components to be in sync
      let notification = new Notification('SoundHaven', {
        body: 'Songs Added. Play Now'
      });
      this.appRef.tick();
    });
  }

  public play = () => {
    console.log("check",this.trackList);
    console.log("check2",this.currentIndex);
    if (!this.trackList.length) {
      console.log("No songs to play");
      let notification = new Notification('SoundHaven', {
        body: 'No songs to play'
      });
      return -1;
    } else if (!this.trackList[this.currentIndex].howl) {
      this.song = this.trackList[this.currentIndex].howl = new Howl({
        src: [this.trackList[this.currentIndex].file],
        volume: 0.7,
        mute: false
      })
    } else {
      this.song = this.trackList[this.currentIndex].howl;
      console.log('from sidebar',this.song);
    }
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

  public volMute = () => {
    if (!this.muted) {
      this.song.mute(true);
    }
    else {
      this.song.mute(false);
    }
    this.muted = !this.muted;
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
    x = Math.floor((x / this.song.duration() || 0) * 100);
    return x;
  }

  public setVolume = (volvalue: number) => {
    Howler.volume(volvalue / 100);
  }

  public seekTo = (percentage: number) => {
    this.song.seek(percentage * this.song.duration() / 100);
  }

  public changeNextIndex = (selectedId: number) => {
    //Linear search
    //assuming that id and index number will be same
    for (let i = 0; i < this.trackList.length; i++) {
      if (selectedId == this.trackList[i].id) {
        this.currentIndex = selectedId;
        break;
      }
    }
  }

}