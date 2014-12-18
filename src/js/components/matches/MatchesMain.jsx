/** @jsx React.DOM */

'use strict';

const React = require('react');
const RouteHandler = require('react-router').RouteHandler;
const ServerActions = require('../../actions/ServerActions');


const MatchesMain = React.createClass({

  componentDidMount: function() {
    ServerActions.getMatches();
  },

  render: function() {
    return <RouteHandler/>;
  },

});

module.exports = MatchesMain;

