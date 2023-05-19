import React from 'react';
import './App.css';
import { LoginCallback, Security, withOktaAuth } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import Home from './components/Home/Home';
import config from './octaConfig';

const oktaAuth = new OktaAuth(config.oidc);

function App() {
  let history = useHistory();
  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <Route path="/" exact={true} component={Home} />
      <Route path="/login/callback" component={LoginCallback} />
    </Security>
  );
}

const AppWithRouterAccess = withOktaAuth(App);

function RouterApp() {
  return (
    <Router>
      <AppWithRouterAccess />
    </Router>
  );
}

export default RouterApp;
