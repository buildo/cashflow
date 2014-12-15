'use strict';

const C = require('../constants/AppConstants');
const ActionTypes = C.ActionTypes;
const sendAction = require('../utils/ActionUtils.js').sendAction;
const sendAsyncAction = require('../utils/ActionUtils.js').sendAsyncAction;



// TODO
const CashflowActions = {
  selectPoint: (event) => {
    sendAction(
      ActionTypes.CASHFLOW_POINT_SELECTED,
      {
        pathName: event.name,
        index: event.index
      }
    );
  }
};

module.exports = CashflowActions;