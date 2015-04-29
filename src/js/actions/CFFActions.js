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
    this.dispatch(res.data.data.cffs.manualLines);
  }

  getManualFail() {
    this.dispatch();
  }

  saveManualLine(line) {
    API.cff.saveManualLine(line).then(() => this.actions.saveManualLineSuccess(line), () => this.actions.saveManualLineFail(line));
    this.dispatch(line);
  }

  saveManualLineSuccess(line) {
    this.dispatch(line);
  }

  saveManualLineFail(line) {
    this.dispatch(line);
  }

  createManualLine(line) {
    API.cff.saveManualLine(line).then(() => this.actions.createManualLineSuccess(line), () => this.actions.createManualLineFail(line));
    this.dispatch(line);
  }

  createManualLineSuccess(line) {
    this.dispatch(line);
  }

  createManualLineFail(line) {
    this.dispatch(line);
  }

  deleteManualLine(lineId) {
    API.cff.deleteManualLine(lineId).then(() => this.actions.deleteManualLineSuccess(lineId), () => this.actions.deleteManualLineFail(lineId));
    this.dispatch(lineId);
  }

  deleteManualLineSuccess(lineId) {
    this.dispatch(lineId);
  }

  deleteManualLineFail(lineId) {
    this.dispatch(lineId);
  }

  pullMain() {
    API.cff.pullMain().catch(this.actions.pullMainFail);
    this.dispatch();
  }

  pullMainFail() {
    this.dispatch();
  }

  getMainPullProgress() {
    API.progress.getMain().then((res) => this.dispatch(res.data.data ? res.data.data.progress : undefined), handleError);
  }

  resetMainPullProgress() {
    API.progress.resetMain().then(() => this.dispatch(), handleError);
  }

  pullBank() {
    API.cff.pullBank().then(this.actions.pullBankSuccess, this.actions.pullBankFail);
    this.dispatch();
  }

  pullBankSuccess() {
    this.actions.getBank.defer();
    this.dispatch();
  }

  pullBankFail() {
    this.dispatch();
  }
}

module.exports = alt.createActions(CFFActions);
