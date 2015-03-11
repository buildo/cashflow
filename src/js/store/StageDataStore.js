'use strict';

const alt = require('../alt');
const OptimisticDataStore = require('./OptimisticDataStore');
const MatchActions = require('../actions/MatchActions');

class StageDataStore extends OptimisticDataStore {

  constructor() {
    super(StageDataStore);
    this.bindActions(MatchActions);
    this.bindAction(MatchActions.commitMatches, this.toggleCommitState);
    this.bindAction(MatchActions.commitMatchesSuccess, this.toggleCommitState);
    this.bindAction(MatchActions.commitMatchesFail, this.toggleCommitState);
    this.isCommitting = false;
  }

  onGetMatchesSuccess(data) {
    this.deleteAll(data);
    // insert payments
    data.stage.forEach((match) => this.insert((match.id), match));
  }

  onStageMatch(match) {
    this.insert(match.id, match);
  }

  toggleCommitState() {
    this.isCommitting = !this.isCommitting;
  }

  onUnstageMatch(match) {
    this.delete(match.id);
  }

}

module.exports = alt.createStore(StageDataStore, 'StageDataStore');
