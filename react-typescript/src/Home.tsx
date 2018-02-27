import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button } from 'material-ui';

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
    await accounts.logout(null as any);
    this.props.history.push('/login');
  };

  render() {
    return (
      <Button variant="raised" color="primary" onClick={this.onLogout}>
        Logout
      </Button>
    );
  }
}

export default Home;
