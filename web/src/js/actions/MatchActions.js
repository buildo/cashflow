'use strict';

const alt = require('../alt');
const API = require('../utils/api.js');
const handleError = require('./ErrorHandler.js').handleError;

class MatchActions {

  getMatches() {
    API.matches.getAll().then(this.actions.getMatchesSuccess, handleError);
    this.dispatch();
  }

  getMatchesSuccess(res) {
    this.dispatch(res.data.data.matches);
  }

  stageMatchOptimistic(match) {
    match = match.toJS ? match.toJS() : match;
    API.matches.stageMatch(match).then(() => this.actions.stageMatchSuccess(match), () => this.actions.stageMatchFail(match));
    this.dispatch(match);
  }

  stageMatchSuccess(match) {
    this.dispatch(match);
  }

  stageMatchFail(match) {
    this.dispatch(match);
  }

  unstageMatchOptimistic(match) {
    match = match.toJS ? match.toJS() : match;
    API.matches.unstageMatch(match).then(() => this.actions.unstageMatchSuccess(match), () => this.actions.unstageMatchFail(match));
    this.dispatch(match);
  }

  unstageMatchSuccess(match) {
    this.dispatch(match);
  }

  unstageMatchFail(match) {
    this.dispatch(match);
  }

  commitMatches() {
    API.matches.commit().then(this.actions.commitMatchesSuccess, this.actions.commitMatchesFail);
    this.dispatch();
  }

  commitMatchesSuccess() {
    this.dispatch();
  }

  commitMatchesFail() {
    this.dispatch();
  }

  deleteMatchOptimistic(match) {
    match = match.toJS ? match.toJS() : match;
    API.matches.deleteMatch(match).then(() => this.actions.deleteMatchSuccess(match), () => this.actions.deleteMatchFail(match));
    this.dispatch(match);
  }

  deleteMatchSuccess(match) {
    this.dispatch(match);
  }

  deleteMatchFail(match) {
    this.dispatch(match);
  }

}

module.exports = alt.createActions(MatchActions);
