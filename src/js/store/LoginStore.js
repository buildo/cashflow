'use strict';

const alt = require('../alt');
const LoginActions = require('../actions/LoginActions');
const LOGIN_START = 'LOGIN_START';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAIL = 'LOGIN_FAIL';

class LoginStore {
  constructor() {
    this.bindActions(LoginActions);
  }

  onLogin() {
    this.loginState = LOGIN_START;
  }

  onLoginSuccess() {
    this.loginState = LOGIN_SUCCESS;
  }

  onLoginFail() {
    this.loginState = LOGIN_FAIL;
  }

  onResetLoginState() {
    this.loginState = undefined;
  }

}

module.exports = alt.createStore(LoginStore, 'LoginStore');
