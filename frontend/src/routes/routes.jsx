import React from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import ErrorHandler from "../components/ErrorHandler";

import Login from "../pages/login";
import Signup from "../pages/signup";
import LandingPage from "../pages/landing";
import Screener from "../pages/screener";
import News from "../pages/news";
import SEC from "../pages/sec";
import ChangeEmail from "../modules/Account/ChangeEmail";
import ChangePassword from "../modules/Account/ChangePassword";
import Billing from "../modules/Account/Billing";
import Profile from "../pages/profile";
import Portfolio from "../pages/portfolio";
import Page404 from "../pages/page404";
import Pricing from "../pages/pricing";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const authenticated = localStorage.getItem("token") !== null;
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
};

const BaseRouter = () => (
    <ErrorHandler>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/login/" component={Login} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/screener" component={Screener} />
        <Route exact path="/news" component={News} />
        <Route exact path="/sec-filings" component={SEC} />
        <Route path="/profile/:symbol" component={Profile} />
        <Route exact path="/pricing" component={Pricing} />

        <PrivateRoute
          exact
          path="/account/change-email"
          component={ChangeEmail}
        />
        <PrivateRoute
          exact
          path="/account/change-password"
          component={ChangePassword}
        />
        <PrivateRoute exact path="/account/billing" component={Billing} />
        <PrivateRoute exact path="/portfolio" component={Portfolio} />

        <Route component={Page404} />
      </Switch>
    </ErrorHandler>
);

export default BaseRouter;
