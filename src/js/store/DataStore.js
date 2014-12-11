'use strict';

const Immutable = require('immutable');
const _ = require('lodash');

// TODO: remove casts
module.exports = {
  _data: Immutable.Map({}),
  get: function(id, missingValue) {
    let value = this._data.get(id + '', missingValue);
    return value && value.toJS ? value.toJS() : value;
  },
  getAll: function() {
    let self = this;
    return Object.keys(this._data.toJS()).map(function(k) {
      return self.get(k);
    });
  },
  upsert: function(id, obj) {
    let immObj = Immutable.fromJS(obj);
    if (!Immutable.is(this.get(id + ''), immObj)) {
      this._data =  this._data.set(id + '', immObj);
      return true;
    }
    return false;
  },
  insert: function(id, obj) {
    if (!_.isUndefined(this.get(id + ''))) {
      throw new Error('Duplicate id ' + id);
    }
    return this.upsert(id, obj);
  },
  update: function(id, patch, path) {
    let current = this._data.get(id + '', Immutable.Map({}));
    let updated = current.mergeDeepIn(path || [], Immutable.fromJS(patch));
    if (!Immutable.is(current, updated)) {
      this._data = this._data.set(id + '', updated);
      return true;
    }
    return false;
  },
  delete: function(id) {
    if (this._data.has(id + '')) {
      this._data = this._data.delete(id + '');
      return true;
    }
    return false;
  },
  deleteAll: function() {
    let hasSome = this._data.keys().length() > 0;
    this._data = Immutable.Map({});
    return hasSome;
  }
};
