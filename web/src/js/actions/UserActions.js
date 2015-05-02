'use strict';

const alt = require('../alt');
const API = require('../utils/api.js');
const handleError = require('./ErrorHandler.js');

class UserActions {

  getCurrentUser() {
    API.user.getCurrentUser().then(this.actions.getCurrentUserSuccess, handleError);
    this.dispatch();
  }

  getCurrentUserSuccess(res) {
    this.dispatch(res.data.data.user);
  }

}

module.exports = alt.createActions(UserActions);