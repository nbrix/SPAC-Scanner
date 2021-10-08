/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import { createMedia } from '@artsy/fresnel'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Button,
  Container,
  Icon,
  Menu,
  Segment,
  Sidebar,
  Label,
} from 'semantic-ui-react'
import { withRouter, Link } from "react-router-dom";
import { logout } from "../../store/actions/auth";
import { connect } from "react-redux";
import Footer from "../../modules/Footer/Footer";

const { Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
})

class MobileContainer extends Component {
  state = {}

  handleSidebarHide = () => this.setState({ sidebarOpened: false })

  handleToggle = () => this.setState({ sidebarOpened: true })

  handleMenuClick = path => {
    this.props.history.push(path)
    this.setState({ sidebarOpened: false })
  }

  render() {
    const { children, isAuthenticated } = this.props
    const { sidebarOpened } = this.state

    return (
      <Media as={Sidebar.Pushable} at='mobile'>
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation='overlay'
            inverted
            onHide={this.handleSidebarHide}
            vertical
            visible={sidebarOpened}
          >
            <Menu.Item active={this.props.location.pathname === "/"} onClick={() => this.handleMenuClick("/")}>
              Home
            </Menu.Item>
            <Menu.Item active={this.props.location.pathname === "/news"} onClick={() => this.handleMenuClick("/news")}>News</Menu.Item>
            <Menu.Item active={this.props.location.pathname === "/sec-filings"} onClick={() => this.handleMenuClick("/sec-filings")}>SEC Filings</Menu.Item>
            <Menu.Item active={this.props.location.pathname === "/screener"} onClick={() => this.handleMenuClick("/screener")}>Screener</Menu.Item>
            <Menu.Item active={this.props.location.pathname === "/portfolio"} onClick={() => this.handleMenuClick("/portfolio")}>Portfolio</Menu.Item>
          </Sidebar>

          <Sidebar.Pusher dimmed={sidebarOpened}>
            <Segment
              inverted
              textAlign='center'
              style={{padding: '1em 0em' }}
              vertical
            >
              <Container>
                <Menu inverted pointing secondary size='large'>
                  <Menu.Item onClick={this.handleToggle}>
                    <Icon name='sidebar' />
                  </Menu.Item>
                  <Menu.Item position='right'>
                  {isAuthenticated ? (
                    <React.Fragment>
                      <Link to='/pricing/'><Label color='blue'>Pro</Label></Link>
                    <Button
                      inverted
                      onClick={() => {this.props.logout(); this.props.history.push("/");}}
                      style={{ marginLeft: "0.5em" }}
                    >
                      Logout
                    </Button>
                    <Button
                    primary
                    inverted
                    onClick={() => this.props.history.push("/account/change-email")}
                    style={{ marginLeft: "0.5em" }}
                  >
                    Account
                  </Button>
                  </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Link to='/pricing/'><Label color='blue'>Pro</Label></Link>
                      <Button
                        inverted
                        onClick={() => this.props.history.push("/login")}
                        style={{ marginLeft: "0.5em" }}
                      >
                        Login
                      </Button>
                      <Button
                        inverted
                        style={{ marginLeft: "0.5em" }}
                        onClick={() => this.props.history.push("/signup")}
                      >
                        Signup
                      </Button>
                    </React.Fragment>
                  )}
                  </Menu.Item>
                </Menu>
              </Container>
              
            </Segment>

            {children}

            <Footer />
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Media>
    )
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
}

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
  connect(mapStateToProps, mapDispatchToProps)(MobileContainer)
);
