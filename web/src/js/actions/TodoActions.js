'use strict';

const alt = require('../alt');

class TodoActions {
  constructor() {
    this.generateActions('selectMatch', 'selectPayment', 'invertPOV');
  }
}

module.exports = alt.createActions(TodoActions);