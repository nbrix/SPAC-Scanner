import React from "react";
import Shell from "./Shell";
import { Form, Input, Message, Header, Button } from "semantic-ui-react";
import { authAxios } from "../../services/Api/authAxios";
import { ChangePasswordURL } from "../../constants";

class ChangePassword extends React.Component {
  state = {
    currentPassword: "",
    password: "",
    confirmPassword: "",
    error: null,
    success: false,
    loading: false,
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      error: null,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      loading: true,
    });
    const { password, confirmPassword, currentPassword } = this.state;
    if (password !== "" && confirmPassword !== "") {
      if (password === confirmPassword) {
        authAxios
          .post(ChangePasswordURL, {
            current_password: currentPassword,
            password,
            confirm_password: confirmPassword,
          })
          .then((res) => {
            this.setState({
              loading: false,
              password: "",
              confirmPassword: "",
              currentPassword: "",
              success: true,
            });
          })
          .catch((err) => {
            this.setState({
              loading: false,
              error: err.response.data.message,
              success: false,
            });
          });
      } else {
        this.setState({
          loading: false,
          error: "Your passwords do not match.",
          success: false,
        });
      }
    } else {
      this.setState({
        loading: false,
        error: "Please fill in all the fields.",
        success: false,
      });
    }
  };

  render() {
    const {
      currentPassword,
      password,
      confirmPassword,
      error,
      loading,
      success,
    } = this.state;

    return (
      <Shell>
        <Header as="h4">This is the change password page</Header>
        {success && (
            <Message success heading="Password successfully changed" content='Password successfully changed' />
          )}
        <Form onSubmit={this.handleSubmit} error={error !== null}>
          <Form.Field required>
            <label>Current password</label>
            <Input
              value={currentPassword}
              placeholder="Current password"
              type="password"
              name="currentPassword"
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field required>
            <label>New password</label>
            <Input
              value={password}
              placeholder="New password"
              type="password"
              name="password"
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field required>
            <label>Confirm password</label>
            <Input
              value={confirmPassword}
              placeholder="Confirm password"
              type="password"
              name="confirmPassword"
              onChange={this.handleChange}
            />
          </Form.Field>
          {error && (
            <Message error heading="There was an error" content={error} />
          )}
          <Button primary type="submit" loading={loading} disabled={loading}>
            Submit
          </Button>
        </Form>
      </Shell>
    );
  }
}

export default ChangePassword;
