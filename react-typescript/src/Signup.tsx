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
});

interface State {
  email: string;
  password: string;
  error: string | null;
}

class Signup extends React.Component<
  WithStyles<'container' | 'formContainer'>,
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

  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO call accounts-js client
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
              {error && <Typography>{error}</Typography>}
            </form>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Signup);
