'use strict';

const alt = require('../alt');
const API = require('../utils/api.js');

class LoginActions {

  logout(res) {
    this.dispatch(res.data);
  }

  login(loginFormData) {
    API.login.login(loginFormData).then(this.actions.loginSuccess, this.actions.loginFail);
    this.dispatch();
  }

  loginSuccess(res) {
    this.dispatch(res.data.data);
  }

  loginFail(res) {
    this.dispatch(res.data.data);
  }

  resetLoginState() {
    this.dispatch();
  }
}

module.exports = alt.createActions(LoginActions);