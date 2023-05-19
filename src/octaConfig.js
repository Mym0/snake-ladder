const CLIENT_ID = '0oace1jy5cAIRkj625d6';
const ISSUER = 'https://id.octolearn.de/oauth2/default';
const REDIRECT_URI = `${window.location.origin}/login/callback`;

// eslint-disable-next-line
export default {
  oidc: {
    clientId: CLIENT_ID,
    issuer: ISSUER,
    redirectUri: REDIRECT_URI,
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
  },
  resourceServer: {
    messagesUrl: 'http://localhost:8000/api/messages',
  },
};
