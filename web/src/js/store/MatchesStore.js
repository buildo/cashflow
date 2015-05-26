'use strict';

const alt = require('../alt');
const MatchActions = require('../actions/MatchActions');
const ManualActions = require('../actions/ManualActions');

class MatchesStore {
  constructor() {
    this.bindActions(MatchActions);
    this.bindAction(MatchActions.commitMatchesSuccess, this.onUpdate);
    this.bindListeners({
      onUpdate: [MatchActions.commitMatchesSuccess, ManualActions.saveManualLineSuccess, ManualActions.createManualLineSuccess]
    });
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
