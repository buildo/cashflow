'use strict';

const alt = require('../../alt');

class LoginActions {
  constructor() {
    this.generateActions('resetLoginState', 'logOut');
  }
}

module.exports = alt.createActions(LoginActions);