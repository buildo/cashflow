'use strict';

const _ = require('lodash');
const Dispatcher = require('../dispatcher/AppDispatcher.js');
const DataStore = require('./DataStore');
const Store = require('./Store');
const reportApp = require('../../../../cashflow/dist/index.js');
let isLoadingMain = true;
let isLoadingBank = false;
let main;
let bank;

const self = {}; // TODO: remove once fat-arrow this substitution is fixed in es6 transpiler
module.exports = _.extend(self, Store(
  Dispatcher,
  // waitFor other Stores
  [], {
  // action handlers
  MAIN_CFF_UPDATED: (actionData) => {
    console.log('MAIN_CFF', actionData);
    main = actionData;
    isLoadingMain = false;
    return true;
  },

  GETTING_MAIN_CFF: () => {
    isLoadingMain = true;
    return true;
  },

  GETTING_BANK_CFF: () => {
    isLoadingBank = true;
    return true;
  },

  BANK_CFF_UPDATED: (actionData) => {
    console.log('BANK_CFF', actionData);
    bank = actionData;
    isLoadingBank = false;
    return true;
  }
}, {
  // custom getters
  getMainCFF() {
    return main;
  },

  getBankCFF() {
    return bank;
  },

  isLoading() {
    return isLoadingMain || isLoadingBank;
  },

  isLoadingMain() {
    return isLoadingMain;
  },

  isLoadingBank() {
    return isLoadingBank;
  }
}));
