'use strict';

const alt = require('../alt');
const CFFActions = require('../actions/CFFActions');
const ManualCFFDataStore = require('./ManualCFFDataStore');

class CFFStore {
  constructor() {
    this.bindActions(CFFActions);
  }

  onGetMain() {
    this.isLoadingMain = true;
  }

  onGetBank() {
    this.isLoadingBank = true;
  }

  onGetManual() {
    this.isLoadingManual = true;
  }

  onGetMainSuccess(cff) {
    this.main = cff;
    this.isLoadingMain = false;
  }

  onGetBankSuccess(cff) {
    this.bank = cff;
    this.isLoadingBank = false;
  }

  onGetManualSuccess(cff) {
    this.manual = {};
    this.isLoadingManual = false;
  }

  onGetMainFail() {
    this.main = undefined;
    this.isLoadingMain = false;
  }

  onGetBankFail() {
    this.bank = undefined;
    this.isLoadingBank = false;
  }

  onGetManualFail() {
    this.manual = undefined;
    this.isLoadingManual = false;
  }

  onPullMain() {
    // this.isLoadingMain = true;
  }

  onPullMainFail() {
    // this.isLoadingMain = false;
  }

  onPullBank() {
    this.isLoadingBank = true;
  }

  onPullBankFail() {
    this.isLoadingBank = false;
  }

}

module.exports = alt.createStore(CFFStore, 'CFFStore');
