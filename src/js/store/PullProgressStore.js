'use strict';

const alt = require('../alt');
const _ = require('lodash');
const CFFActions = require('../actions/CFFActions');

class PullProgressStore {
  constructor() {
    this.bindActions(CFFActions);
  }

  onPullMain() {
    this.isPullingMain = true;
    this.progressMain = undefined;
  }

  onGetMainPullProgress(data) {
    this.isToUpdate = !_.isEqual(this.progressMain, data);
    this.progressMain = data;
  }

  onResetMainPullProgress() {
    this.isPullingMain = false;
    this.progressMain = undefined;
  }

}

module.exports = alt.createStore(PullProgressStore, 'PullProgressStore');
