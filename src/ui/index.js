import 'babel-polyfill';
import 'isomorphic-fetch';
import React from 'react';
import Helmet from 'react-helmet';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import AccountsClient from '@accounts/client';
import restClient from '@accounts/rest-client';
import '@accounts/react-material-ui';
import createLogger from 'redux-logger';
import { accountRoutes, withUser, Authenticated } from '@accounts/react';
import packageConf from '../../package.json';

injectTapEventPlugin();

(async () => {
  AccountsClient.config({
    server: 'http://localhost:3010',
    history: browserHistory,
    title: 'rest-example',
    loginPath: '/login',
    signUpPath: '/signup',
    homePath: '/home',
    reduxLogger: createLogger(),
  }, restClient);

  await AccountsClient.resumeSession();
})();

const logout = () => {
  AccountsClient.logout();
};

const Home = withUser(({ user }) =>
  <div>
    <AppBar
      title="js-accounts rest example"
      showMenuIconButton={false}
      iconElementRight={<FlatButton label="Logout" onTouchTap={logout} />}
    />
    <div style={{ marginTop: 40, textAlign: 'center' }}>
      Signed in user info:
      <br />
      <div>id : {user.id}</div>
      <div>email : {user.emails[0].address}</div>
    </div>
  </div>,
);

render((
  <div>
    <Helmet
      title={`${packageConf.name} ${packageConf.version}`}
      meta={[
        {
          name: 'description',
          content: `${packageConf.description}`,
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0',
        },
      ]}
    />
    <MuiThemeProvider>
      <Router history={browserHistory}>
        <Route path="/" component={Authenticated}>
          <IndexRoute component={Home} />
          <Route path="/home" component={Home} />
        </Route>
        {accountRoutes()}
      </Router>
    </MuiThemeProvider>
  </div>
), document.getElementById('root')); //eslint-disable-line
