'use strict';

const C = require('../constants/AppConstants');
const ActionTypes = C.ActionTypes;
const sendAction = require('../utils/ActionUtils.js').sendAction;
const sendAsyncAction = require('../utils/ActionUtils.js').sendAsyncAction;
const ServerActions = require('./ServerActions.js');


// TODO
const FICActions = {

  setPullEnded: () => {
    sendAsyncAction(ActionTypes.MAIN_CFF_PULLED);
    ServerActions.getMain();
  },

};

module.exports = FICActions;