import 'babel-polyfill';
import 'isomorphic-fetch';
import React from 'react';
import Helmet from 'react-helmet';
import { render } from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import { Router, Route } from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import { AccountsClient } from '@accounts/client';
import RestClient from '@accounts/rest-client';
import { AccountsProvider, withCurrentUser } from '@accounts/react';
import { LogInForm, SignUpForm } from '@accounts/react-material-ui';
import packageConf from '../../package.json';

injectTapEventPlugin();
const history = createBrowserHistory();

const accountsClient = new AccountsClient(
  {
    server: 'http://localhost:3010',
    tokenStoragePrefix: 'express-rest',
    title: 'express-rest',
    loginPath: '/login',
    signUpPath: '/signup',
    homePath: '/',
    changeRoute: path => history.push(path),
    passwordSignupFields: 'EMAIL_ONLY',
  },
  new RestClient({
    apiHost: 'http://localhost:3010',
    rootPath: '/accounts',
  }),
);

const Home = withCurrentUser(({ currentUser, loading }) => (
  <div style={{ textAlign: 'center' }}>
    {loading && <CircularProgress />}
    {!loading && <AppBar
      title="js-accounts rest example"
      showMenuIconButton={false}
      iconElementRight={
        !currentUser
          ? <FlatButton label="Login" onTouchTap={() => history.push('/login')} />
          : <FlatButton label="Logout" onTouchTap={() => accountsClient.logout()} />
      }
    />}
    {!loading &&
      !currentUser &&
      <div style={{ marginTop: 40 }}>
        <p>Hey you are not logged in</p>
      </div>}
    {!loading &&
      currentUser &&
      <div style={{ marginTop: 40 }}>
        <p>Signed in user info:</p>
        <p>id : {currentUser.id}</p>
        <p>email : {currentUser.emails[0].address}</p>
      </div>}
  </div>
));

render(
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
      <AccountsProvider accountsClient={accountsClient}>
        <Router history={history}>
          <div>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={LogInForm} />
            <Route path="/signup" component={SignUpForm} />
          </div>
        </Router>
      </AccountsProvider>
    </MuiThemeProvider>
  </div>,
  document.getElementById('root'),
); //eslint-disable-line
