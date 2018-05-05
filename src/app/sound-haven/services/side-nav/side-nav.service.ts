import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material'

@Injectable()
export class SideNavService {

  constructor() { }
  private sideNav: MatSidenav;
  public setSideNav(sideNavRecieved: MatSidenav){
    this.sideNav = sideNavRecieved;
  }

  public open(){
    this.sideNav.open();
  }
  public toggle(){
    this.sideNav.toggle();
  }
}
