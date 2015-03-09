'use strict';

const alt = require('../alt');
const API = require('../utils/api.js');
const handleError = require('./ErrorHandler.js');

class CFFActions {

  getMain() {
    API.cff.getMain().then(this.actions.getMainSuccess, this.actions.getMainFail);
    this.dispatch();
  }

  getMainSuccess(res) {
    this.dispatch(res.data.data.cffs.main);
  }

  getMainFail() {
    this.dispatch();
  }

  getBank() {
    API.cff.getBank().then(this.actions.getBankSuccess, this.actions.getBankFail);
    this.dispatch();
  }

  getBankSuccess(res) {
    this.dispatch(res.data.data.cffs.bank);
  }

  getBankFail() {
    this.dispatch();
  }

  getManual() {
    API.cff.getManual().then(this.actions.getManualSuccess, this.actions.getManualFail);
    this.dispatch();
  }

  getManualSuccess(res) {
    this.dispatch(res.data.data.cffs.manual);
  }

  getManualFail() {
    this.dispatch();
  }

  pullMain() {
    API.cff.pullMain().catch(handleError);
    this.dispatch();
  }

  getMainPullProgress() {
    API.progress.getMain().then((res) => this.dispatch(res.data.data.progress), handleError);
  }

  resetMainPullProgress() {
    API.progress.resetMain().then(() => this.dispatch(), handleError);
  }

  pullBank() {
    API.cff.pullBank().then(this.actions.getBank, handleError);
    this.dispatch();
  }

}

module.exports = alt.createActions(CFFActions);
