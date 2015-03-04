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
  MANUAL_CFF_UPDATED: (actionData) => {
    // console.log('MANUAL_CFF', actionData);
    self.deleteAll();
    // insert payments
    actionData.lines.forEach((line) => self.upsert(line.id, line));
    return true;
  },

}, {
  // custom getters

}));
