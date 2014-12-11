'use strict';

const _ = require('lodash');
const DataStore = require('./DataStore');
const Store = require('./Store');
const CashflowStore = require('./CashflowStore');
let index;
let pathName;

const resetPointSelection = () => {
  index = pathName = undefined;
};

const self = {}; // TODO: remove once fat-arrow this substitution is fixed in es6 transpiler
module.exports = _.extend(self, Store(
  // waitFor other Stores
  [CashflowStore], {
  // action handlers
  MAIN_CFF_UPDATED: () => {
    resetPointSelection();
    return true;
  },

  CASHFLOW_CONFIGS_UPDATED: (actionData) => {
    resetPointSelection();
    return true;
  },

  CASHFLOW_POINT_SELECTED: (actionData) => {
    index = actionData.index;
    pathName = actionData.pathName.toLowerCase();
    return true;
  }

}, {
  // custom getters
  getCurrentSelectedPayments() {
    const data = CashflowStore.getCashflowData();
    return data && pathName && index > 0 ? data[pathName][index].info : undefined;
  }

}));
