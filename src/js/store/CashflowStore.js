'use strict';

const _ = require('lodash');
const Dispatcher = require('../dispatcher/AppDispatcher.js');
const DataStore = require('./DataStore');
const Store = require('./Store');
const CFFStore = require('./CFFStore');
const reportApp = require('../../../../cashflow/dist/index.js');
const heuristics = require('../../files/Heuristics.js');

let data;
let cashflowConfigs = {  // so views can know current state
  startValue: 0,
  filterParamters: {}
};

const updateData = () => {
  const mainCFF = CFFStore.getMainCFF();
  const inputCFFs = [mainCFF];
  const report = reportApp.processInputs(inputCFFs, cashflowConfigs, heuristics);
  data = report.cashflow;
};

const self = {}; // TODO: remove once fat-arrow this substitution is fixed in es6 transpiler
module.exports = _.extend(self, Store(
  Dispatcher,
  // waitFor other Stores
  [CFFStore], {
  // action handlers
  MAIN_CFF_UPDATED: () => {
    updateData();
    return true;
  },

  CASHFLOW_CONFIGS_UPDATED: (actionData) => {
    cashflowConfigs.startValue = actionData.startValue;
    cashflowConfigs.filterParamters = actionData.filterParamters;
    updateData();
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
