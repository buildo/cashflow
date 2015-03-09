'use strict';

const alt = require('../alt');
const MatchActions = require('../actions/MatchActions');

class MatchesStore {
  constructor() {
    this.bindActions(MatchActions);
  }

  onGetMatches() {
    this.isOutdated = false;
    this.isLoading = true;
  }

  onGetMatchesSuccess() {
    this.isLoading = false;
  }

  onDeleteStagedMatch(match) {
    this.isOutdated = true;
  }

  onCommitMatchesSuccess() {
    this.isOutdated = true;
  }

}

module.exports = alt.createStore(MatchesStore, 'MatchesStore');
