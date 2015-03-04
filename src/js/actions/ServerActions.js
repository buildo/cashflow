'use strict';

const alt = require('../../alt');
const axios = require('axios');

class ServerActions {
  handleError(res) {
    console.log('HTTP_ERROR');
    switch (res.status) {
      case 401:
        this.logOut(res);
        break;

      default:
        console.log(res.status);
        break;
    }
  },

  getCurrentUser() {
    WebAPIUtils.getCurrentUser().then(this.getCurrentUserSuccess, this.handleError)
    this.dispatch();
  },

  getCurrentUserSuccess(res) {
    this.dispatch(res.data.user);
  },

  checkToken() {
    WebAPIUtils.getCurrentUser().then(this.checkTokenSuccess, checkTokenFail);
    this.dispatch();
  },

  checkTokenSuccess() {
    this.dispatch();
  },

  checkTokenFail() {
    this.dispatch();
  },

  logOut(res) {
    this.dispatch(res.data);
  },

  logIn() {
    WebAPIUtils.login(loginFormData).then(this.logInSuccess, this.logInFail);
    this.dispatch();
  },

  logInSuccess(res) {
    this.dispatch(res.data);
  },

  logInFail(res) {
    this.dispatch(res.data);
  },

  getMain() {
    WebAPIUtils.getMainCFF().then(this.getMainSuccess, this.getMainFail);
    this.dispatch();
  },

  getMainSuccess(res) {
    this.dispatch(res.data.cffs.main);
  },

  getMainFail() {
    this.dispatch();
  },

  getBank() {
    WebAPIUtils.getBankCFF().then(this.getBankSuccess, this.getBankFail);
    this.dispatch();
  },

  getBankSuccess(res) {
    this.dispatch(res.data.cffs.bank);
  },

  getBankFail() {
    this.dispatch();
  },

  getManual() {
    WebAPIUtils.getManualCFF().then(this.getManualSuccess, this.getManualFail);
    this.dispatch();
  },

  getManualSuccess(res) {
    this.dispatch(res.data.cffs.manual);
  },

  getManualFail() {
    this.dispatch();
  },

  getMatches() {
    WebAPIUtils.getMatches().then(this.getMatchesSuccess, this.handleError);
    this.dispatch();
  },

  getMatchesSuccess(res) {
    this.dispatch(res.data.matches);
  },

  pullMain() {
    WebAPIUtils.pullMainCFF().catch(this.handleError);
    this.dispatch();
  },

  getMainPullProgress() {
    WebAPIUtils.getMainPullProgress().then((res) => this.dispatch(res.data.progress), this.handleError);
  },

  resetMainPullProgress() {
    WebAPIUtils.resetMainPullProgress().catch(this.handleError);
  },

  pullBank() {
    WebAPIUtils.pullBankCFF().then(this.getBank, this.handleError);
    this.dispatch();
  },

  deleteStagedMatch(match) {
    match = match.toJS();
    WebAPIUtils.deleteStagedMatch(match).catch(this.handleError);
    this.dispatch(match);
  },

  commitMatches() {
    WebAPIUtils.commitMatches().then(this.commitMatchesSuccess, this.handleError);
    this.dispatch();
  },

  commitMatchesSuccess() {
    this.dispatch();
  },

  saveMatch() {
    // TODO
    this.dispatch();
  }

}

module.exports = alt.createActions(ServerActions);


// const handleLoginError = (res) => {
//   console.log('LOGIN_FAILED');
//   sendAction(ActionTypes.LOGIN_FAIL, res.data);
// };

// const handleLoginSuccess = (res) => {
//   sendAction(ActionTypes.LOGGED_IN, res.data);
// };

// const handleError = (res) => {
//   console.log('HTTP_ERROR');
//   switch (res.status) {
//     case 401:
//       sendAction(ActionTypes.LOGGED_OUT, res.data);
//       break;

//     default:
//       console.log(res.status);
//       break;
//   }
// };

// const handleCFFError = (res, action) => {
//   switch (res.status) {
//     case 401:
//       sendAction(ActionTypes.LOGGED_OUT, res.data);
//       break;

//     case 400:
//       sendAction(action, undefined);
//       break;

//     default:
//       console.log(res.status);
//       break;
//   }
// };

// const ServerActions = {

//   getCurrentUser: () => {
//     sendAsyncAction(ActionTypes.GETTING_CURRENT_USER);
//     WebAPIUtils.getCurrentUser()
//       .done((res) => sendAction(ActionTypes.CURRENT_USER_UPDATED, res.data.user))
//       .fail(handleError);
//   },

