import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html',
  styleUrls: ['./animation.component.css']
})
export class AnimationComponent implements OnInit {
  public disp1 = "";
  public disp2 = "";

  constructor() { }

  ngOnInit() {
  }

  public toggle = () => {
    if (this.disp1.length > 0) {
      this.disp1 = "";
      this.disp2 = "";
    } else {
      this.disp1 = "loader1";
      this.disp2 = "loader2";
    }
  }

  public animationOn = () =>{
    this.disp1 = "loader1";
      this.disp2 = "loader2";
  }
}
