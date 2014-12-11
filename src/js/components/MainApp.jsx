/** @jsx React.DOM */

'use strict';

const React = require('react');
const RouteHandler = require('react-router').RouteHandler;

const MainApp = React.createClass({

  render: function () {
    return (
      <RouteHandler/>
    );
  },

});

module.exports = MainApp;