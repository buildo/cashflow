'use strict';

const alt = require('../alt');
const TokenActions = require('../actions/TokenActions');
const LoginActions = require('../actions/LoginActions');
const AppConstants = require('../constants/AppConstants');

class TokenStore {
  constructor() {
    this.bindActions(TokenActions);
    this.bindActions(LoginActions);
  }

  onCheckToken() {
    this.tokenState = AppConstants.TOKEN;
  }

  onCheckTokenSuccess() {
    this.tokenState = AppConstants.TOKEN_SUCCESS;
  }

  onCheckTokenFail() {
    this.tokenState = AppConstants.TOKEN_FAIL;
  }

  onLoginSuccess(data) {
    localStorage.setItem('cashflow_token', data.credentials.token);
    this.onCheckTokenSuccess();
  }

  onLogout() {
    localStorage.setItem('cashflow_token', '');
    this.onCheckTokenFail();
  }

}

module.exports = alt.createStore(TokenStore, 'TokenStore');
