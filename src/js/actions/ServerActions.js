'use strict';

const C = require('../constants/AppConstants');
const Dispatcher = require('../dispatcher/AppDispatcher');
const ActionTypes = C.ActionTypes;
const WebAPIUtils = require('../utils/WebAPIUtils.js');

const sendAction = (actionType, data) => {
  console.log(actionType);
  Dispatcher.handleViewAction({
    actionType: actionType,
    data: data
  });
};

const handleLoginError = (res) => {
  console.log('LOGIN_FAILED');
  sendAction(ActionTypes.LOGIN_FAILED, res.data);
};

const handleLoginSuccess = (res) => {
  localStorage.setItem('cashflow_token', res.data.credentials.token);
  sendAction(ActionTypes.LOGIN_DONE, res.data);
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
    sendAction(ActionTypes.LOADING_CURRENT_USER);
    WebAPIUtils.getCurrentUser()
      .done((res) => sendAction(ActionTypes.CURRENT_USER_UPDATED, res.data.user))
      .fail(handleError);
  },

  checkTokenState: () => {
    sendAction(ActionTypes.CHECKING_TOKEN_STATE);
    WebAPIUtils.getCurrentUser()
      .done((res) => sendAction(ActionTypes.TOKEN_IS_VALID, res.data.user))
      .fail((res) => sendAction(ActionTypes.TOKEN_IS_INVALID));
  },

  login: (loginFormData) => {
    sendAction(ActionTypes.LOGIN_STARTED);
    WebAPIUtils.login(loginFormData)
      .done(handleLoginSuccess)
      .fail(handleLoginError);
  },

  updateMain: () => {
    sendAction(ActionTypes.LOADING_MAIN_CFF);
    WebAPIUtils.getMainCFF()
      .done((res) => sendAction(ActionTypes.MAIN_CFF_UPDATED, res.data.cffs.main))
      .fail(handleError);
  }
};

module.exports = ServerActions;