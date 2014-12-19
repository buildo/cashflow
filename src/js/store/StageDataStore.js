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
    actionData.stage.forEach((match) => self.upsert((match.id), match));
    return true;
  },

  SAVED_MATCH: (actionData, optimistic, undo) => {
    const match = actionData.match;
    return undo ? self.remove(match.id) : self.upsert(match.id, match);
  },

  DELETED_STAGED_MATCH: (actionData) => {
    return self.remove(actionData.id);
  },

}, {
  // custom getters


}));
