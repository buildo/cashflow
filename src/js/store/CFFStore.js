'use strict';

const _ = require('lodash');
const Dispatcher = require('../dispatcher/AppDispatcher.js');
const DataStore = require('./DataStore');
const Store = require('./Store');
let isLoadingMain = true;
let isLoadingBank = true;
let isLoadingManual = true;
let main;
let bank;
let manual;

const self = {}; // TODO: remove once fat-arrow this substitution is fixed in es6 transpiler
module.exports = _.extend(self, Store(
  Dispatcher,
  // waitFor other Stores
  [], {
  // action handlers

  GETTING_MAIN_CFF: () => {
    isLoadingMain = true;
    return true;
  },

  GETTING_BANK_CFF: () => {
    isLoadingBank = true;
    return true;
  },

  GETTING_MANUAL_CFF: () => {
    isLoadingManual = true;
    return true;
  },

  MAIN_CFF_UPDATED: (actionData) => {
    // console.log('MAIN_CFF', actionData);
    main = actionData;
    isLoadingMain = false;
    return true;
  },

  BANK_CFF_UPDATED: (actionData) => {
    // console.log('BANK_CFF', actionData);
    bank = actionData;
    isLoadingBank = false;
    return true;
  },

  PULLING_BANK_CFF: () => {
    // console.log('PULLING_BANK_CFF');
    isLoadingBank = true;
    return true;
  },

  MANUAL_CFF_UPDATED: (actionData) => {
    isLoadingManual = false;
    return true;
  },

  // MANUAL_CFF_SAVED: (actionData) => {
  //   // console.log('MANUAL_CFF', actionData);
  //   manual = actionData;
  //   isLoadingManual = false;
  //   return true;
  // },

  // ADD_MANUAL_LINE: () => {
  //   console.log('ciao');
  //   manual = manual || []
  //   manual.lines.push({});
  //   return true;
  // },

}, {
  // custom getters
  getMainCFF() {
    return main;
  },

  getBankCFF() {
    return bank;
  },

  getManualCFF() {
    return manual;
  },

  isLoading() {
    return isLoadingMain || isLoadingBank || isLoadingManual;
  },

  isLoadingMain() {
    return isLoadingMain;
  },

  isLoadingBank() {
    return isLoadingBank;
  },

  isLoadingManual() {
    return isLoadingManual;
  }
}));
