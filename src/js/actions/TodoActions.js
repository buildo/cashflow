'use strict';

const alt = require('../../alt');

class TodoActions {
  constructor() {
    this.generateActions('selectMatch', 'deselectMatch', 'selectPayment', 'deselectPayment', 'invertMatchesPOV');
  }
}

module.exports = alt.createActions(TodoActions);