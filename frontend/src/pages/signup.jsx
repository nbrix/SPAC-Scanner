import React from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment
} from "semantic-ui-react";
import { connect } from "react-redux";
import { NavLink, Redirect } from "react-router-dom";
import { authSignup as signup } from "../store/actions/auth";

class RegistrationForm extends React.Component {
  state = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    formError: null
  };

  handleSubmit = e => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = this.state;
    if (
      username !== '' && 
      password !== '' && 
      confirmPassword !== '' && 
      email !== '' &&
      this.comparePasswords() === true &&
      this.comparePasswordLengths() === true
      ) {
      this.props.signup(username, email, password, confirmPassword);
    } else if (username === '') {
      this.setState({
        formError: 'Please enter a username.'
      })
    } else if (email === '') {
      this.setState({
        formError: 'Please enter a valid email.'
      })
    } else if (password === '') {
      this.setState({
        formError: 'Please enter a password.'
      })
    } else if (confirmPassword === '') {
      this.setState({
        formError: 'Please verify your password.'
      })
    } 
    
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  comparePasswords = () => {
    const {password, confirmPassword} = this.state;
    if (password !== confirmPassword) {
      this.setState({ formError: "Your passwords do not match."})
      return false;
    } else {
      return true;
    }
  }

  comparePasswordLengths = () => {
    const {password, confirmPassword} = this.state;
    if (password.length >= 8 && confirmPassword.length >= 8) {
      return true;
    } else {
      this.setState({ formError: "Your password must be a minimum of 8 characters."})
      return false;
    }
  }

  render() {
    const { formError } = this.state;
    const { error, loading, authenticated } = this.props;
    if (authenticated) {
      var {from} = this.props.location.state || {from: {pathname: '/'}}
      return <Redirect to={from} />;
    }
    

    return (
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" color="primary" textAlign="center">
            Signup to your account
          </Header>
          {error && <p>{this.props.error.message}</p>}

          <React.Fragment>
            <Form size="large" onSubmit={this.handleSubmit}>
              <Segment stacked>
                <Form.Input
                  onChange={this.handleChange}
                  name="username"
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Username"
                />
                <Form.Input
                  onChange={this.handleChange}
                  name="email"
                  fluid
                  icon="mail"
                  iconPosition="left"
                  placeholder="E-mail address"
                  type="email"
                />
                <Form.Input
                  onChange={this.handleChange}
                  fluid
                  name="password"
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                />
                <Form.Input
                  onChange={this.handleChange}
                  fluid
                  name="confirmPassword"
                  icon="lock"
                  iconPosition="left"
                  placeholder="Confirm password"
                  type="password"
                />

                <Button
                  color="primary"
                  fluid
                  size="large"
                  loading={loading}
                  disabled={loading}
                >
                  Signup
                </Button>
              </Segment>
            </Form>
            {formError && (
              <Message negative>
                <Message.Header> There was an error </Message.Header>
                <p>{formError}</p>
              </Message>
            )}
            {error && (
              <Message negative>
                <Message.Header> There was an error </Message.Header>
                <p>{error}</p>
              </Message>
            )}
            <Message>
              Already have an account? <NavLink to="/login">Login</NavLink>
            </Message>
          </React.Fragment>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    authenticated: state.auth.token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signup: (username, email, password, confirmPassword) =>
      dispatch(signup(username, email, password, confirmPassword))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegistrationForm);
