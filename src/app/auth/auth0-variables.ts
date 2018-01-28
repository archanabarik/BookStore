interface AuthConfig {
  CLIENT_ID: string;
  CLIENT_DOMAIN: string;
  AUDIENCE: string;
  REDIRECT: string;
  SCOPE: string;
  NAMESPACE: string;
}

export const AUTH_CONFIG: AuthConfig = {
  CLIENT_ID: '7OUp5FpZRVDIIIza6Rtjds4GbRY9N3S2',
  CLIENT_DOMAIN: 'bookcart.auth0.com', // e.g., you.auth0.com
  AUDIENCE: 'https://bookcart.auth0.com/api/v2/',
  REDIRECT: 'http://localhost:4200/callback',
  SCOPE: 'openid profile email',
  NAMESPACE: 'http://example.com/roles'
};
