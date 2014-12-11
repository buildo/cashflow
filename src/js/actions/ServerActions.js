'use strict';

const C = require('../constants/AppConstants');
const Dispatcher = require('../dispatcher/AppDispatcher');
const ActionTypes = C.ActionTypes;
const HOST = 'http://localhost:9000';
const TOKEN = '"sR2m9QewdRbX2gvi"';

const sendAction = (actionType, data) => {
  Dispatcher.handleViewAction({
    actionType: actionType,
    data: data
  });
};

const handleError = (res) => {
  switch (res.code) {
    case 401:
      sendAction(ActionTypes.LOGIN_DONE, res.data);
      break;

    case 'error':
      sendAction(ActionTypes.LOGIN_FAIL, res.data);
      break;
  }
};

// TODO
const ServerActions = {

  getCurrentUser: () => {
    sendAction(ActionTypes.LOADING_CURRENT_USER);
    $.ajax({
      url: HOST + '/users/me',
      type: 'GET',
      headers: {'Authorization': 'Token token=' + TOKEN}
    })
    .done((res) => sendAction(ActionTypes.CURRENT_USER_UPDATED, res.data.user))
    .fail(handleError);
  },

  login: (email, password) => {
    sendAction(ActionTypes.LOGIN_STARTED);
    $.ajax({
      url: HOST + '/login',
      type: 'POST',
      data: {
        email: email,
        password: password
      },
      headers: {'Content-Type': 'application/json'}
    })
    .done((res) => sendAction(ActionTypes.LOGIN_DONE, res.data))
    .fail(handleError);
  },

  updateMain: () => {
    sendAction(ActionTypes.LOADING_MAIN_CFF);
    $.ajax({
      url: HOST + '/cffs/main',
      type: 'GET',
      headers: {'Authorization': 'Token token=' + TOKEN}
    })
    .done((res) => sendAction(ActionTypes.MAIN_CFF_UPDATED, res.data.cffs.main))
    .fail(handleError);
  }
};

module.exports = ServerActions;