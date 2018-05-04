import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TrackService } from '../services/tracks/track-service.service';
import { PlayerComponent } from '../player/player.component';

import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() player: PlayerComponent;

  public show: boolean = false;
  private subscription: any;
  public tracks: any = [""];
  stateCtrl: FormControl;
  filteredTracks: Observable<any[]>;
  constructor(private _trackService: TrackService) {
    this.stateCtrl = new FormControl();
    this.filteredTracks = this.stateCtrl.valueChanges
      .pipe(
        startWith(''),
        map(state => state ? this.filterTracks(state) : this.tracks.slice())
      );

    this.subscription = this._trackService.trackListChange.subscribe((value) => {
      let trackList = [];
      let recievedObject = value;
      for (let i = 0; i < recievedObject.length; i++) {
        let tempStr = recievedObject[i].file;
        // console.log(tempStr.lastIndexOf('/'))
        let sym = tempStr.lastIndexOf('/');
        console.log(sym);
        tempStr = tempStr.substring(sym + 1);
        trackList.push({ id: recievedObject[i].id, trackName: tempStr });
      }
      this.tracks = trackList;
      console.log(trackList);
    });
  }

  ngOnInit() {
    console.log("header On init");
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private filterTracks(name: string) {
    return this.tracks.filter(track =>
      track.trackName.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  public toggleShowSearch = () => {
    this.show = !this.show;
  }

  public songSelected = (event, track) => {
    console.log(track);
    this._trackService.changeNextIndex(track.id);
    this.player.playNext();
  }

}

