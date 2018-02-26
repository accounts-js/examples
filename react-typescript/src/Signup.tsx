import * as React from 'react';
import {
  withStyles,
  WithStyles,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Input,
  Button,
  Typography,
} from 'material-ui';

import { accounts } from './accounts';

const styles = () => ({
  container: {
    margin: 'auto',
    maxWidth: 700,
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    padding: 16,
  },
  formError: {
    color: 'red',
  },
});

interface State {
  email: string;
  password: string;
  error: string | null;
}

class Signup extends React.Component<
  WithStyles<'container' | 'formContainer' | 'formError'>,
  State
> {
  state = {
    email: '',
    password: '',
    error: null,
  };

  onChangeEmail = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: target.value });
  };

  onChangePassword = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: target.value });
  };

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.setState({ error: null });
    try {
      await accounts.loginWithService('password', {
        email: this.state.email,
        password: this.state.email,
      });
    } catch (err) {
      this.setState({ error: err.message });
    }
  };

  render() {
    const { classes } = this.props;
    const { email, password, error } = this.state;
    return (
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          <Paper>
            <form onSubmit={this.onSubmit} className={classes.formContainer}>
              <FormControl margin="normal">
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input id="email" value={email} onChange={this.onChangeEmail} />
              </FormControl>
              <FormControl margin="normal">
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={this.onChangePassword}
                />
              </FormControl>
              <Button variant="raised" color="primary" type="submit">
                Sign Up
              </Button>
              {error && (
                <Typography className={classes.formError}>{error}</Typography>
              )}
            </form>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Signup);
