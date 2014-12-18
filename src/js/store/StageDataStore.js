'use strict';

const _ = require('lodash');
const Dispatcher = require('../dispatcher/AppDispatcher.js');
const Store = require('./Store');

const self = {}; // TODO: remove once fat-arrow this substitution is fixed in es6 transpiler
module.exports = _.extend(self, Store.Optimistic, Store(
  Dispatcher,
  // waitFor other Stores
  [],

  {
  // action handlers
  MATCHES_UPDATED: (actionData) => {
    console.log(actionData);
    self.deleteAll();
    // insert payments
    actionData.stage.forEach((match) => self.insert((match.main.id + match.data.id), match));
    return true;
  },

  SAVE_MATCH_TO_STAGE: (actionData, optimistic, undo) => {
    return undo ? self.remove(actionData.id) : self.upsert(actionData.id, actionData.match);
  }

}, {
  // custom getters
  getAll() {
    return [{
      main: {
        date: '2014-08-18',
        grossAmount: 4042.99,
        id: '90e4c3b834f69ddfbe3550bfcd1edda0b2b4e057_0',
        method: "Bonifico - IT76G0538712800000002134722",
        info: {
          description: "PAGAM. DELEGA UNIFICATA DELEGA F24 - CBI DEL : 18.08.2014",
          flowDirection: "out",
          lineId: "90e4c3b834f69ddfbe3550bfcd1edda0b2b4e057",
          sourceId: "BPER",
          company: {
            description: "CBI s.r.l.",
            id: 235269
          },
          currency: {
            conversion: 1,
            name: "EUR"
          }
        }
      },
      data: {
        date: '2014-08-18',
        grossAmount: 4042.99,
        id: '90e4c3b834f69ddfbe3550bfcd1edda0b2b4e057_0',
        info: {
          description: "PAGAM. DELEGA UNIFICATA DELEGA F24 - CBI DEL : 18.08.2014",
          flowDirection: "out",
          lineId: "90e4c3b834f69ddfbe3550bfcd1edda0b2b4e057",
          sourceId: "BPER"
        }
      }
    }];
    // return self.getAll();
  },

}));
