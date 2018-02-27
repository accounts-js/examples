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

import { accountsRest } from './accounts';
import FormError from './components/FormError';

const styles = () => ({
  formContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
  },
});

const LogInLink = (props: any) => <Link to="/login" {...props} />;

interface State {
  email: string;
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

  onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.setState({ error: null });
    try {
      await accountsRest.sendResetPasswordEmail(this.state.email);
      // TODO success message
    } catch (err) {
      console.log(err);
      this.setState({ error: err.message });
    }
  };

  render() {
    const { classes } = this.props;
    const { email, error } = this.state;
    return (
      <form onSubmit={this.onSubmit} className={classes.formContainer}>
        <Typography variant="display1" gutterBottom>
          Reset Password
        </Typography>
        <FormControl margin="normal">
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input id="email" value={email} onChange={this.onChangeEmail} />
        </FormControl>
        <Button variant="raised" color="primary" type="submit">
          Reset Password
        </Button>
        {error && <FormError error={error} />}
        <Button component={LogInLink}>Log In</Button>
      </form>
    );
  }
}

export default withStyles(styles)(Login);
