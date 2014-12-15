'use strict';

const C = require('../constants/AppConstants');
const ActionTypes = C.ActionTypes;
const sendAction = require('../utils/ActionUtils.js').sendAction;
const sendAsyncAction = require('../utils/ActionUtils.js').sendAsyncAction;


// TODO
const RouterActions = {

  notifyRouteChanged: (state) => {
    console.log('NEW_ROUTE: ' + state.pathname);
    sendAction(ActionTypes.ROUTE_CHANGED, state);
  },

};

module.exports = RouterActions;