//tslint:disable

import { Component } from "@angular/core";
import { Platform } from "@ionic/angular";
import { Plugins, Capacitor } from "@capacitor/core";
import { AuthService } from "./auth/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private auth: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }
  onLogout() {
    // set isLoggedIn to false
    this.auth.logout();
    // redirect to the auth page back
    this.router.navigateByUrl("/auth");
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable("SplashScreen")) {
        Plugins.SplashScreen.hide();
      }
    });
  }
}
