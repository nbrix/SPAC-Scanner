import React from "react";
import Shell from "./Shell";
import { Form, Input, Message, Header, Button } from "semantic-ui-react";
import { authAxios } from "../../services/Api/authAxios";
import { ChangeEmailURL, EmailURL } from "../../constants";

class ChangeEmail extends React.Component {
  state = {
    currentEmail: "",
    email: "",
    confirmEmail: "",
    error: null,
    loading: false,
    success: false,
  };

  componentDidMount() {
    this.handleUserDetails();
  }

  handleUserDetails = () => {
    this.setState({
      loading: true,
    });
    authAxios
      .get(EmailURL)
      .then((res) => {
        this.setState({
          loading: false,
          currentEmail: res.data.email,
          success: false,
        });
      })
      .catch((err) => {
        this.setState({
          loading: false,
          error: err.response.data.message,
          success: false,
        });
      });
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
    const { email, confirmEmail } = this.state;
    if (email !== "" && confirmEmail !== "") {
      if (email === confirmEmail) {
        authAxios
          .post(ChangeEmailURL, {
            email,
            confirm_email: confirmEmail,
          })
          .then((res) => {
            this.setState({
              loading: false,
              email: "",
              confirmEmail: "",
              currentEmail: email,
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
          error: "Your emails do not match.",
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
    const { currentEmail, email, confirmEmail, error, loading, success } = this.state;

    return (
      <Shell>
        <Header as="h4">This is the change email page</Header>
        {success && (
            <Message success heading="Email successfully changed" content='Email successfully changed' />
          )}
        <Form onSubmit={this.handleSubmit} error={error !== null}>
          <Form.Field>
            <label>Current email</label>
            <Input
              value={currentEmail}
              disabled
              placeholder=""
              type="email"
              name="email"
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field required>
            <label>New email</label>
            <Input
              value={email}
              placeholder="New email"
              type="email"
              name="email"
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field required>
            <label>Confirm email</label>
            <Input
              value={confirmEmail}
              placeholder="Confirm email"
              type="email"
              name="confirmEmail"
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

export default ChangeEmail;
