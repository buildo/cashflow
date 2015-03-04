'use strict';

const alt = require('../../alt');

class FICActions {
  constructor() {
    this.generateActions('setPullEnded');
  }
}

module.exports = alt.createActions(FICActions);
