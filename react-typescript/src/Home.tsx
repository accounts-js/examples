import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { withStyles, WithStyles, Grid, Paper, Button } from 'material-ui';

import { accounts } from './accounts';

const styles = () => ({
  container: {
    margin: 'auto',
    maxWidth: 700,
  },
});

class Home extends React.Component<
  WithStyles<'container'> & RouteComponentProps<{}>,
  {}
> {
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
    const { classes } = this.props;
    return (
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          <Paper>
            <Button variant="raised" color="primary" onClick={this.onLogout}>
              Logout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Home);
