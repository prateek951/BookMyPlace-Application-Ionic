//tslint:disable
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "./../../environments/environment";
import { BehaviorSubject } from "rxjs";
import { User } from "./user.model";
import { map, tap } from "rxjs/operators";
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
  // Create a user behavior subject to manage the token and the userid

  private _user = new BehaviorSubject<User>(null);

  // Utility method to check whether the user is loggedIn or not
  get isLoggedIn() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  // Utility method to return the userId
  get userId() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  constructor(private http: HttpClient) {}

  register(email: string, password: string) {
    //Register a new user with the given mail and password

    return this.http
      .post<AuthResponseData>(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${
          environment.FIREBASE_API_KEY
        }`,
        { email: email, password: password, returnSecureToken: true }
      )
      .pipe(tap(this.setUserData.bind(this)));
  }

  // Utility method to login the user
  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${
          environment.FIREBASE_API_KEY
        }`,
        { email: email, password: password }
      )
      .pipe(this.setUserData.bind(this));
  }
  // Utility method to logout the user
  logout() {
    //set next emission value to null
    this._user.next(null);
  }

  private setUserData(userData: AuthResponseData) {
    const expirationTime = new Date(
      new Date().getTime() + +userData.expiresIn * 1000
    );
    this._user.next(
      new User(
        userData.localId,
        userData.email,
        userData.idToken,
        expirationTime
      )
    );
  }
}
