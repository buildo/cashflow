'use strict';

const alt = require('../alt');
const CFFActions = require('../actions/CFFActions');

class PullProgressStore {
  constructor() {
    this.bindActions(CFFActions);
  }

  onPullBank() {
    this.isPullingBank = true;
  }

  onPullBankFail() {
    this.isPullingBank = false;
  }

  onPullBankSuccess() {
    this.isPullingBank = false;
  }

  onPullMain() {
    this.isPullingMain = true;
    this.progressMain = undefined;
  }

  onPullMainFail() {
    this.onResetMainPullProgress();
  }

  onGetMainPullProgress(data) {
    this.progressMain = data;
  }

  onResetMainPullProgress() {
    this.isPullingMain = false;
    this.progressMain = undefined;
  }

}

module.exports = alt.createStore(PullProgressStore, 'PullProgressStore');
