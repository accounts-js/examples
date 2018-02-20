import * as React from 'react';
import './App.css';

import { AccountsClient } from '@accounts/client';
import { OauthTransport } from './oauth-transport';

const accounts = new AccountsClient(
  {},
  new OauthTransport({
    apiHost: 'http://localhost:3000',
    rootPath: '/accounts',
  }),
);

// tslint:disable-next-line:no-console
accounts.loginWithService('oauth', { provider: 'google' }).then(user => console.log(user));

const logo = require('./logo.svg');

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
