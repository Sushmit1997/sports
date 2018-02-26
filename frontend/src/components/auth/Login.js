import React from 'react';
import { Redirect } from 'react-router';
import { compose, branch, withState, withHandlers, renderComponent } from 'recompose';

import logo from '../../../public/assets/images/sports-logo.png';

import { LOCAL_AUTH_VARIABLE } from '../../constants/constants';

import { setTokenInHeader } from '../../utils/axios';
import login from '../../services/authServices/login';

const DEFAULT_LOGIN_ERROR_MESSAGE = 'Error occured in login';

const Login = (props) => {
  return (
    <div className="login-outer-container">
      <div className="login-inner-container">
        <div className="login-header">
          <a href="#">
            <img src={logo} alt="Sports logo" />
          </a>
        </div>
        <form className="login-form" onSubmit={props.handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder="EMAIL"
              name="email"
              required={true}
              onChange={props.handleEmailChange}
            />
            <input
              type="password"
              placeholder="PASSWORD"
              name="password"
              required={true}
              onChange={props.handlePasswordChange}
            />
          </div>
          <button type="submit">SIGN IN</button>
        </form>
      </div>
    </div>
  );
};

const checkAuthentication = (({ isAuthenticated }) => isAuthenticated);
const RedirectHere = ({ location, isAuthenticated }) => {
  const newRoute = location.state && location.state.from || { pathname: '/' };

  return <Redirect to={newRoute} />;
}
const RedirectIfAuthenticated = branch(
  checkAuthentication,
  renderComponent(RedirectHere)
);

export default compose(
  withState('email', 'setEmail', ''),
  withState('password', 'setPassword', ''),
  withHandlers({
    handleEmailChange: ({ setEmail }) => (e) => setEmail(e.target.value),
    handlePasswordChange: ({ setPassword }) => (e) => setPassword(e.target.value),
    handleLogin: ({ email, password, setAuthentication, showToaster }) => (e) => {
      e.preventDefault();
      login({ email, password })
        .then((loginResponse) => {
          if (loginResponse && loginResponse.tokens) {
            const res = setAuthentication(true);
            localStorage.setItem(
              LOCAL_AUTH_VARIABLE,
              JSON.stringify({
                isAuthenticated: true,
                refreshToken: loginResponse.tokens.refreshToken
              })
            );
            setTokenInHeader(loginResponse.tokens.accessToken);
            return;
          }
          throw DEFAULT_LOGIN_ERROR_MESSAGE;
        })
        .catch((error) => {
          const errorMessage = error && error.error && error.error.message;

          if (errorMessage) {
            showToaster(errorMessage);

            return;
          }

          showToaster(DEFAULT_LOGIN_ERROR_MESSAGE);
        });
    },
  }),
  RedirectIfAuthenticated
)(Login);
