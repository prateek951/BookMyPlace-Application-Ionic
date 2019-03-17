import { Injectable } from '@angular/core';
import { CanLoad, Router, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanLoad {

  constructor(private auth:AuthService,private router:Router){

  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean  { 
      if(!this.auth.isLoggedIn) { 
        this.router.navigateByUrl('/auth');
      }
      return this.auth.isLoggedIn;
  }


}