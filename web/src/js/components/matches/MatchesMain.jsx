/** @jsx React.DOM */

'use strict';

const React = require('react');
const RouteHandler = require('react-router').RouteHandler;
const ListenerMixin = require('alt/mixins/ListenerMixin');
const MatchActions = require('../../actions/MatchActions');
const MatchesStore = require('../../store/MatchesStore.js');
const Loader = require('../Loader.jsx');

const getStateFromStores = function () {
  return MatchesStore.getState();
};

const MatchesMain = React.createClass({

  mixins: [ListenerMixin],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    this.listenTo(MatchesStore, this._onChange);
    // MatchActions.getMatches.defer();
  },

  render: function() {
    if (this.state.isLoadingMatches) {
      return <Loader />;
    }
    return <RouteHandler/>;
  },

  _onChange: function() {
    this.setState(getStateFromStores());
    if (this.state.isOutdated) {
      MatchActions.getMatches.defer();
    }
  }

});

module.exports = MatchesMain;

