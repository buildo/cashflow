'use strict';

const alt = require('../alt');
const TokenActions = require('../actions/TokenActions');
const LoginActions = require('../actions/LoginActions');
const CHECKING_TOKEN_STATE = 'CHECKING_TOKEN_STATE';
const TOKEN_IS_VALID = 'TOKEN_IS_VALID';
const TOKEN_IS_INVALID = 'TOKEN_IS_INVALID';

class TokenStore {
  constructor() {
    this.bindActions(TokenActions);
    this.bindActions(LoginActions);
  }

  onCheckToken() {
    this.tokenState = CHECKING_TOKEN_STATE;
  }

  onCheckTokenSuccess() {
    this.tokenState = TOKEN_IS_VALID;
  }

  onCheckTokenFail() {
    this.tokenState = TOKEN_IS_INVALID;
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
