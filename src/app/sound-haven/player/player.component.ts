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
  private play = false;
  constructor(private _electronService: ElectronService, private chRef: ChangeDetectorRef) {

      const ipc = this._electronService.ipcRenderer;

      ipc.on('mp3-file', (event, arg) => {
          console.log(arg);
          this.songSelected = true;
          this.song = new Howl({
            src: [arg]
          })
          this.chRef.detectChanges();
      });

  }
  ngOnInit() {

  }
  playSong(){
    this.song.play();
  }
}
