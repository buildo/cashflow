'use strict';

const _ = require('lodash');
const CFFStore = require('./CFFStore');
const reportApp = require('../../../../cashflow/dist/index.js');
const CashflowActions = require('../actions/CashflowActions');

const heuristics = require('../../files/Heuristics.js');
const cashflowConfigs = {
  startPoint: {
    grossAmount: 17287.95,
    date: '2015-02-01'
  },
  filterParamters: {}
};
const COSTS = 'bank fee|withdrawal|tax';

class CashflowStore {
  constructor() {
    this.bindActions(CashflowActions);
    this.bindAction(ServerActions.getMainSuccess, this.onUpdate);
    this.bindAction(ServerActions.getBankSuccess, this.onUpdate);
    this.bindAction(ServerActions.getManualSuccess, this.onUpdate);
    // this.bindAction(ServerActions.saveManualSuccess, this.onUpdate);
  }

  resetPointSelection() {
    this.index = this.pathName = undefined;
  }

  onSelectPoint(actionData) {
    if (actionData.index === this.index && actionData.pathName.toLowerCase() === this.pathName) {
      this.resetPointSelection();
    } else {
      this.index = actionData.index;
      this.pathName = actionData.pathName.toLowerCase();
    }
  }

  onUpdate() {
    this.resetPointSelection();
    this.waitFor(CFFStore.dispatchToken);
    if (CFFStore.isLoading()) {
      this.data = undefined;
      return true;
    }
    const mainCFF = CFFStore.getMainCFF();
    const costsCFF = _.clone(CFFStore.getBankCFF(), true);
    const manualCFF = CFFStore.getManualCFF();
    if (costsCFF) {
      costsCFF.lines = costsCFF.lines.filter((line) => COSTS.indexOf(line.payments[0].methodType) > -1);
    }
    const inputCFFs = [mainCFF, costsCFF, manualCFF].filter((cff) => typeof cff !== 'undefined');
    if (inputCFFs.length === 0) {
      this.data = undefined;
      return true;
    }
    const report = reportApp.processInputs(inputCFFs, cashflowConfigs, heuristics);
    if (report.errors) {
      report.errors.forEach((error) => console.error(error));
    }
    this.data = report.cashflow;
  }

}

