'use strict';

const Dispatcher = require('../dispatcher/AppDispatcher');

const sendAction = (actionType, data) => {
  Dispatcher.handleViewAction({
    actionType: actionType,
    data: data
  });
};

const sendAsyncAction = (actionType, data) => setTimeout(() => sendAction(actionType, data));

module.exports = {

  sendAction: sendAction,
  sendAsyncAction: sendAsyncAction,

};