'use strict';

const _ = require('lodash');
const Dispatcher = require('../dispatcher/AppDispatcher.js');
const DataStore = require('./DataStore');
const Store = require('./Store');
const CFFStore = require('./CFFStore');
const reportApp = require('../../../../cashflow/dist/index.js');
const heuristics = require('../../files/Heuristics.js');
const COSTS = 'bank fee|withdrawal|tax';

let data;
let cashflowConfigs = {  // so views can know current state
  startPoint: {
    grossAmount: 17287.95,
    date: '2015-02-01'
  },
  filterParamters: {}
};

const updateData = (isLoading) => {
  if (isLoading) {
    data = undefined;
    return;
  }
  const mainCFF = CFFStore.getMainCFF();
  const costsCFF = _.clone(CFFStore.getBankCFF(), true);
  const manualCFF = CFFStore.getManualCFF();
  if (costsCFF) {
    costsCFF.lines = costsCFF.lines.filter((line) => COSTS.indexOf(line.payments[0].methodType) > -1);
  }
  const inputCFFs = [mainCFF, costsCFF, manualCFF].filter((cff) => typeof cff !== 'undefined');
  if (inputCFFs.length === 0) {
    data = undefined;
    return;
  }
  const report = reportApp.processInputs(inputCFFs, cashflowConfigs, heuristics);
  if (report.errors) {
    report.errors.forEach((error) => console.error(error));
  }
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

  MANUAL_CFF_UPDATED: () => {
    updateData(CFFStore.isLoading());
    return true;
  },

  MANUAL_CFF_SAVED: () => {
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
