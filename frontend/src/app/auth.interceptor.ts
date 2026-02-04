import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const oauthService = inject(OAuthService);

  // Skip interceptor for OAuth-related requests
  if (req.url.includes('/realms/') || req.url.includes('/auth/')) {
    return next(req);
  }

  const token = oauthService.getAccessToken();

  console.log('Auth Interceptor - Token present:', !!token);

  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  }

  return next(req);
};