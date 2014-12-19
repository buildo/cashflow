'use strict';

const _ = require('lodash');
const Dispatcher = require('../dispatcher/AppDispatcher.js');
const Store = require('./Store');

const self = {}; // TODO: remove once fat-arrow this substitution is fixed in es6 transpiler
module.exports = _.extend(self, Store.Optimistic, Store(
  Dispatcher,
  // waitFor other Stores
  [], {
  // action handlers

  MATCHES_UPDATED: (actionData) => {
    self.deleteAll();
    const dataPayments = actionData.todo.data;
    const mainPayments = actionData.todo.main;

    // insert payments
    mainPayments.concat(dataPayments).forEach((p) => self.upsert(p.id, p));
    return true;
  },

  SAVED_MATCH: (actionData, optimistic, undo) => {
    console.log('TODO_DATA', optimistic, undo);
    const mainPayment = actionData.main;
    const dataPayment = actionData.data;
    if (undo) {
      self.upsert(mainPayment.id, mainPayment);
      self.upsert(dataPayment.id, dataPayment);
    } else {
      self.delete(mainPayment.id);
      self.delete(dataPayment.id);
    }
    return true;
  }

}, {
  // custom getters
  getAllPayments() {
    return self.getAll();
  },

}));
