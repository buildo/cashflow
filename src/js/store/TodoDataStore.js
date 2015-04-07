'use strict';

const alt = require('../alt');
const OptimisticDataStore = require('./OptimisticDataStore');
const MatchActions = require('../actions/MatchActions');

class TodoDataStore extends OptimisticDataStore {

  constructor() {
    super(TodoDataStore);
    this.bindActions(MatchActions);
  }

  onGetMatchesSuccess(data) {
    this.deleteAll();
    // insert payments
    data.todo.main.concat(data.todo.data).forEach((p) => this.insert(p.id, p));
  }

  onStageMatch(data) {
    if (data.main) {
      this.delete(data.main.id);
    }
    this.delete(data.data.id);
  }

  onDeleteMatch(match) {
    this.recreatePayments(match);
  }

  onUnstageMatch(match) {
    this.recreatePayments(match);
  }

  recreatePayments(match) {
    this.insert(match.main.id, match.main);
    this.insert(match.data.id, match.data);
  }

}

module.exports = alt.createStore(TodoDataStore, 'TodoDataStore');
