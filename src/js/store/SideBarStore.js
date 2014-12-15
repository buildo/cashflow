'use strict';

const _ = require('lodash');
const DataStore = require('./DataStore');
const Store = require('./Store');

let selectedPage;
let selectedTab;

const self = {}; // TODO: remove once fat-arrow this substitution is fixed in es6 transpiler
module.exports = _.extend(self, Store(
  // waitFor other Stores
  [], {
  // action handlers
  ROUTE_CHANGED: (state) => {
    const routes = state.routes;
    if (routes.length > 2) {
      selectedPage = routes[2].name;
      selectedTab = routes[3].name;
    }
    return true;
  }

}, {
  // custom getters
  getSelectedPage() {
    return selectedPage;
  },

  getSelectedTab() {
    return selectedTab;
  },

}));
