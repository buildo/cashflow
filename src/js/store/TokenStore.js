'use strict';

const _ = require('lodash');
const C = require('../constants/AppConstants').ActionTypes;
const DataStore = require('./DataStore');
const Store = require('./Store');

let tokenState = C.CHECKING_TOKEN_STATE;

const self = {}; // TODO: remove once fat-arrow this substitution is fixed in es6 transpiler
module.exports = _.extend(self, Store(
  // waitFor other Stores
  [], {
  // action handlers

  CHECKING_TOKEN_STATE: () => {
    tokenState = C.CHECKING_TOKEN_STATE;
    return false;
  },

  TOKEN_IS_VALID: () => {
    tokenState = C.TOKEN_IS_VALID;
    return true;
  },

  TOKEN_IS_INVALID: () => {
    tokenState = C.TOKEN_IS_INVALID;
    return true;
  },


}, {

  getTokenState() {
    return tokenState;
  },

}));
