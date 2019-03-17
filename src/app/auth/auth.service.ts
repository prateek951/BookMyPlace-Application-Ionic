import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isLoggedIn = false;
  // Utility method to check whether the user is loggedIn or not
  get isLoggedIn() { 
    return this._isLoggedIn;
  }
  constructor() { }
  // Utility method to login the user 
  login() { 
    this._isLoggedIn = true;
  }
  // Utility method to logout the user
  logout() { 
    this._isLoggedIn = false;
  }

}
