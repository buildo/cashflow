'use strict';

const alt = require('../../alt');

class ManualCFFActions {
  constructor() {
    this.generateActions('addLine');
  }
}

module.exports = alt.createActions(ManualCFFActions);