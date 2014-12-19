'use strict';

const _ = require('lodash');
const Dispatcher = require('../dispatcher/AppDispatcher.js');
const Store = require('./Store');
const TodoDataStore = require('./TodoDataStore');

let isLoading = true;
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

  MATCH_TODO_SELECTED: (actionData) => {
    console.log('SELECTED_MATCH: ' + actionData);
    selectedMatchIndex = actionData;
    selectedPaymentId = undefined;
    return true;
  },

  PAYMENT_TODO_SELECTED: (actionData) => {
    console.log('SELECTED_PAYMENT: ' + actionData);
    selectedPaymentId = actionData;
    return true;
  }

}, {
  // custom getters
  getMainMatches() {
    const payments = TodoDataStore.getAll();
    const dataPayments = payments.filter((p) => p.type === 'data');
    const mainPayments = payments.filter((p) => p.type === 'certain' || p.type === 'uncertain');
    return mainPayments.map((mainP) => {
      mainP.matches = dataPayments.filter((dataPayment) =>
        mainP.matches.filter((matchedId) => dataPayment.id === matchedId).length > 0);
      return mainP;
    });
  },

  getDataPayments() {
    const payments = TodoDataStore.getAll();
    const dataPayments = payments.filter((p) => p.type === 'data');
    return dataPayments;
  },

  getPayment(id) {

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
