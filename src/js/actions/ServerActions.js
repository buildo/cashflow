'use strict';

const C = require('../constants/AppConstants');
const ActionTypes = C.ActionTypes;
const WebAPIUtils = require('../utils/WebAPIUtils.js');
const sendAction = require('../utils/ActionUtils.js').sendAction;
const sendAsyncAction = require('../utils/ActionUtils.js').sendAsyncAction;

const handleLoginError = (res) => {
  console.log('LOGIN_FAILED');
  sendAction(ActionTypes.LOGIN_FAIL, res.data);
};

const handleLoginSuccess = (res) => {
  sendAction(ActionTypes.LOGGED_IN, res.data);
};

const handleError = (res) => {
  console.log('HTTP_ERROR');
  switch (res.code) {
    case 401:
      sendAction(ActionTypes.LOGGED_OUT, res.data);
      break;

    default:
      console.log(res.code);
      break;
  }
};

const ServerActions = {

  getCurrentUser: () => {
    sendAsyncAction(ActionTypes.GETTING_CURRENT_USER);
    WebAPIUtils.getCurrentUser()
      .done((res) => sendAction(ActionTypes.CURRENT_USER_UPDATED, res.data.user))
      .fail(handleError);
  },

  checkTokenState: () => {
    sendAsyncAction(ActionTypes.CHECKING_TOKEN_STATE);
    WebAPIUtils.getCurrentUser()
      .done((res) => sendAction(ActionTypes.TOKEN_IS_VALID))
      .fail((res) => sendAction(ActionTypes.TOKEN_IS_INVALID));
  },

  attemptLogin: (loginFormData) => {
    sendAsyncAction(ActionTypes.LOGIN_START);
    WebAPIUtils.login(loginFormData)
      .done(handleLoginSuccess)
      .fail(handleLoginError);
  },

  getMain: () => {
    sendAsyncAction(ActionTypes.GETTING_MAIN_CFF);
    WebAPIUtils.getMainCFF()
      .done((res) => sendAction(ActionTypes.MAIN_CFF_UPDATED, res.data.cffs.main))
      .fail(handleError);
  },

  getBank: () => {
    sendAsyncAction(ActionTypes.GETTING_BANK_CFF);
    WebAPIUtils.getBankCFF()
      .done((res) => sendAction(ActionTypes.BANK_CFF_UPDATED, res.data.cffs.bank))
      .fail(handleError);
  },

  getMatches: () => {
    sendAsyncAction(ActionTypes.GETTING_MATCHES);
    WebAPIUtils.getMatches()
      .done((res) => sendAction(ActionTypes.MATCHES_UPDATED, res.data.matches))
      .fail(handleError);
  },

};

module.exports = ServerActions;