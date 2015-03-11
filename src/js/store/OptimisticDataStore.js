'use strict';

const Immutable = require('immutable');
const _ = require('lodash');
const DataStore = require('./DataStore');

const setterMethods = ['upsert', 'insert', 'update', 'delete', 'deleteAll'];

function NoopClass() {}
const excluded = Object.getOwnPropertyNames(NoopClass.prototype);

const resetOptimisticState = (self) => {
  self.__stable = true;
  self.__undo = false;
  self.__optimistic = false;
};

const buildClassFunctions = (classObj, context) => {
  const obj = classObj.prototype;
  const self = context;
  Object.getOwnPropertyNames(obj).forEach(function (functionName) {
    if (excluded.indexOf(functionName) === -1) {
      // create optimistic/fail/success functions
      self[functionName + 'Optimistic'] = (payload) => {
        self.__optimistic = true;
        self.__undo = false;
        self.__stable = false;
        self[functionName](payload);
        resetOptimisticState(self);
      };
      self[functionName + 'Success'] = (payload) => {
        self.__optimistic = false;
        self.__undo = false;
        self.__stable = false;
        self[functionName](payload);
        resetOptimisticState(self);
      };
      self[functionName + 'Undo'] = (payload) => {
        self.__optimistic = false;
        self.__undo = true;
        self.__stable = false;
        self[functionName](payload);
        resetOptimisticState(self);
      };
    }
  });
};

const handleUndo = (id, context, m) => {
  const self = context;
  if (m === 'deleteAll') {
    self._optimisticData = Immutable.Map(self._data);
  }
  else if (self._data.has(id)) {
    self._optimisticData = self._optimisticData.set(id, self._data.get(id));
  } else {
    self._optimisticData = self._optimisticData.delete(id);
  }
};

const handleSuccess = (id, context, m) => {
  const self = context;
  if (m === 'deleteAll') {
    self._data = Immutable.Map();
  }
  else if (self._optimisticData.has(id)) {
    self._data = self._data.set(id, self._optimisticData.get(id));
  } else {
    self._data = self._data.delete(id);
  }
};

class OptimisticDataStore extends DataStore {

  constructor(classObj) {
    this._optimisticData = Immutable.Map();
    this._data = Immutable.Map();
    this.__stable = true;
    classObj.getAll = OptimisticDataStore.getAll;
    classObj.get = OptimisticDataStore.get;
    buildClassFunctions(classObj, this);
    // build setter wrappers:
    const self = this;
    setterMethods.forEach((m) => {
      self[m] = (id, data, path) => {
        id = typeof id === 'undefined' ? id : (id + '');
        let selfData;
        let toReturn = true;
        if (self.__stable) {
          toReturn = super[m](id, data, path);
          selfData = self._data;
          self._data = self._optimisticData;
          toReturn = toReturn && super[m](id, data, path);
          self._optimisticData = self._data;
          self._data = selfData;
        }
        else if (self.__optimistic) {
          selfData = self._data;
          self._data = self._optimisticData;
          toReturn = super[m](id, data, path);
          self._optimisticData = self._data;
          self._data = selfData;
        }
        else if (self.__undo) {
          handleUndo(id, self, m);
        }
        else {
          handleSuccess(id, self, m);
        }
        return toReturn;
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
