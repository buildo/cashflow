'use strict';

const alt = require('../alt');
const _ = require('lodash');
const DataStore = require('./DataStore');
const CFFActions = require('../actions/CFFActions');
const ManualActions = require('../actions/ManualActions');
const MatchActions = require('../actions/MatchActions');


class ManualCFFDataStore extends DataStore {

  constructor() {
    super(ManualCFFDataStore);
    this.bindActions(CFFActions);
    this.bindActions(ManualActions);
    this.bindAction(MatchActions.commitMatchesSuccess, this.refresh);
    this.newLine = {
      loading: false,
      show: false,
      error: undefined
    };
    this.outdated = false;
  }

  onGetManual() {
    this.outdated = false;
    this.deleteAll();
  }

  onGetManualSuccess(data) {
    // insert payments
    data.forEach((line) => this.insert(line._id, line));
  }

  onDeleteManualLine(lineId) {
    this.setLoading(lineId, true);
  }

  onDeleteManualLineSuccess(lineId) {
    this.delete(lineId);
  }

  onDeleteManualLineFail(res) {
    this.setLoading(res._id, false);
    this.setError(res._id, res.error.data.message);
  }

  _resetNewLine() {
    this.newLine.loading = false;
    this.newLine.show = false;
    this.newLine.error = undefined;
  }

  onHideNewLine() {
    this._resetNewLine();
  }

  onShowNewLine() {
    this.newLine.show = true;
  }

  onSetNewLineError(err) {
    this.newLine.error = err;
  }

  onSetLineError(data) {
    this.setError(data._id, data.error);
  }

  onCreateManualLine() {
    this.newLine.loading = true;
  }

  onCreateManualLineSuccess(newLine) {
    this._resetNewLine();
    this.insert(newLine._id, newLine);
  }

  onCreateManualLineFail(err) {
    this.newLine.loading = false;
    this.newLine.error = err.data.message;
  }

  onSaveManualLine(line) {
    this.setLoading(line._id, true);
    this.setError(line._id, undefined);
  }

  onSaveManualLineSuccess(line) {
    this.upsert(line._id, line);
    this.resetLine(line._id);
  }

  onSaveManualLineFail(res) {
    this.setLoading(res._id, false);
    this.setError(res._id, res.error.data.message);
  }

  resetLine(lineId) {
    this.setLoading(lineId, false);
    this.setError(lineId, undefined);
  }

  setLoading(lineId, value) {
    this.update(lineId, {loading: value});
  }

  setError(lineId, value) {
    this.update(lineId, {error: value});
  }

  refresh() {
    this.outdated = true;
  }

}

module.exports = alt.createStore(ManualCFFDataStore, 'ManualCFFDataStore');
