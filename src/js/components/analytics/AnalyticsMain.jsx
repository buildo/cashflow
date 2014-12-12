/** @jsx React.DOM */

'use strict';

const React = require('react');
const RouteHandler = require('react-router').RouteHandler;
const ServerActions = require('../../actions/ServerActions');

const AnalyticsMain = React.createClass({

  getInitialState: function() {
    ServerActions.updateMain();
    return {};
  },

  componentDidMount: function() {
    // ServerActions.updateMain();
  },

  render: function () {
    return (
      <div>
        <RouteHandler/>
      </div>
    );
  },

});

module.exports = AnalyticsMain;