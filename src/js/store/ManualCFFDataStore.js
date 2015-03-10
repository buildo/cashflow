'use strict';

const _ = require('lodash');
const alt = require('../alt');
const Immutable = require('immutable');
const DataStore = require('./DataStore');
const CFFActions = require('../actions/CFFActions');

const fakeData = [
  {
    id: '1',
    content: {}
  },
  {
    id: '2',
    content: {}
  },
  {
    id: '3',
    content: {}
  },
  {
    id: '4',
    content: {}
  },
];

class ManualCFFDataStore extends DataStore {

  constructor() {
    this.bindActions(CFFActions);
    super(ManualCFFDataStore);
  }

  onGetManual() {
    this.onGetManualSuccess({lines: fakeData});

    // console.log("ON_GET_MANUAL");
    // console.log(this.delete);
  }

  onGetManualSuccess(data) {
    this.deleteAll();
    // insert payments
    data.lines.forEach((line) => this.insert(line.id, line));
  }

}

module.exports = alt.createStore(ManualCFFDataStore, 'ManualCFFDataStore');
