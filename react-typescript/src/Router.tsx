import * as React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Reboot } from 'material-ui';

import Signup from './Signup';

const Router = () => {
  return (
    <BrowserRouter>
      <div>
        <Reboot />
        <Route path="/signup" component={Signup} />
      </div>
    </BrowserRouter>
  );
};

export default Router;
