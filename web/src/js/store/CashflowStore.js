'use strict';

const alt = require('../alt');
const _ = require('lodash');
const CFFStore = require('./CFFStore.js');
const DoneDataStore = require('./DoneDataStore.js');
const MatchesStore = require('./MatchesStore.js');
const ManualCFFDataStore = require('./ManualCFFDataStore.js');
const reportApp = require('@buildo/cashflow-core');
const CashflowActions = require('../actions/CashflowActions');
const CFFActions = require('../actions/CFFActions.js');
const ManualActions = require('../actions/ManualActions.js');
const MatchesActions = require('../actions/MatchActions.js');

const heuristics = require('../../files/Heuristics.js');
const cashflowConfigs = {
  // startPoint: {
  //   grossAmount: 17287.95,
  //   date: '2015-02-01'
  // },
  startPoint: {
    grossAmount: 10107,
    date: '2015-03-09'
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
    this.bindAction(ManualActions.deleteManualLineSuccess, this.onUpdate);
    this.bindAction(ManualActions.saveManualLineSuccess, this.onUpdate);
    this.bindAction(ManualActions.createManualLineSuccess, this.onUpdate);
    this.bindAction(MatchesActions.getMatchesSuccess, this.onUpdate);
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
    // console.log('ON_UPDATE');
    this.errors = undefined;
    this.resetPointSelection();
    this.waitFor(CFFStore.dispatchToken);
    this.waitFor(MatchesStore.dispatchToken);
    this.waitFor(DoneDataStore.dispatchToken);
    const CFFStoreState = CFFStore.getState();
    const isLoading = CFFStoreState.isLoadingMain || CFFStoreState.isLoadingBank || CFFStoreState.isLoadingManual || MatchesStore.getState().isLoadingMatches;
    if (isLoading) {
      this.cashflowData = undefined;
      return true;
    }
    const mainCFF = CFFStoreState.main;
    const bankCFF = _.clone(CFFStoreState.bank, true);
    const costsCFF = _.clone(CFFStoreState.bank, true);
    const manualLines = ManualCFFDataStore.getAll().map((obj) => obj.line);
    const manualCFF = {
      sourceId: 'MANUAL_CFF',
      sourceDescription: 'Manual lines',
      lines: manualLines
    };
    const emptyMatchesDataIDs = DoneDataStore.getAll().filter((obj) => obj.main === undefined).map((m) => m.data.id).join('|');
    if (costsCFF) {
      costsCFF.lines = costsCFF.lines.filter((line) => {
        // return COSTS.indexOf(line.payments[0].methodType) > -1 || emptyMatchesDataIDs.indexOf(line.payments[0].id) > -1;
        return emptyMatchesDataIDs.indexOf(line.payments[0].id) > -1;
      });
    }
    const inputCFFs = [mainCFF, costsCFF, manualCFF].filter((cff) => typeof cff !== 'undefined');
    if (inputCFFs.length === 0) {
      console.log('no input');
      this.cashflowData = undefined;
      return true;
    }
    const report = reportApp.processInputs(inputCFFs, cashflowConfigs, heuristics);
    if (report.errors) {
      this.errors = report.errors;
      console.log(report.errors);
      return true;
    }
    this.cashflowData = report.cashflow;
    if (!bankCFF) {
      return true;
    }
    bankCFF.lines = bankCFF.lines.filter((line) => line.payments[0].methodType !== 'credit card');
    const bankReport = reportApp.processInputs([bankCFF], cashflowConfigs, heuristics);
    if (bankReport.errors) {
      bankReport.errors.forEach((error) => console.error(error));
    }
    this.cashflowData.bank = bankReport.cashflow.history.filter((p) => p.date >= '2015-01-01');
    return true;
  }

}

module.exports = alt.createStore(CashflowStore, 'CashflowStore');
