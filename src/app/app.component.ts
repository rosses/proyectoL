import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';

import { Login } from '../pages/login/login';
import { Home } from '../pages/home/home';


@Component({
  templateUrl: 'app.html'
})
export class LipigasPersonas {
  @ViewChild('#content') nav;

  rootPage: any = null;

  constructor(public platform: Platform) {
    this.initializeApp();
  }

  initializeApp() {

    this.platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });

    if (localStorage.getItem("LipigasPersonas")) {
      this.rootPage = Home;
    }
    else {
      this.rootPage = Login; 
    }
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
