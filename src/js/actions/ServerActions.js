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

// TODO
const ServerActions = {

  updateMain: () => {
    sendAction(ActionTypes.LOADING_MAIN_CFF);
    $.ajax({
      url: HOST + '/cffs/main',
      type: 'GET',
      headers: {'Authorization': 'Token token=' + TOKEN}
    }).done((res) => sendAction(ActionTypes.MAIN_CFF_UPDATED, res.data.cffs.main));
  }
};

module.exports = ServerActions;