//   checkTokenState: () => {
//     sendAsyncAction(ActionTypes.CHECKING_TOKEN_STATE);
//     WebAPIUtils.getCurrentUser()
//       .done((res) => sendAction(ActionTypes.TOKEN_IS_VALID))
//       .fail((res) => sendAction(ActionTypes.TOKEN_IS_INVALID));
//   },

//   attemptLogin: (loginFormData) => {
//     sendAsyncAction(ActionTypes.LOGIN_START);
//     WebAPIUtils.login(loginFormData)
//       .done(handleLoginSuccess)
//       .fail(handleLoginError);
//   },

//   getMain: () => {
//     sendAsyncAction(ActionTypes.GETTING_MAIN_CFF);
//     WebAPIUtils.getMainCFF()
//       .done((res) => sendAction(ActionTypes.MAIN_CFF_UPDATED, res.data.cffs.main))
//       .fail((res) => handleCFFError(res, ActionTypes.MAIN_CFF_UPDATED));
//   },

//   getBank: () => {
//     sendAsyncAction(ActionTypes.GETTING_BANK_CFF);
//     WebAPIUtils.getBankCFF()
//       .done((res) => sendAction(ActionTypes.BANK_CFF_UPDATED, res.data.cffs.bank))
//       .fail((res) => handleCFFError(res, ActionTypes.BANK_CFF_UPDATED));
//   },

//   pullMain: () => {
//     sendAsyncAction(ActionTypes.PULLING_MAIN_CFF);
//     WebAPIUtils.pullMainCFF()
//       .done()
//       .fail(handleError);
//   },

//   pullBank: () => {
//     sendAsyncAction(ActionTypes.PULLING_BANK_CFF);
//     WebAPIUtils.pullBankCFF()
//       .done((res) => ServerActions.getBank())
//       .fail(handleError);
//   },

//   getMainPullProgress: () => {
//     WebAPIUtils.getMainPullProgress()
//       .done((res) => sendAsyncAction(ActionTypes.GET_MAIN_PULL_PROGRESS, res.data.progress))
//       .fail(handleError);
//   },

//   resetMainPullProgress: () => {
//     WebAPIUtils.resetMainPullProgress()
//       .fail(handleError);
//   },

//   getManual: () => {
//     sendAsyncAction(ActionTypes.GETTING_MANUAL_CFF);
//     WebAPIUtils.getManualCFF()
//       .done((res) => sendAction(ActionTypes.MANUAL_CFF_UPDATED, res.data.cffs.manual))
//       .fail((res) => handleCFFError(res, ActionTypes.MANUAL_CFF_UPDATED));
//   },

//   saveManual: (cff) => {
//     sendAsyncAction(ActionTypes.SAVING_MANUAL_CFF, cff);
//     WebAPIUtils.saveManualCFF(cff)
//       .done((res) => sendAction(ActionTypes.MANUAL_CFF_SAVED, cff))
//       .fail(handleError);
//   },

//   getMatches: () => {
//     sendAsyncAction(ActionTypes.GETTING_MATCHES);
//     WebAPIUtils.getMatches()
//       .done((res) => sendAction(ActionTypes.MATCHES_UPDATED, res.data.matches))
//       .fail(handleError);
//   },

//   saveMatch: (data) => {
//     data = data.toJS();
//     sendAsyncAction(ActionTypes.SAVED_MATCH_OPTIMISTIC, data);
//     WebAPIUtils.saveMatch(data.match)
//       .done((res) => sendAction(ActionTypes.SAVED_MATCH, data))
//       .fail((res) => sendAction(ActionTypes.SAVED_MATCH_UNDO, data));
//   },

//   deleteStagedMatch: (match) => {
//     match = match.toJS();
//     sendAsyncAction(ActionTypes.DELETING_STAGED_MATCH);
//     WebAPIUtils.deleteStagedMatch(match)
//       .done((res) => sendAction(ActionTypes.STAGED_MATCH_DELETED, match))
//       .fail(handleError);
//   },

//   commitMatches: () => {
//     sendAsyncAction(ActionTypes.COMMITTING_STAGED_MATCHES);
//     WebAPIUtils.commitMatches()
//       .done((res) => sendAction(ActionTypes.STAGED_MATCHES_COMMITTED, res))
//       .fail(handleError);
//   }

// };

// module.exports = ServerActions;