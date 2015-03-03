'use strict';

const _ = require('lodash');
const Dispatcher = require('../dispatcher/AppDispatcher.js');
const DataStore = require('./DataStore');
const Store = require('./Store');
let isPullingMain = false;
let progressMain;
let isToUpdate = false;

const self = {}; // TODO: remove once fat-arrow this substitution is fixed in es6 transpiler
module.exports = _.extend(self, Store(
  Dispatcher,
  // waitFor other Stores
  [], {
  // action handlers

  PULLING_MAIN_CFF: () => {
    isPullingMain = true;
    return true;
  },

  PULLING_BANK_CFF: () => {
  },

  MAIN_CFF_PULLED: () => {
    isPullingMain = false;
    progressMain = undefined;
    return false;
  },

  GET_MAIN_PULL_PROGRESS: (_progress) => {
    isToUpdate = !_.isEqual(progressMain, _progress);
    progressMain = _progress;
    return true;
  }

}, {
  // custom getters
  getProgressMain() {
    return progressMain;
  },

  isPullingMain() {
    return isPullingMain;
  },

  isToUpdate() {
    return isToUpdate;
  }

}));
