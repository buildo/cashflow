'use strict';

const alt = require('../alt');
const MatchActions = require('../actions/MatchActions');

class MatchesStore {
  constructor() {
    this.bindActions(MatchActions);
    this.bindAction(MatchActions.commitMatchesSuccess, this.onUpdate);
    this.isLoadingMatches = true;
  }

  onGetMatches() {
    this.isOutdated = false;
    this.isLoadingMatches = true;
  }

  onGetMatchesSuccess() {
    this.isLoadingMatches = false;
  }

  onUpdate() {
    this.isOutdated = true;
    this.isLoadingMatches = true;
  }

}

module.exports = alt.createStore(MatchesStore, 'MatchesStore');
