'use strict';

const _ = require('lodash');
const DataStore = require('./DataStore');
const Store = require('./Store');
const CFFStore = require('./CFFStore');
const CFFManagerAssistantApp = require('cff-manager-assistant');

let data;

const updateData = () => {
  const main = CFFStore.getMainCFF();
  const bank = CFFStore.getBankCFF();
  if (!bank || !main) {
    return;
  }
  const cffs = {
    fattureInCloud: main,
    bper: bank
  };
  const report = CFFManagerAssistantApp.getMatches(cffs);
  console.log(report);
  data = report;
};

const self = {}; // TODO: remove once fat-arrow this substitution is fixed in es6 transpiler
module.exports = _.extend(self, Store(
  // waitFor other Stores
  [CFFStore], {
  // action handlers
  MAIN_CFF_UPDATED: () => {
    updateData();
    return true;
  },

  BANK_CFF_UPDATED: () => {
    updateData();
    return true;
  }

}, {
  // custom getters
  getMatchesData() {
    return data;
  }

}));
