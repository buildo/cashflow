/** @jsx React.DOM */

'use strict';

const React = require('react');
const RouteHandler = require('react-router').RouteHandler;
const ListenerMixin = require('alt/mixins/ListenerMixin');
const MatchActions = require('../../actions/MatchActions');
const MatchesStore = require('../../store/MatchesStore.js');

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
    MatchActions.getMatches.defer();
  },

  render: function() {
    if (this.state.isLoading) {
      return (
        <div className="ui segment">
          <div className="ui active inverted dimmer">
            <div className="ui indeterminate text active loader">
              Caricamento...
            </div>
          </div>
          <br></br>
          <br></br>
          <br></br>
        </div>
      );
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

