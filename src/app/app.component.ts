import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen, GoogleAnalytics } from 'ionic-native';

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
      // google
      return GoogleAnalytics.startTrackerWithId("UA-92519180-1")
        .then(() => {
          console.log('Google analytics is ready now');
          return GoogleAnalytics.enableUncaughtExceptionReporting(true)
        }).then((_success) => {
          console.log("startTrackerWithId success")
        }).catch((_error) => {
          console.log("enableUncaughtExceptionReporting", _error)
        });
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
