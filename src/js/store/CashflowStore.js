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

const updateData = (isLoading) => {
  if (isLoading) {
    data = undefined;
    return;
  }
  const mainCFF = CFFStore.getMainCFF();
  const costsCFF = CFFStore.getBankCFF();
  costsCFF.lines = costsCFF.lines.filter((line) => line.payments[0].methodType === 'cost');
  const inputCFFs = [mainCFF, costsCFF];
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
    updateData(CFFStore.isLoading());
    return true;
  },

  BANK_CFF_UPDATED: () => {
    updateData(CFFStore.isLoading());
    return true;
  },

  CASHFLOW_CONFIGS_UPDATED: (actionData) => {
    cashflowConfigs.startValue = actionData.startValue;
    cashflowConfigs.filterParamters = actionData.filterParamters;
    updateData(CFFStore.isLoading());
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
