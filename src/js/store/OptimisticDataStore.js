'use strict';

const Immutable = require('immutable');
const _ = require('lodash');
const DataStore = require('./DataStore');

const setterMethods = ['upsert', 'insert', 'update', 'delete', 'deleteAll'];

function NoopClass() {}
const excluded = Object.getOwnPropertyNames(NoopClass.prototype);

const buildClassFunctions = (classObj, context) => {
  const obj = classObj.prototype;
  const self = context;
  Object.getOwnPropertyNames(obj).forEach(function (functionName) {
    if (excluded.indexOf(functionName) === -1) {
      // create optimistic/fail/success functions
      self[functionName + 'Optimistic'] = (payload) => {
        console.log('OPTMISTIC');
        self[functionName](_.extend(payload, {__optimistic: true, __undo: false}));
      };
      self[functionName + 'Success'] = (payload) => {
        console.log('SUCCESS');
        self[functionName](_.extend(payload, {__optimistic: false, __undo: false}));
      };
      self[functionName + 'Undo'] = (payload) => {
        self[functionName](_.extend(payload, {__optimistic: false, __undo: true}));
      };
    }
  });
};

const handleUndo = (id, context) => {
  const self = context;
  if (!self._optimisticData.has(id) || (self._data.has(id) && self._optimisticData.has(id))) {
    self._optimisticData = self._optimisticData.set(id, self._data.get(id));
  } else {
    self._optimisticData = self._optimisticData.delete(id);
  }
};

const handleSuccess = (id, context) => {
  const self = context;
  if (self._optimisticData.has(id)) {
    self._data = self._data.set(id, self._optimisticData.get(id));
  } else {
    self._data = self._data.delete(id);
  }
};


class OptimisticDataStore extends DataStore {

  constructor(classObj) {
    this._optimisticData = Immutable.Map();
    this._data = Immutable.Map();
    classObj.getAll = OptimisticDataStore.getAll;
    classObj.get = OptimisticDataStore.get;
    buildClassFunctions(classObj, this);

    const self = this;
    setterMethods.forEach((m) => {
      self[m] = (id, data) => {
        let selfData;
        if (!data || typeof data.__optimistic === 'undefined') {
          // stable method
          super[m](id, data);
          selfData = self._data;
          self._data = self._optimisticData;
          super[m](id, data);
          self._optimisticData = self._data;
          self._data = selfData;
        }
        else if (data.__undo) {
          handleUndo(id, self);
        } else if (data.__optimistic) {
          selfData = self._data;
          self._data = self._optimisticData;
          super[m](id, data);
          self._optimisticData = self._data;
          self._data = selfData;
          // console.log('OPTIMISTIC', self._optimisticData.toJS(), self._data.toJS());
        } else {
          handleSuccess(id, self);
        }
      };
    });
  }

  static get(id, missingValue) {
    const value = this.getState()._optimisticData.get(id + '', missingValue);
    return value && value.toJS ? value.toJS() : value;
  }

  static getAll() {
    return Object.keys(this.getState()._optimisticData.toJS()).map(id => {
      return this.get(id);
    });
  }

}

module.exports = OptimisticDataStore;
