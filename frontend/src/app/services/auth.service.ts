import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from '../auth.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private oauthService: OAuthService) {
    this.configureOAuth();
  }

  private configureOAuth(): void {
    this.oauthService.configure(authConfig);
    // Don't load discovery document here, do it when needed
  }

  login(): Promise<void> {
    return this.oauthService.loadDiscoveryDocument().then(() => {
      this.oauthService.initLoginFlow();
    });
  }

  logout(): void {
    this.oauthService.logOut();
  }

  handleCallback(): Promise<void> {
    return this.oauthService.loadDiscoveryDocument().then(() => {
      return this.oauthService.tryLoginCodeFlow();
    });
  }

  get isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  get token(): string | null {
    return this.oauthService.getAccessToken();
  }

  get userProfile(): any {
    return this.oauthService.getIdentityClaims();
  }
}