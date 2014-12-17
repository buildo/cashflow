'use strict';

const _ = require('lodash');
const Dispatcher = require('../dispatcher/AppDispatcher.js');
const DataStore = require('./DataStore');
const Store = require('./Store');
const CFFStore = require('./CFFStore');
const CFFManagerAssistantApp = require('cff-manager-assistant');

let matchesDone;
let isLoading;

const self = {}; // TODO: remove once fat-arrow this substitution is fixed in es6 transpiler
module.exports = _.extend(self, Store(
  Dispatcher,
  // waitFor other Stores
  [], {
  // action handlers
  GETTING_MATCHES_DONE: () => {
    matchesDone = undefined;
    isLoading = true;
    return true;
  },

  MATCHES_DONE_UPDATED: (actionData) => {
    matchesDone = actionData;
    isLoading = false;
    return true;
  },

}, {
  // custom getters
  getMatchesDone() {
    return matchesDone;
  },

  isLoading() {
    return isLoading;
  }

}));
