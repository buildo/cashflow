'use strict';

const alt = require('../alt');
const OptimisticDataStore = require('./OptimisticDataStore');
const MatchActions = require('../actions/MatchActions');

class DoneDataStore extends OptimisticDataStore {

  constructor() {
    super(DoneDataStore);
    this.bindActions(MatchActions);
  }

  onGetMatchesSuccess(data) {
    this.deleteAll();
    // insert payments
    data.done.forEach((match) => this.insert((match.id), match));
  }

  onDeleteMatch(match) {
    this.delete(match.id);
  }

}

module.exports = alt.createStore(DoneDataStore, 'DoneDataStore');
