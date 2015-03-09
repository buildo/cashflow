/** @jsx React.DOM */

'use strict';

const React = require('react');
const RouteHandler = require('react-router').RouteHandler;
const ListenerMixin = require('alt/mixins/ListenerMixin');
const CFFActions = require('../../actions/CFFActions');
const CFFStore = require('../../store/CFFStore.js');

const getStateFromStores = function () {
  return CFFStore.getState();
};

const DataMain = React.createClass({

  mixins: [ListenerMixin],

  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    this.listenTo(CFFStore, this._onChange);
    if (!this.state.main) {
      CFFActions.getMain.defer();
    }
    if (!this.state.bank) {
      CFFActions.getBank.defer();
    }
    if (!this.state.manual) {
      CFFActions.getManual.defer();
    }
  },

  render: function () {
    return <RouteHandler/>;
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }

});

module.exports = DataMain;