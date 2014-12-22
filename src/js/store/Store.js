'use strict';

const EventEmitter = require('events').EventEmitter;
const _ = require('lodash');
const DataStore = require('./DataStore');
const OptimisticDataStore = require('./OptimisticDataStore');

const optimisticMatch = /.*_(OPTIMISTIC|UNDO)/;
const undoMatch = /.*_UNDO/;
const optimisticReplace = /_(OPTIMISTIC|UNDO)/;

module.exports = _.extend(function(
  // App dispatcher. interface:
  //   register(store.handlerFn)
  //   waitFor(dispatchTokens[])
  Dispatcher,

  // List of Stores to waitFor
  // each store should have a `dispatchToken` property
  waitFor,

  // Handlers object. ACTION_NAMEs are keys
  // actionHandler signature:
  //   handlerFn(payload:Any [,optimistic:Bool, undo:Bool])
  // optimistic and undo flags are optional and passed
  // in case of _OPTIMISTIC or _UNDO action
  handlers,

  // Getter methods object to be mixed in
  methods) {

  let _optimisticHandling = false;

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

    isOptimisticHandling() {
      return _optimisticHandling;
    },

    setOptimisticHandling(value) {
      _optimisticHandling = value;
    },

    actionHandler(payload) {
      let tokens = (waitFor || []).map( s => s.dispatchToken ).filter( _.identity );
      Dispatcher.waitFor(tokens);

      let optimistic = !!(payload.action.actionType.match(optimisticMatch));
      let undo = !!(payload.action.actionType.match(undoMatch));
      let baseAction = payload.action.actionType.replace(optimisticReplace, '');
      let handler = handlers ? handlers[baseAction] : undefined;

      _optimisticHandling = optimistic || undo;
      if (handler && handler(payload.action.data, optimistic, undo)) {
        store.flush();
      }
    }
  }, methods);

  store.dispatchToken = Dispatcher.register(store.actionHandler);

  return store;
}, {
  Data: DataStore,
  Optimistic: OptimisticDataStore
});