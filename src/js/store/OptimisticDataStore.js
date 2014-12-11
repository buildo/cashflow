'use strict';

const Immutable = require('immutable');
const _ = require('lodash');
const DataStore = require('./DataStore');

const getterMethods = ['get'];

const self = _.extend({}, Object.keys(DataStore).reduce((self, prop) => {
  if (getterMethods.indexOf(prop) !== -1) {
    self[prop] = function() {
      let optStore = _.extend({}, this, { _data: this._optimisticData });
      let optResult = DataStore[prop].apply(optStore, arguments);
      // TODO: better policy
      // potentially merge/patch results
      return optResult ? optResult : DataStore[prop].apply(this, arguments);
    };
  } else {
    self[prop] = function(optimistic) {
      let args = Array.prototype.splice.call(arguments, 1, arguments.length - 1);
      let selfData = this._data;
      if (optimistic) {
        this._data = this._optimisticData;
      }
      let ret = DataStore[prop].apply(this, args);
      if (optimistic) {
        this._optimisticData = this._data;
        this._data = selfData;
      }
      return ret;
    };
  }
  return self;
}, {}));

module.exports = _.extend(self, {
  _data: Immutable.Map({}),
  _optimisticData: Immutable.Map({})
});
