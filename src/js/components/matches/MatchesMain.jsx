/** @jsx React.DOM */

'use strict';

const React = require('react');
const RouteHandler = require('react-router').RouteHandler;
const ServerActions = require('../../actions/ServerActions');
const MatchesStore = require('../../store/MatchesStore.js');

const getStateFromStores = function () {
  return {
    isMatchesOutdated: MatchesStore.isMatchesOutdated()
  };
};

const MatchesMain = React.createClass({

  componentDidMount: function() {
    MatchesStore.addChangeListener(this._onChange);
    ServerActions.getMatches();
  },

  componentWillUnmount: function() {
    MatchesStore.removeChangeListener(this._onChange);
  },

  render: function() {
    console.log('RENDER_MATCHES');
    return <RouteHandler/>;
  },

  _onChange: function() {
    this.setState(getStateFromStores());
    if (this.state.isMatchesOutdated) {
      ServerActions.getMatches();
    }
  }

});

module.exports = MatchesMain;

