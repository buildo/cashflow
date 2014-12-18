'use strict';

const _ = require('lodash');
const Dispatcher = require('../dispatcher/AppDispatcher.js');
const Store = require('./Store');

const self = {}; // TODO: remove once fat-arrow this substitution is fixed in es6 transpiler
module.exports = _.extend(self, Store.Data, Store(
  Dispatcher,
  // waitFor other Stores
  [], {
  // action handlers

  MATCHES_TODO_UPDATED: (actionData) => {
    console.log(actionData);
    self.deleteAll();
    const dataPayments = actionData.data;
    const mainPayments = actionData.main;

    // insert payments
    mainPayments.concat(dataPayments).forEach((p) => self.insert(p.id, p));
    return true;
  },

}, {
  // custom getters
  getAllPayments() {
    return self.getAll();
  },

}));
