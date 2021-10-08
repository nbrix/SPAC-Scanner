import React, { Component } from "react";
import "./App.css";
import "semantic-ui-css/semantic.min.css";

import { connect } from "react-redux";
import BaseRouter from "./routes/routes";
import * as actions from "./store/actions/auth";
import "semantic-ui-css/semantic.min.css";
import CustomLayout from "./modules/Layout/Layout";

import { ConnectedRouter } from "connected-react-router";
import { history } from "./store/configureStore";

class App extends Component {
  state = {
    companies: [],
  };

  componentDidMount() {
    this.props.onTryAutoSignup();
  }

  render() {
    return (
      <div>
        <ConnectedRouter history={history}>
          <CustomLayout {...this.props}>
            <BaseRouter />
          </CustomLayout>
        </ConnectedRouter>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
