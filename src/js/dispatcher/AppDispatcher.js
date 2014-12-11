'use strict';

let Dispatcher = require('flux').Dispatcher;
const _ = require('lodash');

module.exports = _.extend(new Dispatcher(), {
  handleViewAction: function(action) {
    this.dispatch({
      source : 'VIEW_ACTION',
      action: action
    });
  }
});
