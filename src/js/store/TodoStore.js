'use strict';

const _ = require('lodash');
const Dispatcher = require('../dispatcher/AppDispatcher.js');
const Store = require('./Store');
const TodoDataStore = require('./TodoDataStore');

let isLoading = true;
let pointOfView = 'main';
let selectedMatchIndex = 0;
let selectedPaymentId;

const self = {}; // TODO: remove once fat-arrow this substitution is fixed in es6 transpiler
module.exports = _.extend(self, Store(
  Dispatcher,
  // waitFor other Stores
  [TodoDataStore], {
  // action handlers
  GETTING_MATCHES: () => {
    isLoading = true;
    return true;
  },

  MATCHES_UPDATED: (actionData) => {
    isLoading = false;
    return true;
  },

  SAVED_MATCH: () => {
    selectedMatchIndex = undefined;
    selectedPaymentId = undefined;
    return true;
  },

  INVERT_MATCHES_POV: () => {
    pointOfView = pointOfView === 'main' ? 'data' : 'main';
    selectedMatchIndex = undefined;
    selectedPaymentId = undefined;
    return true;
  },

  MATCH_TODO_SELECTED: (actionData) => {
    selectedMatchIndex = actionData;
    selectedPaymentId = undefined;
    return true;
  },

  PAYMENT_TODO_SELECTED: (actionData) => {
    selectedPaymentId = actionData;
    return true;
  }

}, {
  // custom getters

  getMatches() {
    const payments = TodoDataStore.getAll();
    const dataPayments = payments.filter((p) => p.type === 'data');
    const mainPayments = payments.filter((p) => p.type === 'certain' || p.type === 'uncertain');
    const primaryPayments = pointOfView === 'main' ? mainPayments : dataPayments;
    const secondaryPayments = pointOfView === 'main' ? dataPayments : mainPayments;
    return primaryPayments.map((primaryP) => {
      primaryP.matches = secondaryPayments.filter((secondaryPayment) =>
        primaryP.matches.filter((matchedId) => secondaryPayment.id === matchedId).length > 0);
      return primaryP;
    });
  },

  getSecondaryPayments() {
    const payments = TodoDataStore.getAll();
    if (pointOfView === 'data') {
      return payments.filter((p) => p.type === 'certain' || p.type === 'uncertain');
    } else {
      return payments.filter((p) => p.type === 'data');
    }
  },

  getPayment(id) {

  },

  getPOV() {
    return pointOfView;
  },

  getSelectedMatchIndex() {
    return selectedMatchIndex;
  },

  getSelectedPaymentId() {
    return selectedPaymentId;
  },

  isLoading() {
    return isLoading;
  }

}));
