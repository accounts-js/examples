import 'babel-polyfill';
import 'isomorphic-fetch';
import React from 'react';
import Helmet from 'react-helmet';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { MuiThemeProvider } from 'material-ui';
import { AccountsClient } from '@accounts/accounts';
import restClient from '@accounts/rest';
import '@accounts/react-material-ui';
import createLogger from 'redux-logger';
import { accountRoutes, withUser, Authenticated } from '@accounts/react';
import packageConf from '../../package.json';

injectTapEventPlugin();

AccountsClient.config({
  server: 'http://localhost:3010',
  history: browserHistory,
  title: 'rest-example',
  loginPath: '/login',
  signUpPath: '/signup',
  homePath: '/home',
  reduxLogger: createLogger(),
}, restClient);

const Home = withUser(({ user }) =>
  <div>
    Signed in user info
    <br />
    {Object.keys(user).map(key => <div key={key}>{key} : {user[key]} </div>)}
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
