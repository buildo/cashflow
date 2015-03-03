'use strict';

const C = require('../constants/AppConstants');
const Immutable = require('immutable');
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
  switch (res.status) {
    case 401:
      sendAction(ActionTypes.LOGGED_OUT, res.data);
      break;

    default:
      console.log(res.status);
      break;
  }
};

const handleCFFError = (res, action) => {
  switch (res.status) {
    case 401:
      sendAction(ActionTypes.LOGGED_OUT, res.data);
      break;

    case 400:
      sendAction(action, undefined);
      break;

    default:
      console.log(res.status);
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
      .fail((res) => handleCFFError(res, ActionTypes.MAIN_CFF_UPDATED));
  },

  getBank: () => {
    sendAsyncAction(ActionTypes.GETTING_BANK_CFF);
    WebAPIUtils.getBankCFF()
      .done((res) => sendAction(ActionTypes.BANK_CFF_UPDATED, res.data.cffs.bank))
      .fail((res) => handleCFFError(res, ActionTypes.BANK_CFF_UPDATED));
  },

  pullMain: () => {
    sendAsyncAction(ActionTypes.PULLING_MAIN_CFF);
    WebAPIUtils.pullMainCFF()
      .done()
      .fail(handleError);
  },

  pullBank: () => {
    sendAsyncAction(ActionTypes.PULLING_BANK_CFF);
    WebAPIUtils.pullBankCFF()
      .done((res) => ServerActions.getBank())
      .fail(handleError);
  },

  getMainPullProgress: () => {
    WebAPIUtils.getMainPullProgress()
      .done((res) => sendAsyncAction(ActionTypes.GET_MAIN_PULL_PROGRESS, res.data.progress))
      .fail(handleError);
  },

  getManual: () => {
    sendAsyncAction(ActionTypes.GETTING_MANUAL_CFF);
    WebAPIUtils.getManualCFF()
      .done((res) => sendAction(ActionTypes.MANUAL_CFF_UPDATED, res.data.cffs.manual))
      .fail(handleError);
  },

  saveManual: (cff) => {
    sendAsyncAction(ActionTypes.SAVING_MANUAL_CFF, cff);
    WebAPIUtils.saveManualCFF(cff)
      .done((res) => sendAction(ActionTypes.MANUAL_CFF_SAVED, cff))
      .fail(handleError);
  },

  getMatches: () => {
    sendAsyncAction(ActionTypes.GETTING_MATCHES);
    WebAPIUtils.getMatches()
      .done((res) => sendAction(ActionTypes.MATCHES_UPDATED, res.data.matches))
      .fail(handleError);
  },

  saveMatch: (data) => {
    data = data.toJS();
    sendAsyncAction(ActionTypes.SAVED_MATCH_OPTIMISTIC, data);
    WebAPIUtils.saveMatch(data.match)
      .done((res) => sendAction(ActionTypes.SAVED_MATCH, data))
      .fail((res) => sendAction(ActionTypes.SAVED_MATCH_UNDO, data));
  },

  deleteStagedMatch: (match) => {
    match = match.toJS();
    sendAsyncAction(ActionTypes.DELETING_STAGED_MATCH);
    WebAPIUtils.deleteStagedMatch(match)
      .done((res) => sendAction(ActionTypes.STAGED_MATCH_DELETED, match))
      .fail(handleError);
  },

  commitMatches: () => {
    sendAsyncAction(ActionTypes.COMMITTING_STAGED_MATCHES);
    WebAPIUtils.commitMatches()
      .done((res) => sendAction(ActionTypes.STAGED_MATCHES_COMMITTED, res))
      .fail(handleError);
  }

};

module.exports = ServerActions;