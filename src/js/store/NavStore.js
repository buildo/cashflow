'use strict';

const alt = require('../alt');
const _ = require('lodash');
const RouteActions = require('../actions/RouteActions');

class NavStore {

  constructor() {
    this.bindActions(RouteActions);
  }

  onRouteChanged(state) {
    const routes = state.routes;
    if (routes.length > 2) {
      this.selectedPage = routes[2].name;
      this.selectedTab = routes[3].name;
    }
  }

}

module.exports = alt.createStore(NavStore, 'NavStore');
