'use strict';

const alt = require('../alt');
const _ = require('lodash');
const CFFStore = require('./CFFStore.js');
const DoneDataStore = require('./DoneDataStore.js');
const MatchesStore = require('./MatchesStore.js');
const ManualCFFDataStore = require('./ManualCFFDataStore.js');
const reportApp = require('../../../../cashflow/dist/index.js');
const CashflowActions = require('../actions/CashflowActions');
const CFFActions = require('../actions/CFFActions.js');
const MatchesActions = require('../actions/MatchActions.js');

const heuristics = require('../../files/Heuristics.js');
const cashflowConfigs = {
  // startPoint: {
  //   grossAmount: 17287.95,
  //   date: '2015-02-01'
  // },
  startPoint: {
    grossAmount: 6669.35,
    date: '2015-03-28'
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
    console.log('ON_UPDATE');
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
    const costsCFF = _.clone(CFFStoreState.bank, true);
    const manualLines = ManualCFFDataStore.getAll().map((obj) => obj.line);
    const manualCFF = {
      sourceId: 'MANUAL_CFF',
      sourceDescription: 'Manual lines',
      lines: manualLines
    };
    const emptyMatchesDataIDs = DoneDataStore.getAll().filter((obj) => obj.main === undefined).map((m) => m.data.id).join('|');
    // console.log(emptyMatchesDataIDs);
    // console.log(costsCFF.lines[0].payments[0].id);
    if (costsCFF) {
      costsCFF.lines = costsCFF.lines.filter((line) => {
        // if (emptyMatchesDataIDs.indexOf(line.payments[0].id) > -1) {
        //   console.log(line);
        // }
        return COSTS.indexOf(line.payments[0].methodType) > -1 || emptyMatchesDataIDs.indexOf(line.payments[0].id) > -1;
      });
    }
    const inputCFFs = [mainCFF, costsCFF, manualCFF].filter((cff) => typeof cff !== 'undefined');
    // const inputCFFs = [_.clone(CFFStoreState.bank, true)];
    if (inputCFFs.length === 0) {
      this.cashflowData = undefined;
      return true;
    }
    const report = reportApp.processInputs(inputCFFs, cashflowConfigs, heuristics);
    if (report.errors) {
      report.errors.forEach((error) => console.error(error));
    }
    this.cashflowData = report.cashflow;
    return true;
  }

}

module.exports = alt.createStore(CashflowStore, 'CashflowStore');
