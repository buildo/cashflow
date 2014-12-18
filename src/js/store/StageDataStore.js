'use strict';

const _ = require('lodash');
const Dispatcher = require('../dispatcher/AppDispatcher.js');
const DataStore = require('./DataStore');
const Store = require('./Store');

let stagedLines;
let isLoading = false;

const self = {}; // TODO: remove once fat-arrow this substitution is fixed in es6 transpiler
module.exports = _.extend(self, Store.Optimistic, Store(
  Dispatcher,
  // waitFor other Stores
  [],

  {
  // action handlers
  GETTING_STAGED_LINES: () => {
    isLoading = true;
    return true;
  },

  STAGED_LINES_UPDATED: (actionData) => {
    stagedLines = actionData;
    console.log(stagedLines);
    isLoading = false;
    return true;
  },

  SAVE_MATCH_TO_STAGE: (actionData, optimistic, undo) => {
    return undo ? self.remove(actionData.id) : self.upsert(actionData.id, actionData.match);
  }

}, {
  // custom getters
  getStagedLines() {
    return stagedLines;
  },

  isLoading() {
    return isLoading;
  }

}));
