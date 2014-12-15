'use strict';

const _ = require('lodash');
const C = require('../constants/AppConstants').ActionTypes;
const DataStore = require('./DataStore');
const Store = require('./Store');

let loginState;

const self = {}; // TODO: remove once fat-arrow this substitution is fixed in es6 transpiler
module.exports = _.extend(self, Store(
  // waitFor other Stores
  [], {
  // action handlers

  RESET_LOGIN_STATE: () => {
    loginState = undefined;
    return true;
  },

  LOGGED_IN: () => {
    loginState = C.LOGGED_IN;
    return true;
  },

  LOGIN_FAIL: () => {
    loginState = C.LOGIN_FAIL;
    return true;
  },

  LOGIN_START: () => {
    loginState = C.LOGIN_START;
    return true;
  },

}, {
  // custom getters
  getLoginState() {
    return loginState;
  },

}));
