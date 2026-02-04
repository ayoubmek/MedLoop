import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';

export const authGuard: CanActivateFn = async (route, state) => {
  const oauthService = inject(OAuthService);
  const router = inject(Router);

  // Ensure OAuth is configured
  if (!oauthService.clientId) {
    oauthService.configure(authConfig);
  }

  // Check if we have a valid token first (without loading discovery)
  if (oauthService.hasValidAccessToken()) {
    return true;
  }

  // Try to load the discovery document if not already loaded
  if (!oauthService.discoveryDocumentLoaded) {
    try {
      await oauthService.loadDiscoveryDocument();
    } catch (error) {
      console.error('Failed to load discovery document:', error);
      router.navigate(['/auth/login']);
      return false;
    }
  }

  // Check again after loading discovery
  if (oauthService.hasValidAccessToken()) {
    return true;
  }

  // Try to refresh the token if we have a refresh token
  if (oauthService.getRefreshToken()) {
    try {
      await oauthService.refreshToken();
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
  }

  // No valid token, redirect to login
  router.navigate(['/auth/login']);
  return false;
};
