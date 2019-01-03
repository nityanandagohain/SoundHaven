import {
  Component,
  ViewChild,
  AfterViewInit,
  Input,
  OnInit
} from '@angular/core';
import {
  FormControl
} from '@angular/forms';
import {
  MatSidenav
} from '@angular/material/sidenav';
import {
  Observable, Subscription
} from 'rxjs';
import {
  startWith,
  map,
  catchError
} from 'rxjs/operators';
import {
  SideNavService
} from './sound-haven/services/side-nav/side-nav.service';
import {
  TrackService
} from './sound-haven/services/tracks/track-service.service';
import {
  PlayerComponent
} from './sound-haven/player/player.component';
import {
  AnimationComponent
} from './sound-haven/animation/animation.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit, OnInit {
  @ViewChild('sidenav') public sidenav: MatSidenav;
  @Input() player: PlayerComponent;
  @Input() animation: AnimationComponent;

  reason = '';
  private subscription: Subscription;
  public tracks: any = [];
  stateCtrl: FormControl;
  filteredTracks: Observable < any[] > ;
  constructor(private _sideNavService: SideNavService, private _trackService: TrackService, private _player: PlayerComponent) {}

  ngOnInit() {

    //this.tracks = JSON.parse(localStorage.getItem('tracklist'));
    console.log(this.tracks.length);
    this.stateCtrl = new FormControl();
    this.filteredTracks = this.stateCtrl.valueChanges.pipe(
      startWith(''),
      map(state => state ? this.filterTracks(state) : this.tracks.slice())
    );
    this.subscription = this._trackService.trackListChange.subscribe((value) => {
      let trackList = [];
      let recievedObject = value;
      if (recievedObject) {
        let length = recievedObject.length;
      }
     // if (JSON.parse(localStorage.getItem('tracklist'))) {
       // trackList = [];
     //   trackList = JSON.parse(localStorage.getItem('tracklist')); // tracklist will be retrieved from the saved one
     // }
      for (let i = 0; i < recievedObject.length; i++) {
        let tempStr = recievedObject[i].file;
        console.log('tempstr', value)
        let sym = tempStr.lastIndexOf('/');
        console.log(sym);
        tempStr = tempStr.substring(sym + 1);
        trackList.push({
          id: recievedObject[i].id,
          trackName: tempStr
        });
      //  localStorage.setItem('tracklist', JSON.stringify(trackList)); //tracklist is saved in localstorage
        console.log("show id", recievedObject[i].id)

      }
      this.tracks = trackList;
      console.log('zsvdxbdfbfb', trackList);
    });
  }

  private filterTracks(name: string) {
    return this.tracks.filter(track =>
      track.trackName.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }

  ngAfterViewInit() {
    this._sideNavService.setSideNav(this.sidenav);
  }

  playCurrent(id: number) {
    console.log(id);
    this._trackService.changeNextIndex(id);
    if(!this._trackService.sameTrack)
    {
    this._player.stopSong();
    this._player.playPause();
    this.close(this.reason);
    }
  }

  deleteSong(i)
  {

    if(this._trackService.currentIndex == i)
    {
        let notification = new Notification('SoundHaven', {
          body: 'Song is playing right now so cannot delete'
        });
    }
    else{
      console.log('this number song deleted',i);
     this.close(this.reason);
     this.tracks.splice(i,1);
     this._trackService.trackList.splice(i,1);
     this.tracks.map(elem=>{
       console.log('elem',elem);
       console.log('index of elem',this.tracks.indexOf(elem));
       elem.id = this.tracks.indexOf(elem);
     })
     this._trackService.trackList.map(elem=>{
      elem.id = this._trackService.trackList.indexOf(elem);
    })
    this._trackService.i--;
     console.log('delete consoles');
     console.log(this.tracks);
     console.log(this._trackService.trackList);
     //this._trackService.currentIndex--;
   }
  }
  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
}
