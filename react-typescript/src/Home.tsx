import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Typography } from 'material-ui';

import { accounts } from './accounts';

class Home extends React.Component<RouteComponentProps<{}>, {}> {
  async componentDidMount() {
    await accounts.config();
    const tokens = await accounts.tokens();
    if (!tokens.accessToken) {
      this.props.history.push('/login');
      return;
    }
  }

  onLogout = async () => {
    // TODO remove null as any when next published
    await accounts.logout(null as any);
    this.props.history.push('/login');
  };

  render() {
    return (
      <div>
        <Typography gutterBottom>You are logged in</Typography>
        <Button variant="raised" color="primary" onClick={this.onLogout}>
          Logout
        </Button>
      </div>
    );
  }
}

export default Home;
