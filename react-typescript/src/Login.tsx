import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import {
  withStyles,
  WithStyles,
  FormControl,
  InputLabel,
  Input,
  Button,
  Typography,
} from 'material-ui';

import { accounts } from './accounts';
import FormError from './components/FormError';

const styles = () => ({
  formContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
  },
});

const SignUpLink = (props: any) => <Link to="/signup" {...props} />;
const ResetPasswordLink = (props: any) => (
  <Link to="/reset-password" {...props} />
);

interface State {
  email: string;
  password: string;
  error: string | null;
}

class Login extends React.Component<
  WithStyles<'formContainer'> & RouteComponentProps<{}>,
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
        user: {
          email: this.state.email,
        },
        password: this.state.password,
      });
      this.props.history.push('/');
    } catch (err) {
      this.setState({ error: err.message });
    }
  };

  render() {
    const { classes } = this.props;
    const { email, password, error } = this.state;
    return (
      <form onSubmit={this.onSubmit} className={classes.formContainer}>
        <Typography variant="display1" gutterBottom>
          Login
        </Typography>
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
          Login
        </Button>
        {error && <FormError error={error} />}
        <Button component={SignUpLink}>Sign Up</Button>
        <Button component={ResetPasswordLink}>Reset Password</Button>
      </form>
    );
  }
}

export default withStyles(styles)(Login);
