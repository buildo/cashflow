'use strict';

const C = require('../constants/AppConstants');
const ActionTypes = C.ActionTypes;
const sendAction = require('../utils/ActionUtils.js').sendAction;
const sendAsyncAction = require('../utils/ActionUtils.js').sendAsyncAction;

// TODO
const StageActions = {

  deleteStagedMatch: (index) => {
    // sendAction(
    //   ActionTypes.MATCH_TODO_SELECTED,
    //   undefined
    // );
  },

  updateLineOnFattureInCloud: (id) => {
    // sendAction(
    //   ActionTypes.PAYMENT_TODO_SELECTED,
    //   id
    // );
  },

  updateAllOnFattureInCloud: (id) => {
    // sendAction(
    //   ActionTypes.PAYMENT_TODO_SELECTED,
    //   undefined
    // );
  }
};

module.exports = StageActions;