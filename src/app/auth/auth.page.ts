//tslint:disable
import { Component, OnInit } from "@angular/core";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";
import { LoadingController, AlertController } from "@ionic/angular";
import { NgForm } from "@angular/forms";
// import { switchMap } from "rxjs/operators";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"]
})
export class AuthPage implements OnInit {
  // boolean for the loading
  isLoading: boolean = false;
  // by default set the mode to login
  mode: string = "login";
  constructor(
    private auth: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}
  onAuthenticate(email: string, password: string) {
    // set the loading to true
    this.isLoading = true;
    this.auth.login();
    this.loadingController
      .create({
        keyboardClose: true,
        spinner: "lines",
        message: "Here we go...Waiting for authentication to succeed"
      })
      .then(loadingEl => {
        loadingEl.present();
        if (this.mode === "register") {
          // call to register method
          // make the call to register method
          this.auth.register(email, password).subscribe(
            resData => {
              console.log(resData);
              //set the loading to false
              this.isLoading = false;
              loadingEl.dismiss();
              //navigate
              this.router.navigateByUrl("/places/tabs/discover");
            },
            errorRes => {
              loadingEl.dismiss();
              const code = errorRes.error.error.message;
              let message = `Could not register you up`;
              if (code === "EMAIL_EXISTS") {
                message = "This email already exists";
              }
              this.handleError(message);
            }
          );
        } else {
          // call to login method
        }
      });
  }
  onSubmit(form: NgForm) {
    // Check the validity of the form
    if (form.invalid) {
      return;
    }
    // Tap the email and password fields values
    const { email, password } = form.value;
    this.onAuthenticate(email, password);
  }

  private handleError(message: string) {
    this.alertCtrl
      .create({
        header: "Authentication failed",
        message: message,
        buttons: ["okay"]
      })
      .then(alertEl => {
        alertEl.present();
      });
  }

  // mode change handler
  onChangeMode() {
    if (this.mode === "login") {
      this.mode = "register";
    } else {
      this.mode = "login";
    }
  }
}
