//tslint:disable
import { Component, OnInit } from "@angular/core";
import { AuthService, AuthResponseData } from "./auth.service";
import { Router } from "@angular/router";
import { LoadingController, AlertController } from "@ionic/angular";
import { NgForm } from "@angular/forms";
import { Observable } from "rxjs";
import authErrors from "./authErrors";
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
    // this.auth.login();
    this.loadingController
      .create({
        keyboardClose: true,
        spinner: "lines",
        message: "Here we go...Waiting for authentication to succeed"
      })
      .then(loadingEl => {
        loadingEl.present();

        let authObs: Observable<AuthResponseData>;

        if (this.mode === "register") {
          // call to register method
          // make the call to register method
          authObs = this.auth.register(email, password);
        } else {
          //call the login method if the mode is not register
          authObs = this.auth.login(email, password);
        }
        authObs.subscribe(
          resData => {
            console.log(resData);
            loadingEl.dismiss();
            this.router.navigateByUrl("/places/tabs/discover");
          },
          errorRes => {
            loadingEl.dismiss();
            let { message: code } = errorRes.error.error;
            let message = "Could not register you up";
            switch (code) {
              case authErrors.EMAIL_EXISTS:
                message = "This email is already in use";
                break;
              case authErrors.EMAIL_NOT_FOUND:
                message = "E-mail address could not be found";
                break;
              case authErrors.INVALID_PASSWORD:
                message = "Invalid Password. Please use a valid one";
                break;
              default:
                console.log("some other error");
            }
            this.handleError(message);
          }
        );
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
