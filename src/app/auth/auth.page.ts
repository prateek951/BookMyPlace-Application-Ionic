import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  constructor(private auth: AuthService,private router:Router) { }

  ngOnInit() {
  }
  onLogin() { 
    this.auth.login();
    this.router.navigateByUrl('/places/tabs/discover');
  }
}
