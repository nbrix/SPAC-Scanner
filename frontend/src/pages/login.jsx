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
import { authLogin as login } from "../store/actions/auth";

class LoginForm extends React.Component {
  state = {
    username: "",
    password: "",
    formError: null
  };

  handleChange = e => {
    this.setState({ 
      [e.target.name]: e.target.value,
      formError: null
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { username, password } = this.state;
    if (username !== '' && password !== '') {
      this.props.login(username, password);
    } else if (username === '') {
      this.setState({
        formError: 'Please enter a username.'
      })
    } else if (password === '') {
      this.setState({
        formError: 'Please enter a password.'
      })
    } 
      
  };

  render() {
    const { formError } = this.state;
    const { error, loading, authenticated } = this.props;
    if (authenticated) {
      var {from} = this.props.location.state || {from: {pathname: '/'}}
      return <Redirect to={from} />
    }
    
    
    return (
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="primary" textAlign="center">
            Log-in to your account
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
                  fluid
                  
                  name="password"
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                />
                {/*<Link to={'/forgot-password'} style={{float: 'right', paddingBottom: '5px'}}>Forgot Password?</Link>*/}

                <Button
                  color="primary"
                  fluid
                  size="large"
                  loading={loading}
                  disabled={loading}
                >
                  Login
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
              New to us? <NavLink to="/signup">Sign Up</NavLink>
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
    authenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    login: (username, password) => dispatch(login(username, password))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginForm);
