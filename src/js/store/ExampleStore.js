'use strict';

const _ = require('lodash');
const OptimisticDataStore = require('./OptimisticDataStore');
const Store = require('./Store');

const self = {}; // TODO: remove once fat-arrow this substitution is fixed in es6 transpiler
module.exports = _.extend(self, OptimisticDataStore, Store(
  // waitFor other Stores
  [], {
  // action handlers
  ACTION_KEY: (actionData, optimistic, undo) => {
    let deleted = self.delete(optimistic, actionData.id);
    return undo || self.upsert(optimistic, actionData.id, actionData.data) || deleted;
  }
}, {
  // custom getters
  getByFoo(fooId) {
    return self.getAll().filter(_.identity);
  }
}));
