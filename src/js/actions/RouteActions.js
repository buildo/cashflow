'use strict';

const alt = require('../alt');

class RouteActions {

  routeChanged(state) {
    this.dispatch(state);
  }

}

module.exports = alt.createActions(RouteActions);