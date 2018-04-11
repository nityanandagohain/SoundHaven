import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { Howl } from 'howler';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  public songSelected: boolean = false;
  public song: Howl;
  constructor(private _electronService: ElectronService, private chRef: ChangeDetectorRef) {

      const ipc = this._electronService.ipcRenderer;

      ipc.on('mp3-file', (event, arg) => {
          console.log(arg);
          this.song = new Howl({
            src: [arg],
            autoplay: true
          })
          this.chRef.detectChanges();
      });

  }
  ngOnInit() {

  }
  playSong(){
    this.song.play();
    this.songSelected = !this.songSelected;
  }
  pauseSong(){
    this.song.pause();
    this.songSelected = !this.songSelected;
  }
  stopSong(){
		this.song.stop();
  }
  volUp(){
		var vol = this.song.volume();
		vol += 0.1;
		if (vol > 1) {
			vol = 1;
		}
		this.song.volume(vol);
	}
  volDown(){
    var vol = this.song.volume();
		vol -= 0.1;
		if (vol < 0) {
			vol = 0;
		}
		this.song.volume(vol);
	}
}
