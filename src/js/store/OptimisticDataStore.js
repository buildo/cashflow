'use strict';

const Immutable = require('immutable');
const _ = require('lodash');
const DataStore = require('./DataStore');

// TODO: clean up optimisitc values on stable inserts?
const getterMethods = ['get', 'getAll'];
const setterMethods = ['upsert', 'insert', 'update', 'delete', 'deleteAll'];

const camelCase = function(prefix, name) {
  return prefix + name.charAt(0).toUpperCase() + name.substring(1);
};

const omitOptimistic = function(o) {
  return _.isObject(o) ? _.omit(o, '__optimistic') : o;
};

const self = _.extend({}, Object.keys(DataStore).reduce((self, prop) => {
  if (getterMethods.indexOf(prop) !== -1) {
    self[prop] = function() {
      let stableResult = DataStore[prop].apply(this, arguments);
      let optStore = _.extend({}, this, { _data: this._optimisticData });
      let optResult = DataStore[prop].apply(optStore, arguments);
      if (prop === 'getAll') {
        // TODO: better policy
        return _.uniq(stableResult.concat(optResult), '_id');
      } else {
        let stableResultImm = Immutable.fromJS(stableResult || {});
        let resultImm = stableResultImm.mergeDeep(Immutable.fromJS(optResult));
        let result = resultImm.toJS();
        // TODO: better policy
        return _.extend(result, {
          __optimistic: !Immutable.is(resultImm, stableResultImm)
        });
      }
    };
  } else if (setterMethods.indexOf(prop) !== -1) {
    self[prop] = function() {
      let selfData = this._data;
      let optimistic = this.isOptimisticHandling();
      if (optimistic) {
        this._data = this._optimisticData;
      }
      let args = Array.prototype.slice.call(arguments, 0);
      let ret = DataStore[prop].apply(this, args.map(omitOptimistic));
      if (optimistic) {
        this._optimisticData = this._data;
        this._data = selfData;
      }
      return ret;
    };
    self[camelCase('optimistic', prop)] = function() {
      let prevHandling = this.isOptimisticHandling();
      this.setOptimisticHandling(true);
      let ret = self[prop].apply(this, arguments);
      this.setOptimisticHandling(prevHandling);
      return ret;
    };
    self[camelCase('stable', prop)] = function() {
      let prevHandling = this.isOptimisticHandling();
      this.setOptimisticHandling(false);
      let ret = self[prop].apply(this, arguments);
      this.setOptimisticHandling(prevHandling);
      return ret;
    };
  }
  return self;
}, {}));

module.exports = _.extend(self, {
  _data: Immutable.Map({}),
  _optimisticData: Immutable.Map({})
});
