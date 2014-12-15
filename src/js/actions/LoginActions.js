'use strict';

const C = require('../constants/AppConstants');
const ActionTypes = C.ActionTypes;
const ServerActions = require('./ServerActions.js');
const sendAction = require('../utils/ActionUtils.js').sendAction;
const sendAsyncAction = require('../utils/ActionUtils.js').sendAsyncAction;


// TODO
const LoginActions = {

  resetLoginState: (event) => sendAsyncAction(ActionTypes.RESET_LOGIN_STATE),

  attemptLogin: (loginFormData) => {
    // sendAsyncAction(ActionTypes.LOGIN_START);
    // ServerActions.attemptLogin(loginFormData);
  },

};

module.exports = LoginActions;