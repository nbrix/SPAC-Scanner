/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import { createMedia } from "@artsy/fresnel";
import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  Button,
  Container,
  Menu,
  Segment,
  Label,
  Visibility,
} from "semantic-ui-react";
import { withRouter, Link } from "react-router-dom";
import { logout } from "../../store/actions/auth";
import { connect } from "react-redux";
import SearchBar from "../../components/SearchBar";
import Footer from "../../modules/Footer/Footer";

const { Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
});

class DesktopContainer extends Component {
  state = {};

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });

  render() {
    const { children, isAuthenticated } = this.props;
    const { fixed } = this.state;

    return (
      <Media greaterThan="mobile">
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            inverted
            textAlign="center"
            style={{ padding: "1em 0em" }}
            vertical
          >
            <Menu
              fixed={fixed ? "top" : null}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size="large"
            >
              <Container>
                <Menu.Item
                  active={this.props.location.pathname === "/"}
                  onClick={() => this.props.history.push("/")}
                >
                  Home
                </Menu.Item>
                <Menu.Item
                  active={this.props.location.pathname === "/news"}
                  onClick={() => this.props.history.push("/news")}
                >
                  News
                </Menu.Item>
                <Menu.Item
                  active={this.props.location.pathname === "/sec-filings"}
                  onClick={() => this.props.history.push("/sec-filings")}
                >
                  SEC Filings
                </Menu.Item>
                <Menu.Item
                  active={this.props.location.pathname === "/screener"}
                  onClick={() => this.props.history.push("/screener")}
                >
                  Screener
                </Menu.Item>
                <Menu.Item
                  active={this.props.location.pathname === "/portfolio"}
                  onClick={() => this.props.history.push("/portfolio")}
                >
                  My Portfolio
                </Menu.Item>

                <div
                  style={{
                    marginBottom: "auto",
                    marginTop: "auto",
                    marginRight: "auto",
                    marginLeft: "auto",
                  }}
                  className="searchbar"
                >
                  <SearchBar />
                </div>

                <Menu.Item position="right">
                  {isAuthenticated ? (
                    <React.Fragment>
                      <Link to="/pricing/">
                        <Label color="blue">Pro</Label>
                      </Link>
                      <Button
                        inverted={!fixed}
                        style={{ marginLeft: "0.5em" }}
                        onClick={() => {
                          this.props.logout();
                          this.props.history.push("/");
                        }}
                      >
                        Logout
                      </Button>

                      <Button
                        primary
                        inverted
                        onClick={() =>
                          this.props.history.push("/account/change-email")
                        }
                        style={{ marginLeft: "0.5em" }}
                      >
                        Account
                      </Button>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Link to="/pricing/">
                        <Label color="blue">Pro</Label>
                      </Link>
                      <Button
                        inverted={!fixed}
                        onClick={() => this.props.history.push("/login")}
                        style={{ marginLeft: "0.5em" }}
                      >
                        Login
                      </Button>
                      <br />
                      <Button
                        inverted={!fixed}
                        primary={fixed}
                        style={{ marginLeft: "0.5em" }}
                        onClick={() => this.props.history.push("/signup")}
                      >
                        Signup
                      </Button>
                    </React.Fragment>
                  )}
                </Menu.Item>
              </Container>
            </Menu>
          </Segment>
        </Visibility>

        {children}

        <Footer />
      </Media>
    );
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DesktopContainer)
);
