//tslint:disable
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "./../../environments/environment";

// Setup the interface for the response data that we get back
export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  //  This field is optional for register but mandatory for login
  registered?: boolean;
}

@Injectable({
  providedIn: "root"
})
export class AuthService {
  // Initially the user is not authenticacted
  private _isLoggedIn = false;
  // set userId to null
  private _userId = null;

  // Utility method to check whether the user is loggedIn or not
  get isLoggedIn() {
    return this._isLoggedIn;
  }

  // Utility method to return the userId
  get userId() {
    return this._userId;
  }

  constructor(private http: HttpClient) {}

  register(email: string, password: string) {
    //Register a new user with the given mail and password

    return this.http.post<AuthResponseData>(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${
        environment.FIREBASE_API_KEY
      }`,
      { email: email, password: password, returnSecureToken: true }
    );
  }

  // Utility method to login the user
  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${
        environment.FIREBASE_API_KEY
      }`,
      { email: email, password: password}
    );
  }
  // Utility method to logout the user
  logout() {
    this._isLoggedIn = false;
  }
}
