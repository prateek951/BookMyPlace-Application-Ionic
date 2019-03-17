import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  // boolean for the loading 
  isLoading: boolean = false;
  // by default set the mode to login 
  mode: string = 'login';
  constructor(private auth: AuthService, private router: Router,private loadingController: LoadingController) { }

  ngOnInit() {
  }
  onLogin() { 
    // set the loading to true
    this.isLoading = true;
    this.auth.login();
    this.loadingController.create({
      keyboardClose: true,
      spinner: "lines",
      message: 'Here we go...Waiting for authentication to succeed'
    }).then(loadingEl => {
      loadingEl.present();
      setTimeout(() => {
        // set back to false
        this.isLoading = false;
        loadingEl.dismiss();
        this.router.navigateByUrl('/places/tabs/discover');
      }, 2000);
    });
  }
  onSubmit(form: NgForm) {
    console.log(form);
  }
  onChangeMode() { 
    if(this.mode === 'login') {
      this.mode = 'register';
    }else { 
      this.mode = 'login';
    }
  }
}
