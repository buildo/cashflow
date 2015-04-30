'use strict';

const alt = require('../alt');
const API = require('../utils/api.js');

class ManualActions {

  showNewLine() {
    this.dispatch();
  }

  hideNewLine() {
    this.dispatch();
  }

  setLineError(_id, error) {
    this.dispatch({
      _id,
      error
    });
  }

  setNewLineError(_id, error) {
    this.dispatch(error);
  }

  saveManualLine(line) {
    API.cff.saveManualLine(line._id, line.line)
      .then(() => this.actions.saveManualLineSuccess(line), (res) => this.actions.saveManualLineFail(line, res));
    this.dispatch(line);
  }

  saveManualLineSuccess(line) {
    this.dispatch(line);
  }

  saveManualLineFail(line, err) {
    this.dispatch({_id: line._id, error: err});
  }

  createManualLine(line) {
    API.cff.createManualLine(line)
      .then(this.actions.createManualLineSuccess, this.actions.createManualLineFail);
    this.dispatch(line);
  }

  createManualLineSuccess(res) {
    this.dispatch(res.data.data.newLine);
  }

  createManualLineFail(err) {
    this.dispatch(err);
  }

  deleteManualLine(lineId) {
    API.cff.deleteManualLine(lineId).then(() => this.actions.deleteManualLineSuccess(lineId), (res) => this.actions.deleteManualLineFail(lineId, res));
    this.dispatch(lineId);
  }

  deleteManualLineSuccess(lineId) {
    this.dispatch(lineId);
  }

  deleteManualLineFail(lineId, err) {
    this.dispatch({_id: lineId, error: err});
  }

}

module.exports = alt.createActions(ManualActions);
