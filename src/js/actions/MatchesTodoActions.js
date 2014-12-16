'use strict';

const C = require('../constants/AppConstants');
const ActionTypes = C.ActionTypes;
const sendAction = require('../utils/ActionUtils.js').sendAction;
const sendAsyncAction = require('../utils/ActionUtils.js').sendAsyncAction;



// TODO
const MatchesTodoActions = {
  selectMatch: (index) => {
    sendAction(
      ActionTypes.MATCH_TODO_SELECTED,
      index
    );
  }
};

module.exports = MatchesTodoActions;