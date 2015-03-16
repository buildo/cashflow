'use strict';

const alt = require('../alt');
const _ = require('lodash');
const CFFStore = require('./CFFStore.js');
const ManualCFFDataStore = require('./ManualCFFDataStore.js');
const reportApp = require('../../../../cashflow/dist/index.js');
const CashflowActions = require('../actions/CashflowActions');
const CFFActions = require('../actions/CFFActions.js');

const heuristics = require('../../files/Heuristics.js');
const cashflowConfigs = {
  startPoint: {
    grossAmount: 17287.95,
    date: '2015-02-01'
  },
  filterParameters: {}
};
const COSTS = 'bank fee|withdrawal|tax';

class CashflowStore {
  constructor() {
    this.bindActions(CashflowActions);
    this.bindAction(CFFActions.getMainSuccess, this.onUpdate);
    this.bindAction(CFFActions.getBankSuccess, this.onUpdate);
    this.bindAction(CFFActions.getManualSuccess, this.onUpdate);
    this.bindAction(CFFActions.deleteManualLineSuccess, this.onUpdate);
    this.bindAction(CFFActions.saveManualLineSuccess, this.onUpdate);
    this.bindAction(CFFActions.createManualLineSuccess, this.onUpdate);
  }

  resetPointSelection() {
    this.index = this.pathId = undefined;
  }

  onSelectPoint(actionData) {
    const point = actionData[0];
    if (point.index === this.index && point.id.toLowerCase() === this.pathId) {
      this.resetPointSelection();
    } else {
      this.index = point.index;
      this.pathId = point.id.toLowerCase();
    }
  }

  onUpdate() {
    this.resetPointSelection();
    this.waitFor(CFFStore.dispatchToken);
    const CFFStoreState = CFFStore.getState();
    const isLoading = CFFStoreState.isLoadingMain || CFFStoreState.isLoadingBank || CFFStoreState.isLoadingManual;
    if (isLoading) {
      this.cashflowData = undefined;
      return true;
    }
    const mainCFF = CFFStoreState.main;
    const costsCFF = _.clone(CFFStoreState.bank, true);
    const manualLines = ManualCFFDataStore.getAll().map((obj) => obj.line);
    const manualCFF = {
      sourceId: 'MANUAL_CFF',
      sourceDescription: 'Manual lines',
      lines: manualLines
    };
    if (costsCFF) {
      costsCFF.lines = costsCFF.lines.filter((line) => COSTS.indexOf(line.payments[0].methodType) > -1);
    }
    const inputCFFs = [mainCFF, costsCFF, manualCFF].filter((cff) => typeof cff !== 'undefined');
    if (inputCFFs.length === 0) {
      this.cashflowData = undefined;
      return true;
    }
    const report = reportApp.processInputs(inputCFFs, cashflowConfigs, heuristics);
    if (report.errors) {
      report.errors.forEach((error) => console.error(error));
    }
    this.cashflowData = report.cashflow;
  }

}

module.exports = alt.createStore(CashflowStore, 'CashflowStore');
