'use strict';

const EventEmitter = require('events').EventEmitter;
const _ = require('lodash');
const Dispatcher = require('../dispatcher/AppDispatcher.js');

const optimisticMatch = /.*_(OPTIMISTIC|UNDO)/;
const undoMatch = /.*_UNDO/;
const optimisticReplace = /_(OPTIMISTIC|UNDO)/;

module.exports = function(waitFor, handlers, methods) {
  let store = {};
  _.assign(store, EventEmitter.prototype, {
    flush() {
      store.emit('change');
    },

    addChangeListener(callback) {
      store.on('change', callback);
    },

    removeChangeListener(callback) {
      store.removeListener('change', callback);
    },

    actionHandler(payload) {
      let tokens = (waitFor || []).map( s => s.dispatchToken );
      Dispatcher.waitFor(tokens);

      let optimistic = !!(payload.action.actionType.match(optimisticMatch));
      let undo = !!(payload.action.actionType.match(undoMatch));
      let baseAction = payload.action.actionType.replace(optimisticReplace, '');
      let handler = handlers ? handlers[baseAction] : undefined;
      if (handler && handler(payload.action.data, optimistic, undo)) {
        store.flush();
      }
    }
  }, methods);

  store.dispatchToken = Dispatcher.register(store.actionHandler);
  return store;
};
