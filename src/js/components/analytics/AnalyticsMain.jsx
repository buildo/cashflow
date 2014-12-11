/** @jsx React.DOM */

'use strict';

const React = require('react');
const RouteHandler = require('react-router').RouteHandler;

const AnalyticsMain = React.createClass({

  render: function () {
    return (
      <div>
        <RouteHandler/>
      </div>
    );
  },

});

module.exports = AnalyticsMain;