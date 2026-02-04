import { AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
  issuer: 'http://localhost:8080/realms/medloop',
  redirectUri: window.location.origin + '/auth/callback',
  clientId: 'admin-service',
  responseType: 'code',
  scope: 'openid profile email',
  showDebugInformation: true,
  requireHttps: false, // For development
  skipIssuerCheck: true, // For development
  strictDiscoveryDocumentValidation: false,
  useHttpBasicAuth: false, // Don't use basic auth for token requests
  disablePKCE: false // Enable PKCE for public clients
};