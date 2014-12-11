'use strict';

const _ = require('lodash');
const DataStore = require('./DataStore');
const Store = require('./Store');
const CFFStore = require('./CFFStore');
let data;
let cashflowConfigs = {  // so views can know current state
  startValue: 0,
  filterParamters: {}
};

const self = {}; // TODO: remove once fat-arrow this substitution is fixed in es6 transpiler
module.exports = _.extend(self, Store(
  // waitFor other Stores
  [CFFStore], {
  // action handlers
  MAIN_CFF_UPDATED: () => {
    const report = CFFStore.getMainReport(cashflowConfigs);
    console.log(report);
    data = report.cashflow;
    return true;
  },

  CASHFLOW_CONFIGS_UPDATED: (actionData) => {
    cashflowConfigs.startValue = actionData.startValue;
    cashflowConfigs.filterParamters = actionData.filterParamters;
    data = CFFStore.getMainReport(cashflowConfigs).cashflow;
    return true;
  }

}, {
  // custom getters
  getCashflowData() {
    return data;
  },

  getCashflowConfigs() {
    return cashflowConfigs;
  },

}));
