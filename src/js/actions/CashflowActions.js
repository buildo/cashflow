'use strict';

const C = require('../constants/AppConstants');
const Dispatcher = require('../dispatcher/AppDispatcher');
const ActionTypes = C.ActionTypes;


// TODO
const CashflowActions = {
  selectPoint: (event) => {
    Dispatcher.handleViewAction({
      actionType: ActionTypes.CASHFLOW_POINT_SELECTED,
      data: {
        pathName: event.name,
        index: event.index
      }
    });
  },
};

module.exports = CashflowActions;