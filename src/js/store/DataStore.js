'use strict';

const Immutable = require('immutable');
const _ = require('lodash');

// TODO: remove casts
class DataStore {

  constructor() {
    this._data = Immutable.Map();
  }

  static get(id, missingValue) {
    const value = this.getState()._data.get(id + '', missingValue);
    return value && value.toJS ? value.toJS() : value;
  }

  static getAll() {
    return Object.keys(this.getState()._data.toJS()).map(id => {
      return this.get(id);
    });
  }

  _get(id, missingValue) {
    const value = this._data.get(id + '', missingValue);
    return value && value.toJS ? value.toJS() : value;
  }

  _getAll() {
    return Object.keys(this._data.toJS()).map(id => {
      return _.extend({
        _id: id
      }, this.get(id));
    });
  }

  upsert(id, obj) {
    let immObj = Immutable.fromJS(obj);
    if (!Immutable.is(this._get(id), immObj)) {
      this._data =  this._data.set(id + '', immObj);
      return true;
    }
    return false;
  }

  insert(id, obj) {
    if (!_.isUndefined(this._get(id + ''))) {
      throw new Error('Duplicate id ' + id);
    }
    return this.upsert(id, obj);
  }

  update(id, patch, path) {
    let current = this._data.get(id + '', Immutable.Map({}));
    let updated = current.mergeDeepIn(path || [], Immutable.fromJS(patch));
    if (!Immutable.is(current, updated)) {
      this._data = this._data.set(id + '', updated);
      return true;
    }
    return false;
  }

  delete(id) {
    if (this._data.has(id + '')) {
      this._data = this._data.delete(id + '');
      return true;
    }
    return false;
  }

  deleteAll() {
    // let hasSome = this._data.keys().length() > 0;
    this._data = Immutable.Map();
    return true;
  }
}

module.exports = DataStore;
