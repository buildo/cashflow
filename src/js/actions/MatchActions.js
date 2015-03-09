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

  deleteStagedMatch(match) {
    match = match.toJS();
    API.matches.deleteStagedMatch(match).catch(handleError);
    this.dispatch(match);
  }

  commitMatches() {
    API.matches.commit().then(this.actions.commitMatchesSuccess, handleError);
    this.dispatch();
  }

  commitMatchesSuccess() {
    this.dispatch();
  }

  saveMatch() {
    // TODO
    this.dispatch();
  }

}

module.exports = alt.createActions(MatchActions);
