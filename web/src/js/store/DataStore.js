'use strict';

const Immutable = require('immutable');

// TODO: remove casts
class DataStore {

  constructor(classObj) {
    this._data = Immutable.Map();
    this.exportPublicMethods({
      get: this._get,
      getIn: this._getIn,
      getAll: this._getAll
    });
    // classObj.getAll = DataStore.getAll;
    // classObj.get = DataStore.get;
  }

  _get(id, missingValue) {
    const value = this.getState()._data.get(id + '', missingValue);
    return value && value.toJS ? value.toJS() : value;
  }

  _getAll() {
    return Object.keys(this.getState()._data.toJS()).map(id => {
      return this.get(id);
    });
  }

  _getIn(path) {
    const value = this.getState()._data.getIn(path);
    return value && value.toJS ? value.toJS() : undefined;
  }

  get(id, missingValue) {
    const value = this._data.get(id + '', missingValue);
    return value && value.toJS ? value.toJS() : value;
  }

  getAll() {
    return Object.keys(this._data.toJS()).map(id => {
      return this.get(id);
    });
  }

  getIn(path) {
    const value = this._data.getIn(path);
    return value && value.toJS ? value.toJS() : undefined;
  }

  upsert(id, obj) {
    let immObj = Immutable.fromJS(obj);
    if (!Immutable.is(this.get(id), immObj)) {
      this._data = this._data.set(id + '', immObj);
      return true;
    }
    return false;
  }

  insert(id, obj) {
    if (this._data.has(id)) {
      throw new Error('Duplicate id ' + id);
    }
    this._data = this._data.set(id + '', Immutable.fromJS(obj));
    return true;
  }

  update(id, patch, path) {
    path = [].concat(path || []);
    const current = this._data.get(id + '', Immutable.Map({}));
    const updated = current.mergeDeepIn(path || [], Immutable.fromJS(patch));
    if (!Immutable.is(current, updated)) {
      this._data = this._data.set(id + '', updated);
      const x = this.get(id);
      console.log(x);
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
    this._data = Immutable.Map();
    return true;
  }
}

module.exports = DataStore;
