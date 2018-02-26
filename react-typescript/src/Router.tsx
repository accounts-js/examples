import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Reboot } from 'material-ui';

import Signup from './Signup';
import Login from './Login';
import Home from './Home';

const Router = () => {
  return (
    <BrowserRouter>
      <div>
        <Reboot />
        <Route exact path="/" component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
      </div>
    </BrowserRouter>
  );
};

export default Router;
