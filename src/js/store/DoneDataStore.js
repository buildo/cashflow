'use strict';

const _ = require('lodash');
const Dispatcher = require('../dispatcher/AppDispatcher.js');
const Store = require('./Store');

const self = {}; // TODO: remove once fat-arrow this substitution is fixed in es6 transpiler
module.exports = _.extend(self, Store.Optimistic, Store(
  Dispatcher,
  // waitFor other Stores
  [],

  {
  // action handlers
  MATCHES_UPDATED: (actionData) => {
    self.deleteAll();
    // insert payments
    actionData.done.forEach((match) => self.upsert((match.id), match));
    return true;
  },

  DELETED_MATCH: (actionData) => {
    // return self.delete(actionData.id);
  },

}, {
  // custom getters


}));
