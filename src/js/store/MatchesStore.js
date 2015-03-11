'use strict';

const alt = require('../alt');
const MatchActions = require('../actions/MatchActions');

class MatchesStore {
  constructor() {
    this.bindActions(MatchActions);
    this.bindAction(MatchActions.commitMatchesSuccess, this.onUpdate);
    this.isLoading = true;
  }

  onGetMatches() {
    this.isOutdated = false;
    this.isLoading = true;
  }

  onGetMatchesSuccess() {
    this.isLoading = false;
  }

  onUpdate() {
    this.isOutdated = true;
    this.isLoading = true;
  }

}

module.exports = alt.createStore(MatchesStore, 'MatchesStore');
