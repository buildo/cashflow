'use strict';

const _ = require('lodash');
const DataStore = require('./DataStore');
const Store = require('./Store');
const WebAPIUtils = require('../utils/WebAPIUtils.js');
const reportApp = require('../../../../cashflow/dist/index.js');
let isLoading;
let main;
let bank;

const self = {}; // TODO: remove once fat-arrow this substitution is fixed in es6 transpiler
module.exports = _.extend(self, Store(
  // waitFor other Stores
  [], {
  // action handlers
  MAIN_CFF_UPDATED: (actionData) => {
    console.log('MAIN_CFF', actionData);
    main = actionData;
    isLoading = false;
    return true;
  },

  LOADING_MAIN_CFF: () => {
    isLoading = true;
    return true;
  },

  BANK_CFF_UPDATED: () => {

    return true;
  }
}, {
  // custom getters
  getMainCFF() {
    return main;
  },

  isLoading() {
    return isLoading;
  },

  getMainReport(configs) {
    const _inputCFFs = [main];
    const _configs = configs;
    let _heuristics;
    return reportApp.processInputs(_inputCFFs, _configs, _heuristics);
  },

  getBankCFF() {
    return bank;
  }
}));
