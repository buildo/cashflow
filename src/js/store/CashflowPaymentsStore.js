'use strict';

const _ = require('lodash');
const Dispatcher = require('../dispatcher/AppDispatcher.js');
const DataStore = require('./DataStore');
const Store = require('./Store');
const CashflowStore = require('./CashflowStore');
const CashflowActions = require('../actions/CashflowActions');
let index;
let pathName;

class CashflowPaymentsStore {
  constructor() {
    this.bindActions(CurrentDocumentActions);

    this.currentDocument= { };
    this.loading = false;
  }

  onCreate(documentKindId) {
    API.document.create(documentKindId).then(CurrentDocumentActions.createCompleted, CurrentDocumentActions.createFailed);
    this.loading = true;
  }

  onGetMainSuccess() {

  }

  onCreateFailed() {
    this.loading = false;
  }

  resetPointSelection() {
    this.index = this.pathName = undefined;
  }

}

module.exports = alt.createStore(CashflowPaymentsStore, 'CashflowPaymentsStore');


const resetPointSelection = () => {
  index = pathName = undefined;
};

const self = {}; // TODO: remove once fat-arrow this substitution is fixed in es6 transpiler
module.exports = _.extend(self, Store(
  Dispatcher,
  // waitFor other Stores
  [CashflowStore], {
  // action handlers
  MAIN_CFF_UPDATED: () => {
    resetPointSelection();
    return true;
  },

  CASHFLOW_CONFIGS_UPDATED: (actionData) => {
    resetPointSelection();
    return true;
  },

  CASHFLOW_POINT_SELECTED: (actionData) => {
    if (actionData.index === index && actionData.pathName.toLowerCase() === pathName) {
      resetPointSelection();
    } else {
      index = actionData.index;
      pathName = actionData.pathName.toLowerCase();
    }
    return true;
  }

}, {
  // custom getters
  getCurrentSelectedPayments() {
    const data = CashflowStore.getCashflowData();
    return data && pathName && index > -1 ? data[pathName][index].info : undefined;
  }

}));
