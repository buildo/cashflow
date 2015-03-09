'use strict';

const _ = require('lodash');
const alt = require('../alt');
const DataStore = require('./DataStore');
const CFFActions = require('../actions/CFFActions');

console.log(DataStore);

class ManualCFFDataStore extends DataStore {

  constructor() {
    // this.bindAction(CFFActions);
  }

  static hey() {
    console.log('HEY!!!');
  }

  onGetManualSuccess(data) {
    this.deleteAll();
    // insert payments
    data.lines.forEach((line) => this.upsert(line.id, line));
  }

}

console.log(typeof ManualCFFDataStore);

module.exports = alt.createStore(ManualCFFDataStore, 'ManualCFFDataStore');
