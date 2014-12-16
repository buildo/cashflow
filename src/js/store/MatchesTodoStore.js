'use strict';

const _ = require('lodash');
const DataStore = require('./DataStore');
const Store = require('./Store');
const CFFStore = require('./CFFStore');
const CFFManagerAssistantApp = require('cff-manager-assistant');

let matchesTodo;
let isLoading = true;
let selectedMatch = 0;

const self = {}; // TODO: remove once fat-arrow this substitution is fixed in es6 transpiler
module.exports = _.extend(self, Store(
  // waitFor other Stores
  [], {
  // action handlers
  GETTING_MATCHES_TODO: () => {
    matchesTodo = undefined;
    isLoading = true;
    return true;
  },

  MATCHES_TODO_UPDATED: (actionData) => {
    console.log(actionData);
    matchesTodo = actionData;
    isLoading = false;
    return true;
  },

  MATCH_TODO_SELECTED: (actionData) => {
    selectedMatch = actionData;
    return true;
  }

}, {
  // custom getters
  getMatchesTodo() {
    return matchesTodo;
  },

  getSelectedMatch() {
    return selectedMatch;
  },

  isLoading() {
    return isLoading;
  }

}));
