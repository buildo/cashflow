'use strict';

const alt = require('../../alt');

class CashflowActions {
  constructor() {
    this.generateActions('selectPoint');
  }
}

module.exports = alt.createActions(CashflowActions);
