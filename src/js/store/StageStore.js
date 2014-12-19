'use strict';

const _ = require('lodash');
const Dispatcher = require('../dispatcher/AppDispatcher.js');
const Store = require('./Store');
const StageDataStore = require('./StageDataStore');

let isLoading = true;
let selectedMatchIndex = 0;

const self = {}; // Stage: remove once fat-arrow this substitution is fixed in es6 transpiler
module.exports = _.extend(self, Store(
  Dispatcher,
  // waitFor other Stores
  [StageDataStore], {
  // action handlers
  GETTING_MATCHES: () => {
    isLoading = true;
    return true;
  },

  MATCHES_UPDATED: (actionData) => {
    isLoading = false;
    return true;
  },

  SAVED_MATCH: () => {
    selectedMatchIndex = 0;
  },

  MATCH_STAGE_SELECTED: (actionData) => {
    console.log('SELECTED_MATCH: ' + actionData);
    selectedMatchIndex = actionData;
    return true;
  },

}, {
  // custom getters
  getStagedMatches() {
    return isLoading ? [] : StageDataStore.getAll();
  },

  getSelectedMatchIndex() {
    return selectedMatchIndex;
  },

  isLoading() {
    return isLoading;
  }

}));
