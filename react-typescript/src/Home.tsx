import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Typography } from 'material-ui';

import { accounts, accountsRest } from './accounts';

interface State {
  user: any;
}

class Home extends React.Component<RouteComponentProps<{}>, State> {
  state = {
    user: null,
  };

  async componentDidMount() {
    // configure the module first
    await accounts.config();
    // refresh the session to get a new accessToken if expired
    await accounts.refreshSession();
    const tokens = await accounts.tokens();
    if (!tokens.accessToken) {
      this.props.history.push('/login');
      return;
    }
    const res = await fetch('http://localhost:4000/user', {
      headers: {
        'accounts-access-token': tokens.accessToken,
      },
    });
    const user = await res.json();
    this.setState({ user: user.user });
  }

  onResendEmail = async () => {
    const { user }: State = this.state;
    await accountsRest.sendVerificationEmail(user.emails[0].address);
  };

  onLogout = async () => {
    await accounts.logout();
    this.props.history.push('/login');
  };

  render() {
    const { user }: State = this.state;
    if (!user) {
      return null;
    }
    return (
      <div>
        <Typography gutterBottom>You are logged in</Typography>
        <Typography gutterBottom>Email: {user.emails[0].address}</Typography>
        <Typography gutterBottom>
          You email is {user.emails[0].verified ? 'verified' : 'unverified'}
        </Typography>
        {!user.emails[0].verified && (
          <Button onClick={this.onResendEmail}>
            Resend verification email
          </Button>
        )}

        <Button variant="raised" color="primary" onClick={this.onLogout}>
          Logout
        </Button>
      </div>
    );
  }
}

export default Home;
