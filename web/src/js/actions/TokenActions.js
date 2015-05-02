'use strict';

const alt = require('../alt');
const API = require('../utils/api.js');

class TokenActions {

  checkToken() {
    API.user.getCurrentUser().then(this.actions.checkTokenSuccess, this.actions.checkTokenFail);
    this.dispatch();
  }

  checkTokenSuccess() {
    this.dispatch();
  }

  checkTokenFail() {
    this.dispatch();
  }

}

module.exports = alt.createActions(TokenActions);