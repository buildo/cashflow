'use strict';

const alt = require('../alt');
const LoginActions = require('../actions/LoginActions');
const AppConstants = require('../constants/AppConstants');

class LoginStore {
  constructor() {
    this.bindActions(LoginActions);
  }

  onLogin() {
    this.loginState = AppConstants.LOGIN;
  }

  onLoginSuccess() {
    this.loginState = AppConstants.LOGIN_SUCCESS;
  }

  onLoginFail() {
    this.loginState = AppConstants.LOGIN_FAIL;
  }

  onResetLoginState() {
    this.loginState = undefined;
  }

}

module.exports = alt.createStore(LoginStore, 'LoginStore');
