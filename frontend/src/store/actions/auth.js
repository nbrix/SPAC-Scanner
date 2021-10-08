import axios from "axios";
import * as actionTypes from "./actionTypes";
import { APIEndpoint } from "../../constants";

const WEEK = 60 * 60 * 24 * 7;

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, member) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    member: member,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const authLogin = (username, password) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post(APIEndpoint + "/rest-auth/login/", {
        username,
        password,
      })
      .then((res) => {
        const token = res.data.key;
        const user = res.data.user.is_member;
        const expirationDate = new Date(new Date().getTime() + 2 * WEEK * 1000);
        localStorage.setItem("user", user);
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(authSuccess(token, user));
        dispatch(checkAuthTimeout(2 * WEEK));
      })
      .catch((err) => {
        dispatch(authFail(err.response.data.errors));
      });
  };
};

export const authSignup = (username, email, password1, password2) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post(APIEndpoint + "/rest-auth/registration/", {
        username,
        email,
        password1,
        password2,
      })
      .then((res) => {
        const token = res.data.key;
        const user = res.data.user.is_member;
        const expirationDate = new Date(new Date().getTime() + 2 * WEEK * 1000);
        localStorage.setItem("user", user);
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(authSuccess(token, user));
        dispatch(checkAuthTimeout(2 * WEEK));
      })
      .catch((err) => {
        dispatch(authFail(err.response.data.errors));
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const user = localStorage.getItem("user");
        dispatch(authSuccess(token, user));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};
