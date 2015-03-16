'use strict';

const alt = require('../alt');
const DataStore = require('./DataStore');
const CFFActions = require('../actions/CFFActions');

class ManualCFFDataStore extends DataStore {

  constructor() {
    super(ManualCFFDataStore);
    this.bindActions(CFFActions);
    this.bindAction(CFFActions.deleteManualLine, this.addToLoadingLines);
    this.bindAction(CFFActions.deleteManualLineFail, this.removeFromLoadingLines);
    this.bindAction(CFFActions.saveManualLine, this.addToLoadingLines);
    this.bindAction(CFFActions.saveManualLineFail, this.removeFromLoadingLines);
    this.loadingLines = [];
    this.creatingStatus = undefined;
  }

  onGetManualSuccess(data) {
    this.deleteAll();
    // insert payments
    data.forEach((line) => this.insert(line.id, line));
  }

  onGetManualFail() {
    this.deleteAll();
  }

  onDeleteManualLineSuccess(lineId) {
    this.delete(lineId);
    this.removeFromLoadingLines({id: lineId});
  }

  onCreateManualLine() {
    this.creatingStatus = 'CREATE';
  }

  onCreateManualLineSuccess(line) {
    this.insert(line.id, line);
    this.creatingStatus = 'CREATE_SUCCESS';
  }

  onCreateManualLineFail() {
    this.creatingStatus = 'CREATE_FAIL';
  }

  onSaveManualLineSuccess(line) {
    this.upsert(line.id, line);
    this.removeFromLoadingLines(line);
  }

  addToLoadingLines(line) {
    if (this.loadingLines.indexOf(line.id) === -1) {
      this.loadingLines.push(line.id);
      return true;
    }
    return false;
  }

  removeFromLoadingLines(line) {
    const index = this.loadingLines.indexOf(line.id);
    if (index > -1) {
      this.loadingLines.splice(index, 1);
      return true;
    }
    return false;
  }

}

module.exports = alt.createStore(ManualCFFDataStore, 'ManualCFFDataStore');
