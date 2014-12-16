'use strict';

const _ = require('lodash');
const DataStore = require('./DataStore');
const Store = require('./Store');

let stagedLines;
let isLoading = false;

const self = {}; // TODO: remove once fat-arrow this substitution is fixed in es6 transpiler
module.exports = _.extend(self, Store(
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

}, {
  // custom getters
  getStagedLines() {
    return stagedLines;
  },

  isLoading() {
    return isLoading;
  }

}));
