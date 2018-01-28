import { Injectable } from '@angular/core';

import { tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as auth0 from 'auth0-js';
import { Router } from '@angular/router';
import { AUTH_CONFIG } from './auth0-variables';
import { UserProfile } from './profile.model';
// import { IAuthService } from './auth-service.interface';

@Injectable()
export class AuthService {
  // Create Auth0 web auth instance
  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.CLIENT_ID,
    domain: AUTH_CONFIG.CLIENT_DOMAIN,
    responseType: 'token',
    redirectUri: AUTH_CONFIG.REDIRECT,
    audience: AUTH_CONFIG.AUDIENCE,
    scope: AUTH_CONFIG.SCOPE,
    namespace: AUTH_CONFIG.NAMESPACE
  });
  userProfile: UserProfile;
  isAdmin: boolean;
 
  // Create a stream of logged in status to communicate throughout app
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

static getUser(): string {
        try {
          console.log(localStorage.getItem(
                'profile'))
            if (!tokenNotExpired('access_token')) { return; }
            return JSON.parse(localStorage.getItem(
                'profile'))['nickname'];
        } catch (e) {
            console.log('please log in!');
        }
    }




  constructor(private router: Router) {
    // If authenticated, set local profile property and update login status subject
    if (this.authenticated) {
      this.userProfile = JSON.parse(localStorage.getItem('profile'));
      this.isAdmin = localStorage.getItem('isAdmin') === 'true';
      this.setLoggedIn(true);
      
      
    }
  }

  setLoggedIn(value: boolean) {
    // Update login status subject
    this.loggedIn$.next(value);
    this.loggedIn = value;
    this.navigateToHome();
  }

  login() {
    // Auth0 authorize request
    this.auth0.authorize();
    
  }

  handleAuth() {
    // When Auth0 hash parsed, get profile
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken) {
        window.location.hash = '';
        this._getProfile(authResult);
      } else if (err) {
        console.error(`Error: ${err.error}`);
      }
    });
  }

  private _getProfile(authResult) {
    // Use access token to retrieve user's profile and set session
    this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      this._setSession(authResult, profile);
    });
  }

  private _setSession(authResult, profile) {
    const expTime = authResult.expiresIn * 1000 + Date.now();
    // Save session data and update login status subject
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('profile', JSON.stringify(profile));
    localStorage.setItem('expires_at', JSON.stringify(expTime));
    this.userProfile = profile;
    this.isAdmin = this._checkAdmin(profile);
    localStorage.setItem('isAdmin', this.isAdmin.toString());
    this.setLoggedIn(true);
  }

private _checkAdmin(profile) {
    // Check if the user has admin role
    const roles = profile[AUTH_CONFIG.NAMESPACE] || [];
    return roles.indexOf('admin') > -1;
  }


  logout() {
    // Remove tokens and profile and update login status subject
    localStorage.removeItem('access_token');
    localStorage.removeItem('profile');
    localStorage.removeItem('expires_at');
    
    localStorage.removeItem('isAdmin');


    this.userProfile = undefined;
    this.isAdmin = undefined;
    this.setLoggedIn(false);
    this.navigateToHome();
  }

  get authenticated(): boolean {
    // Check if current date is greater than expiration
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return Date.now() < expiresAt;
  }
   
   // isUserAdmin(): boolean {
   //      try {
   //        return JSON.parse(
   //          localStorage.getItem('profile')
   //        )['role'] === 'admin' && this.login() ? true : false;
   //      } catch (e) {
   //            return false;
   //      }
   //  }
  

    navigateToHome(): void {
        let params = this.router.url === '/items' ? ['/items', {reload: 'yes' }] : ['/items'];

        this.router.navigate(params);
    }


}
