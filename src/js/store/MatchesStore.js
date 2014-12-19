'use strict';

const _ = require('lodash');
const Dispatcher = require('../dispatcher/AppDispatcher.js');
const C = require('../constants/AppConstants').ActionTypes;
const Store = require('./Store');

let isMatchesOutdated;

const self = {}; // TODO: remove once fat-arrow this substitution is fixed in es6 transpiler
module.exports = _.extend(self, Store(
  Dispatcher,
  // waitFor other Stores
  [], {
  // action handlers
  STAGED_MATCH_DELETED: () => {
    isMatchesOutdated = true;
    return true;
  },

  GETTING_MATCHES: () => {
    isMatchesOutdated = false;
    return true;
  }

}, {
  // custom getters

  isMatchesOutdated() {
    return isMatchesOutdated;
  }

}));
